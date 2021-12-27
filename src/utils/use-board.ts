import { atom, useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import * as O from "fp-ts/lib/Option";
import { Board } from "../models/Board";
import { useEffect } from "react";
import { listenToBoard } from "../queries/board.queries";
import { useFirestore } from "../components/DependencyProvider";

const oBoardAtom = atom(O.none as O.Option<Board>);

export const useBoard = (id: string) => {
  const firestore = useFirestore();
  const [board, setBoard] = useAtom(oBoardAtom);
  useEffect(() => listenToBoard(firestore)(id)(setBoard));
  return board;
};
