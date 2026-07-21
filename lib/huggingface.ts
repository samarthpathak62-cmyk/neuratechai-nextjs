/**
 * lib/huggingface.ts
 *
 * Thin wrapper around the public Hugging Face Hub API. Used to keep our
 * `SyncedModel` table up to date with real download/like counts for models
 * we publish there. No API key is required for public model metadata;
 * set HF_TOKEN only if you need to sync private/gated repos.
 */

export interface HFModelInfo {
  id: string;
  downloads: number;
  likes: number;
  pipeline_tag?: string;
  library_name?: string;
}

export async function fetchHFModel(hfModelId: string): Promise<HFModelInfo | null> {
  const headers: Record<string, string> = {};
  if (process.env.HF_TOKEN) headers.Authorization = `Bearer ${process.env.HF_TOKEN}`;

  const res = await fetch(`https://huggingface.co/api/models/${hfModelId}`, {
    headers,
    // Model metadata changes slowly — avoid hammering HF on every request.
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error(`[huggingface] failed to fetch ${hfModelId}: ${res.status}`);
    return null;
  }

  const data = await res.json();
  return {
    id: data.id,
    downloads: data.downloads ?? 0,
    likes: data.likes ?? 0,
    pipeline_tag: data.pipeline_tag,
    library_name: data.library_name,
  };
}
