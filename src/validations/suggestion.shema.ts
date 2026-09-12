import { z } from "zod";

export const schema = z.object({
  lang_id: z.enum(["id", "en"]),
  suggesstions: z
    .string()
    .min(10, "Suggestions minimal 10 karakter")
    .max(350, "Suggestions maksimal 350 karakter"),
});
