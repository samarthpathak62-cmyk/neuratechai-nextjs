import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { fetchHFModel } from "@/lib/huggingface";

// The set of HF repos this site tracks. Edit this list as you publish
// new models — everything else (downloads, likes) is pulled live from HF.
const TRACKED_REPOS = [
  "neuratech-ai/neuron-4b",
  "neuratech-ai/neuron-14b",
  "neuratech-ai/neuron-embed",
];

/**
 * GET  → read the last-synced snapshot from the database (fast, no HF call).
 * POST → trigger a fresh sync from Hugging Face. Callable by an admin from
 *        the CMS, or by a scheduled cron job (e.g. Vercel Cron) hitting this
 *        route with a shared secret instead of a session — see CRON_SECRET below.
 */
export async function GET() {
  const models = await prisma.syncedModel.findMany({ orderBy: { downloads: "desc" } });
  return Response.json({ models });
}

export async function POST(req: Request) {
  const session = await auth();
  const cronSecret = req.headers.get("x-cron-secret");
  const isAuthorizedCron = process.env.CRON_SECRET && cronSecret === process.env.CRON_SECRET;
  const isAdmin = session?.user?.role === "ADMIN";

  if (!isAdmin && !isAuthorizedCron) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const results = [];
  for (const repoId of TRACKED_REPOS) {
    const info = await fetchHFModel(repoId);
    if (!info) {
      results.push({ repoId, ok: false });
      continue;
    }
    const saved = await prisma.syncedModel.upsert({
      where: { hfModelId: repoId },
      create: {
        hfModelId: repoId,
        displayName: repoId.split("/")[1] ?? repoId,
        downloads: info.downloads,
        likes: info.likes,
        pipelineTag: info.pipeline_tag,
        library: info.library_name,
      },
      update: {
        downloads: info.downloads,
        likes: info.likes,
        pipelineTag: info.pipeline_tag,
        library: info.library_name,
        lastSyncedAt: new Date(),
      },
    });
    results.push({ repoId, ok: true, model: saved });
  }

  return Response.json({ synced: results.length, results });
}
