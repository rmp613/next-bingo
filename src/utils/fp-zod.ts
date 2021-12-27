import {  z, ZodError } from "zod";
import * as E from "fp-ts/lib/Either";
import { AnyObject, AnyObjectSchema } from "../models/AnyObject";

export const isZodError = <T>(err:unknown): err is ZodError<T> => (err as any).issues;
export const zodParse =
  <T extends AnyObject>(schema: z.ZodSchema<T>) =>
  (
    data: unknown
  ): E.Either<ZodError<T | AnyObject>, z.infer<typeof schema>> => {
    const isObjResult = AnyObjectSchema.safeParse(data);
    if (isObjResult.success) {
      const result = schema.safeParse(data);
      if (result.success) {
        return E.right(result.data);
      } else {
        return E.left(result.error);
      }
    } else {
      return E.left(isObjResult.error);
    }
  };
