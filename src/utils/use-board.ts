import { atom, useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import * as O from "fp-ts/lib/Option";
import { Board } from "../models/Board";
import { useEffect } from "react";
import { listenToBoard } from "../queries/board.queries";
import { useFirestore } from "../components/DependencyProvider";
import { useRouter } from "next/router";
import { isString } from "lodash";

const oBoardAtom = atom(O.none as O.Option<Board>);

export const useBoardId = () => {
  const router = useRouter();
  return isString(router.query?.boardId)
    ? O.some(router.query.boardId as string)
    : O.none;
};
export const useBoard = (id: string) => {
  const firestore = useFirestore();
  const [board, setBoard] = useAtom(oBoardAtom);
  useEffect(() => listenToBoard(firestore)(id)(setBoard), [id]);
  return board;
};
