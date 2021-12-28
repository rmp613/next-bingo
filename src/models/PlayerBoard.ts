import { z } from "zod";
import { TileSchema } from "./Board";
import { WithIdSchema } from "./WithId";

export const CellSchema = z.object({
  boardIndex: z.number(),
  value: TileSchema,
});
export const RowSchema = z.array(CellSchema);
export const GameBoardSchema = z.array(RowSchema);
export const PlayerBoardSchema = WithIdSchema.merge(
  z.object({
    gameBoard: GameBoardSchema,
    name: z.string(),
    boardCreatorId: z.string(),
    boardId: z.string(),
    // a hash generated from the board that this game board was created from
    // when this doesn't match the current board
    boardHash: z.string(),
    gameUserId: z.string(),
  })  
);
export type PlayerBoard = z.infer<typeof PlayerBoardSchema>;

