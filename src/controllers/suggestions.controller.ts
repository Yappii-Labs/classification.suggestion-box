import { env } from "../config/env";
import type { Request, Response } from "express";
import { OllamaConnect } from "../lib/ollama-connect";
import type { ClassificationResult } from "../types/ollama.response";
import { schema as suggesstionSchema } from "../validations/suggestion.shema";
import {
  successResponse,
  validationErrorResponse,
  errorResponse,
  resultFormat,
} from "../lib/utils";

export async function getClassifications(req: Request, res: Response) {
  try {
    const result = suggesstionSchema.safeParse(req.body);

    if (!result.success) {
      return validationErrorResponse(res, result.error);
    }

    if (!env.OLLAMA_MODEL) {
      return errorResponse(res, "Ollama model is not configured.", 500);
    }

    const ollama = await OllamaConnect.create(
      env.OLLAMA_MODEL,
      env.OLLAMA_BASE_URL,
    );

    const startedAt = new Date();
    const startTime = performance.now();

    const prompt = await ollama.generate<ClassificationResult>({
      prompt: `Classify the suggestion into exactly one of the following categories:
        - Curriculum: Suggestions related to learning and academic activities, including subjects, class schedules, teaching methods, learning materials, and academic activities.
        - Facilities: Suggestions about school facilities and infrastructure, such as classrooms, toilets, laboratories, libraries, equipment, and other physical facilities.
        - Student Affairs: Suggestions related to students outside the curriculum, including student organizations, student activities, discipline, extracurricular activities, and student development.
        Suggestion: ${result.data.suggesstions}

        Language:
          - lang_id = id: return exactly one of "Kurikulum", "Prasarana", or "Kesiswaan".
          - lang_id = en: return exactly one of "Curriculum", "Facilities", or "Student Affairs".

        lang_id: ${result.data.lang_id}
        Return exactly one category.`,
        result_format: resultFormat,
    });

    const completedAt = new Date();
    const durationMs = performance.now() - startTime;

    return successResponse(
      res,
      prompt.result,
      result.data,
      200,
      {
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs: Math.round(durationMs),
        duration: `${(durationMs / 1000).toFixed(2)} seconds`,
      },
    );
  } catch (error) {
    console.error("getClassifications error:", error);

    return errorResponse(res, "Internal server error", 500);
  }
}
