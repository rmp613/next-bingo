import {
  collectionGroup,
  doc,
  Firestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { first } from "lodash";
// todo: move to own file
import { BOARDS_COLLECTION } from "../commands/board.commands";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { zodParse } from "../utils/fp-zod";
import { Board, BoardSchema } from "../models/Board";

export const listenToBoard =
  (firestore: Firestore) =>
  (id: string) =>
  (onNext: (board: O.Option<Board>) => void) =>
    onSnapshot(
      query(
        collectionGroup(firestore, BOARDS_COLLECTION),
        where('id', "==", id)
      ),
      (snap) => {
        return pipe(
          first(snap.docs),
          O.fromNullable,
          O.map((doc) => ({ ...(doc.data() ?? {}), id })),
          O.map(zodParse(BoardSchema)),
          O.chain(
            E.match((l) => {
              console.error(l);
              return O.none as O.Option<Board>;
            }, O.some)
          ),
          onNext
        );
      }
    );
