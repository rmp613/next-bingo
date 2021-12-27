import { z } from "zod";
import { WithIdSchema } from "./WithId";

export const TileSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
});
export const BoardSchema = WithIdSchema.merge(
  z.object({
    name: z.string().min(1),
    tiles: z.array(TileSchema),
  })
);

export type Board = z.infer<typeof BoardSchema>;

export const getDefaultBoard = (id: string): Board => ({
  id,
  tiles: [{ title: "Someone says bingo too early (example)", description: "" }],
  name: "Name",
});
