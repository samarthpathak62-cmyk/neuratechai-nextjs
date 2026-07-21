import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HFSyncButton } from "@/components/admin/hf-sync-button";

export default async function AdminOverviewPage() {
  const [totalUsers, totalPosts, totalPapers, syncedModels] = await Promise.all([
    prisma.user.count(),
    prisma.blogPost.count(),
    prisma.researchPaper.count(),
    prisma.syncedModel.count(),
  ]);

  return (
    <div>
      <h1 className="font-display text-[1.7rem] mb-1.5">Admin overview</h1>
      <p className="text-ink-dim text-sm mb-8">Manage users, content, and platform data.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <Stat label="Total users" value={totalUsers} />
        <Stat label="Blog posts" value={totalPosts} />
        <Stat label="Research papers" value={totalPapers} />
        <Stat label="Synced HF models" value={syncedModels} />
      </div>

      <div className="glass p-7 mb-6">
        <h3 className="font-display text-[1.05rem] mb-3">Hugging Face sync</h3>
        <p className="text-ink-dim text-sm mb-4">
          Pull the latest downloads/likes from Hugging Face for the models tracked in{" "}
          <code className="font-mono text-xs bg-white/[0.05] px-1.5 py-0.5 rounded">
            app/api/huggingface/sync/route.ts
          </code>
          .
        </p>
        <HFSyncButton />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <QuickLink href="/admin/blog" title="Blog CMS" body="Create, edit, publish, and delete blog posts." />
        <QuickLink href="/admin/research" title="Research CMS" body="Manage papers, projects, datasets, experiments." />
        <QuickLink href="/admin/content" title="Site content" body="Changelog, roadmap, datasets, benchmarks, status." />
        <QuickLink href="/admin/users" title="Users" body="View all accounts and grant/revoke admin access." />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass p-6 text-center">
      <div className="font-mono text-xl font-bold text-cyan">{value}</div>
      <div className="text-ink-faint text-xs uppercase tracking-wider mt-1.5">{label}</div>
    </div>
  );
}

function QuickLink({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="glass p-6 block hover:border-cyan/30">
      <h3 className="font-display text-[1.05rem] mb-1.5">{title}</h3>
      <p className="text-ink-dim text-sm">{body}</p>
    </Link>
  );
}
