export interface OllamaResponse<T = unknown> {
  response: string;
  result?: T;
  raw: unknown;
}

export interface ClassificationResult {
  lang_id: "en" | "id";
  classification:
  "Kurikulum" | "Prasarana" | "Kesiswaan" |
  "Curriculum" | "Facilities" | "Student Affairs";
}
