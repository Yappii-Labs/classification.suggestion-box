export interface OllamaParams {
  prompt: string;
  data?: Record<string, unknown>;
  result_format?: {
    type: string;
    properties: {
      lang_id: {
        type: string;
        enum: string[];
      };
      classification: {
        type: string;
        enum: string[];
      };
    };
    required: string[];
  };
}
