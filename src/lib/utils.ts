import { z } from "zod";
import type { Response } from "express";

export const resultFormat = {
  type: "object",
  properties: {
    lang_id: {
      type: "string",
      enum: ["id", "en"],
    },
    classification: {
      type: "string",
      enum: ["Kurikulum", "Prasarana", "Kesiswaan", "Curriculum", "Facilities", "Student Affairs"],
    },
  },
  required: ["lang_id", "classification"],
};

export interface ResponseMeta {
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  duration?: string;
}

export function successResponse(
  res: Response,
  data: unknown,
  payload: unknown,
  statusCode = 200,
  meta?: ResponseMeta,
) {
  return res.status(statusCode).json({
    data,
    payload,
    ...(meta && { meta }),
  });
}

export function validationErrorResponse(res: Response, error: z.ZodError) {
  const errors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string") {
      errors[field] ??= [];
      errors[field].push(issue.message);
    }
  }

  return res.status(400).json({
    success: false,
    message: "Invalid request body",
    errors,
  });
}

export function errorResponse(
  res: Response,
  message = "Internal server error",
  statusCode = 500,
) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}
