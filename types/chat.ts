export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequestBody {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface EmbeddingsRequestBody {
  model: string;
  input: string | string[];
}

export interface ImageGenerationRequestBody {
  model: string;
  prompt: string;
  size?: string;
  n?: number;
}

export interface VisionRequestBody {
  model: string;
  messages: Array<{
    role: ChatRole;
    content: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    >;
  }>;
  max_tokens?: number;
}

export interface AudioTranscriptionRequestBody {
  model: string;
  /** Base64-encoded audio payload */
  audio: string;
  format?: "wav" | "mp3" | "m4a";
}

/** The only models exposed to the client — actual routing lives in LiteLLM config. */
export const AVAILABLE_MODELS = [
  { id: "neuron-4b", label: "Neuron 4B" },
  { id: "neuron-14b", label: "Neuron 14B" },
  { id: "neuron-moe", label: "Neuron MoE (preview)" },
  { id: "nexa-ai", label: "Nexa AI (multi-modal)" },
] as const;

export type ModelId = (typeof AVAILABLE_MODELS)[number]["id"];
