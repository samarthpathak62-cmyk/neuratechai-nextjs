"use client";

import { useRef, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, Square, Download, ImageIcon, Mic, Send, Plus } from "lucide-react";
import { AVAILABLE_MODELS } from "@/types/chat";
import type { ChatMessage } from "@/types/chat";

const HISTORY_DEMO = [
  "Explain mixture-of-experts",
  "Refactor this Python function",
  "Draft a product roadmap",
  "Summarize research paper",
  "Compare Neuron 4B vs 14B",
];

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi, I'm Nexa — running on Neuron 14B. Ask me anything about code, research, or how to integrate the API." },
  ]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>("neuron-14b");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are Nexa, a precise and helpful AI assistant built by Neura Tech AI."
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || isStreaming) return;

    const newHistory: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...newHistory, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens,
          stream: true,
          messages: [{ role: "system", content: systemPrompt }, ...newHistory],
        }),
      });

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({ error: "Request failed." }));
        appendToLastAssistant(`⚠️ ${errBody.error ?? "Something went wrong."}`);
        setIsStreaming(false);
        return;
      }

      // Parse the SSE stream coming from LiteLLM (OpenAI-compatible `delta.content` chunks).
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.replace(/^data:\s*/, "");
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            const delta: string | undefined = json?.choices?.[0]?.delta?.content;
            if (delta) appendToLastAssistant(delta, true);
          } catch {
            // ignore malformed keep-alive lines
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        appendToLastAssistant("⚠️ Connection to the model gateway failed.");
      }
    } finally {
      setIsStreaming(false);
    }
  }

  function appendToLastAssistant(chunk: string, append = false) {
    setMessages((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last?.role === "assistant") {
        copy[copy.length - 1] = {
          ...last,
          content: append ? last.content + chunk : chunk,
        };
      }
      return copy;
    });
  }

  function stopGeneration() {
    abortRef.current?.abort();
    setIsStreaming(false);
  }

  function regenerate() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages((prev) => prev.slice(0, -1)); // drop last assistant reply
    sendMessage(lastUser.content);
  }

  function exportChat() {
    const text = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neura-chat-export.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function newChat() {
    setMessages([{ role: "assistant", content: "New conversation started. How can I help?" }]);
  }

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] h-[calc(100vh-72px)]">
        {/* Sidebar */}
        <aside className="hidden lg:block border-r border-white/[0.08] p-5 overflow-y-auto">
          <button
            onClick={newChat}
            className="w-full py-2.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-sm flex items-center justify-center gap-2 mb-4 hover:bg-white/[0.07]"
          >
            <Plus size={15} /> New chat
          </button>
          {HISTORY_DEMO.map((h, i) => (
            <div
              key={h}
              className={`px-3 py-2.5 rounded-md text-sm truncate cursor-pointer mb-1 ${
                i === 0 ? "bg-white/[0.04] text-ink" : "text-ink-dim hover:bg-white/[0.04] hover:text-ink"
              }`}
            >
              {h}
            </div>
          ))}
        </aside>

        {/* Chat */}
        <main className="flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[720px] flex gap-3.5 ${m.role === "user" ? "self-end flex-row-reverse" : ""}`}>
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-[0.7rem] font-bold flex-shrink-0 ${
                    m.role === "assistant" ? "bg-grad-brand text-[#04121a]" : "bg-white/[0.04] border border-white/[0.08]"
                  }`}
                >
                  {m.role === "assistant" ? "AI" : "You"}
                </div>
                <div className="flex-1">
                  <div
                    className={`px-4 py-3.5 rounded-md text-[0.94rem] leading-relaxed border ${
                      m.role === "user"
                        ? "bg-cyan/[0.08] border-cyan/20"
                        : "bg-white/[0.04] border-white/[0.08]"
                    }`}
                  >
                    {m.content || (isStreaming && i === messages.length - 1 ? "…" : "")}
                  </div>
                  {m.role === "assistant" && m.content && (
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(m.content)}
                        className="p-1 rounded text-ink-faint hover:text-cyan hover:bg-white/[0.04]"
                        title="Copy"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.08] px-6 py-4">
            <div className="flex items-end gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-md pl-4 pr-2.5 py-2.5">
              <button className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.08] text-ink-dim flex items-center justify-center flex-shrink-0 hover:text-cyan" title="Upload image (placeholder)">
                <ImageIcon size={16} />
              </button>
              <button className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.08] text-ink-dim flex items-center justify-center flex-shrink-0 hover:text-cyan" title="Voice input (placeholder)">
                <Mic size={16} />
              </button>
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Message Nexa AI..."
                className="flex-1 bg-transparent outline-none resize-none text-[0.94rem] py-1.5 max-h-40"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isStreaming}
                className="w-9 h-9 rounded-md bg-grad-brand text-[#04121a] flex items-center justify-center flex-shrink-0 disabled:opacity-50"
                title="Send"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="flex gap-2.5 mt-2.5 justify-center">
              <Button variant="ghost" size="sm" onClick={regenerate}><RotateCcw size={14} /> Regenerate</Button>
              <Button variant="ghost" size="sm" onClick={stopGeneration}><Square size={14} /> Stop</Button>
              <Button variant="ghost" size="sm" onClick={exportChat}><Download size={14} /> Export Chat</Button>
            </div>
          </div>
        </main>

        {/* Settings */}
        <aside className="hidden lg:block border-l border-white/[0.08] p-5 overflow-y-auto">
          <Field label="Model">
            <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-panel border border-white/[0.08] rounded-md px-3 py-2.5 text-[0.88rem]">
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </Field>
          <Field label={`Temperature ${temperature}`}>
            <input type="range" min={0} max={1} step={0.1} value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full accent-cyan" />
          </Field>
          <Field label={`Max Tokens ${maxTokens}`}>
            <input type="range" min={256} max={8192} step={256} value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))} className="w-full accent-cyan" />
          </Field>
          <Field label="System Prompt">
            <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} className="w-full bg-panel border border-white/[0.08] rounded-md px-3 py-2.5 text-[0.88rem] min-h-[90px]" />
          </Field>
        </aside>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-[0.78rem] uppercase tracking-wider text-ink-faint mb-2.5">{label}</label>
      {children}
    </div>
  );
}
