import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = { title: "Documentation" };

const NAV = [
  { id: "installation", label: "Installation" },
  { id: "api-reference", label: "API Reference" },
  { id: "examples", label: "Examples" },
  { id: "guides", label: "Guides" },
  { id: "sdk", label: "SDK" },
  { id: "auth", label: "Authentication" },
  { id: "rate-limits", label: "Rate Limits" },
  { id: "errors", label: "Error Codes" },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-void border border-white/[0.08] rounded-md p-4 overflow-x-auto font-mono text-[0.85rem] text-cyan/90 mb-4 whitespace-pre-wrap">
      {children}
    </pre>
  );
}

function Table({ rows, headers }: { headers: string[]; rows: string[][] }) {
  return (
    <table className="w-full border-collapse mb-4">
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} className="text-left px-3.5 py-2.5 border-b border-white/[0.08] text-ink-faint uppercase text-[0.72rem] tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((cell, j) => (
              <td key={j} className="px-3.5 py-2.5 border-b border-white/[0.08] text-[0.88rem]">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <header className="pt-36 pb-10 text-center relative">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="eyebrow inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> Documentation</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] mt-4 mb-3">Build with Neura Tech AI</h1>
          <p className="text-ink-dim max-w-[560px] mx-auto">Everything you need to install the SDK, authenticate, and start calling models.</p>
        </div>
      </header>

      <section className="py-14">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8 grid md:grid-cols-[220px_1fr] gap-12">
          <nav className="hidden md:block sticky top-24 self-start">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="block px-3 py-2 rounded-md text-ink-dim text-[0.88rem] hover:text-ink hover:bg-white/[0.04]">
                {n.label}
              </a>
            ))}
          </nav>

          <div>
            <div id="installation" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-[1.4rem] mb-3.5">Installation</h2>
              <p className="text-ink-dim mb-3.5">Install the official SDK, or call the REST API directly with any HTTP client.</p>
              <CodeBlock>npm install @neuratech/sdk</CodeBlock>
              <CodeBlock>pip install neuratech</CodeBlock>
            </div>

            <div id="api-reference" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-[1.4rem] mb-3.5">API Reference</h2>
              <p className="text-ink-dim mb-3.5">
                All requests go through a single chat completions endpoint. The backend routes the
                request to the selected model via LiteLLM — the request shape never changes when
                you switch providers.
              </p>
              <CodeBlock>{`POST https://api.neuratech.ai/v1/chat/completions

{
  "model": "neuron-14b",
  "messages": [{ "role": "user", "content": "Hello" }],
  "temperature": 0.7,
  "max_tokens": 2048,
  "stream": true
}`}</CodeBlock>
            </div>

            <div id="examples" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-[1.4rem] mb-3.5">Examples</h2>
              <p className="text-ink-dim mb-3.5">A minimal streaming request using the JavaScript SDK:</p>
              <CodeBlock>{`import { Neura } from "@neuratech/sdk";

const client = new Neura({ apiKey: process.env.NEURA_API_KEY });

const stream = await client.chat.stream({
  model: "neuron-14b",
  messages: [{ role: "user", content: "Explain mixture-of-experts" }],
});

for await (const chunk of stream) {
  process.stdout.write(chunk.delta);
}`}</CodeBlock>
            </div>

            <div id="guides" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-[1.4rem] mb-3.5">Guides</h2>
              <Table
                headers={["Guide", "Description"]}
                rows={[
                  ["Quickstart", "Send your first request in under 5 minutes"],
                  ["Streaming responses", "Handle server-sent events and partial tokens"],
                  ["Vision inputs", "Send images alongside text to Nexa AI"],
                  ["Function calling", "Define tools and parse structured outputs"],
                  ["Self-hosting", "Point the LiteLLM gateway at your own vLLM instance"],
                ]}
              />
            </div>

            <div id="sdk" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-[1.4rem] mb-3.5">SDK</h2>
              <p className="text-ink-dim">
                Official SDKs are available for JavaScript/TypeScript, Python, and Go. All wrap the
                same REST API and support streaming out of the box.
              </p>
            </div>

            <div id="auth" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-[1.4rem] mb-3.5">Authentication</h2>
              <p className="text-ink-dim mb-3.5">Authenticate using a bearer token in the Authorization header.</p>
              <CodeBlock>Authorization: Bearer NEURA_API_KEY</CodeBlock>
            </div>

            <div id="rate-limits" className="mb-14 scroll-mt-24">
              <h2 className="font-display text-[1.4rem] mb-3.5">Rate Limits</h2>
              <Table
                headers={["Tier", "Requests / min", "Tokens / min"]}
                rows={[
                  ["Free", "20", "40,000"],
                  ["Pro", "300", "1,000,000"],
                  ["Enterprise", "Custom", "Custom"],
                ]}
              />
            </div>

            <div id="errors" className="mb-4 scroll-mt-24">
              <h2 className="font-display text-[1.4rem] mb-3.5">Error Codes</h2>
              <Table
                headers={["Code", "Meaning"]}
                rows={[
                  ["400", "Invalid request — check required fields"],
                  ["401", "Missing or invalid API key"],
                  ["429", "Rate limit exceeded"],
                  ["500", "Upstream model provider error"],
                  ["503", "Model temporarily unavailable"],
                ]}
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
