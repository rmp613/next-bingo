import {
  collection,
  doc,
  Firestore,
  FirestoreError,
  setDoc,
  SetOptions,
  updateDoc,
} from "firebase/firestore";
import { pipe } from "fp-ts/lib/function";
import { Board, BoardSchema } from "../models/Board";
import { WithIdSchema } from "../models/WithId";
import { zodParse } from "../utils/fp-zod";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { Auth, User } from "firebase/auth";
import { FIRESTORE_STRUCTURE } from "../config/firestore";

const isFirestoreError = (err: unknown): err is FirestoreError =>
  (err as any)?.code && (err as any)?.name && (err as any)?.stack;
const getBoardDoc = (firestore: Firestore, uid: string, boardId: string) =>
  doc(
    collection(
      doc(collection(firestore, FIRESTORE_STRUCTURE.users.name), uid),
      FIRESTORE_STRUCTURE.users.boards.name
    ),
    boardId
  );

const handleError = (err: unknown): FirestoreError =>
  isFirestoreError(err)
    ? err
    : ({
        code: "unknown",
        name: "Unknown",
        message: "Unknown error",
        stack: "",
      } as FirestoreError);

export const updateBoard =
  (firestore: Firestore, user: User) =>
  (partialBoard: Partial<Omit<Board, "id">> & Pick<Board, "id">) => {
    return pipe(
      partialBoard,
      zodParse(BoardSchema.omit({ id: true }).partial().merge(WithIdSchema)),
      TE.fromEither,
      TE.chainW(
        TE.tryCatchK((values) => {
          return updateDoc(
            getBoardDoc(firestore, user.uid, partialBoard.id),
            values
          );
        }, handleError)
      )
    );
  };

export const setBoard =
  (firestore: Firestore, user: User) =>
  (partialBoard: Board, setOptions: SetOptions = {}) => {
    return pipe(
      partialBoard,
      zodParse(BoardSchema),
      TE.fromEither,
      TE.chainW(
        TE.tryCatchK((values) => {
          return setDoc(
            getBoardDoc(firestore, user.uid, partialBoard.id),
            values,
            setOptions
          );
        }, handleError)
      )
    );
  };
