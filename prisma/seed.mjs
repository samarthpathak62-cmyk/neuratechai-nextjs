// prisma/seed.mjs
//
// Populates demo content for the pages that read from the database
// (benchmarks, datasets, changelog, roadmap, status, blog, research) so the
// site looks complete immediately after `npx prisma db push`. Safe to run
// multiple times — it skips anything that already exists.
//
// Run with: npm run db:seed  (or `npx prisma db seed`)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ---------- Benchmarks ----------
  const benchmarkCount = await prisma.benchmark.count();
  if (benchmarkCount === 0) {
    await prisma.benchmark.createMany({
      data: [
        { modelName: "Neuron 4B", suite: "MMLU", score: 61.2 },
        { modelName: "Neuron 4B", suite: "HumanEval", score: 42.8 },
        { modelName: "Neuron 4B", suite: "GSM8K", score: 58.4 },
        { modelName: "Neuron 14B", suite: "MMLU", score: 74.6 },
        { modelName: "Neuron 14B", suite: "HumanEval", score: 63.1 },
        { modelName: "Neuron 14B", suite: "GSM8K", score: 79.3 },
        { modelName: "Neuron MoE", suite: "MMLU", score: 83.9 },
        { modelName: "Neuron MoE", suite: "HumanEval", score: 71.5 },
        { modelName: "Neuron MoE", suite: "GSM8K", score: 88.7 },
      ],
    });
    console.log("Seeded benchmarks");
  }

  // ---------- Datasets ----------
  const datasetCount = await prisma.dataset.count();
  if (datasetCount === 0) {
    await prisma.dataset.createMany({
      data: [
        {
          name: "NeuraCode-1M",
          description: "1M permissively licensed code samples across 40 languages, curated for instruction tuning.",
          sizeLabel: "1M samples",
          license: "Apache 2.0",
        },
        {
          name: "OpenReason Bench",
          description: "A reasoning evaluation set spanning math, logic, and multi-step planning tasks.",
          sizeLabel: "50K rows",
          license: "CC-BY-4.0",
        },
        {
          name: "Longform-QA",
          description: "Question-answering pairs grounded in documents exceeding 50K tokens.",
          sizeLabel: "120K pairs",
          license: "CC-BY-4.0",
        },
      ],
    });
    console.log("Seeded datasets");
  }

  // ---------- Changelog ----------
  const changelogCount = await prisma.changelogEntry.count();
  if (changelogCount === 0) {
    await prisma.changelogEntry.createMany({
      data: [
        { version: "v2.4.0", title: "Neuron 14B general availability", body: "Faster, cheaper, and better at long-context tasks than its predecessor.", tag: "Feature" },
        { version: "v2.3.1", title: "Fixed streaming disconnect on long responses", body: "Resolved an issue where the Playground would drop the connection on responses over 4K tokens.", tag: "Fix" },
        { version: "v2.3.0", title: "Added embeddings endpoint", body: "New /api/embeddings route backed by Neuron Embed, routed through LiteLLM like everything else.", tag: "Feature" },
        { version: "v2.2.0", title: "Improved rate limit headers", body: "Rate-limited responses now include Retry-After so clients can back off correctly.", tag: "Improvement" },
      ],
    });
    console.log("Seeded changelog");
  }

  // ---------- Roadmap ----------
  const roadmapCount = await prisma.roadmapItem.count();
  if (roadmapCount === 0) {
    await prisma.roadmapItem.createMany({
      data: [
        { title: "Neuron MoE general availability", description: "Scaling our mixture-of-experts architecture to production with lower latency per active parameter.", status: "NOW" },
        { title: "Native voice & vision pipeline", description: "Unified multi-modal endpoint for real-time audio and image understanding.", status: "NEXT" },
        { title: "Self-hosted deployment kit", description: "One-command deploy for vLLM / llama.cpp backends behind the same LiteLLM gateway contract.", status: "NEXT" },
        { title: "Fine-tuning API", description: "Upload a dataset, fine-tune Neuron 4B/14B, and deploy the result without leaving the platform.", status: "LATER" },
        { title: "Playground v1", description: "Streaming chat interface with model/temperature/system-prompt controls.", status: "SHIPPED" },
      ],
    });
    console.log("Seeded roadmap");
  }

  // ---------- Status components ----------
  const statusCount = await prisma.statusComponent.count();
  if (statusCount === 0) {
    await prisma.statusComponent.createMany({
      data: [
        { name: "Chat API", status: "operational", uptimePct90d: 99.98 },
        { name: "Vision API", status: "operational", uptimePct90d: 99.95 },
        { name: "Image Generation API", status: "operational", uptimePct90d: 99.9 },
        { name: "Embeddings API", status: "operational", uptimePct90d: 99.99 },
        { name: "Playground", status: "operational", uptimePct90d: 99.97 },
      ],
    });
    console.log("Seeded status components");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
