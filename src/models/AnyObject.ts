import { z } from "zod";

export const AnyObjectSchema = z.record(z.unknown());
export type AnyObject = z.infer<typeof AnyObjectSchema>;
