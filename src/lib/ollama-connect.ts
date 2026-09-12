import type { OllamaParams } from "../types/ollama.params";
import type { OllamaResponse } from "../types/ollama.response";

export class OllamaConnect {
  private readonly model: string;
  private readonly baseUrl: string;

  private constructor(model: string, baseUrl = "http://localhost:11434") {
    this.model = model;
    this.baseUrl = baseUrl;
  }

  static async create(
    model: string,
    baseUrl = "http://localhost:11434",
  ): Promise<OllamaConnect> {
    const ollama = new OllamaConnect(model, baseUrl);

    await ollama.connect();

    return ollama;
  }

  private async connect(): Promise<void> {
    try {
      const response = await fetch(this.baseUrl);

      if (!response.ok) {
        throw new Error(`Ollama returned HTTP ${response.status}.`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to connect to Ollama at ${this.baseUrl}: ${error.message}`,
        );
      }

      throw new Error(`Failed to connect to Ollama at ${this.baseUrl}.`);
    }
  }

  async generate<T = unknown>(
    params: OllamaParams,
  ): Promise<OllamaResponse<T>> {
    const { prompt, data = {}, result_format } = params;

    const fullPrompt = this.buildPrompt(prompt, data);

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        prompt: fullPrompt,
        stream: false,
        format: result_format ?? undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama error ${response.status}: ${await response.text()}`,
      );
    }

    const raw = await response.json();

    const result = this.parseResult<T>(raw.response);

    return {
      response: raw.response,
      result,
      raw,
    };
  }

  private buildPrompt(
    prompt: string,
    data: Record<string, unknown>,
  ): string {
    return `
      ${prompt}

      DATA:
      ${JSON.stringify(data, null, 2)}
    `.trim();
  }

  private parseResult<T>(response: string): T | undefined {
    try {
      return JSON.parse(response) as T;
    } catch {
      return undefined;
    }
  }
}
