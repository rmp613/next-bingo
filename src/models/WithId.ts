import { z } from "zod";

export const WithIdSchema = z.object({
  id: z.string().min(1),
});
