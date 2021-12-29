import { collectionGroup, Firestore, query, where } from "firebase/firestore";
import { FIRESTORE_STRUCTURE } from "../config/firestore";
// todo: move to own file
import { BoardSchema } from "../models/Board";
import { firestoreListenToQuery } from "../utils/fp-firestore";

export const listenToBoard = (firestore: Firestore) => (id: string) =>
  firestoreListenToQuery(
    query(
      collectionGroup(firestore, FIRESTORE_STRUCTURE.users.boards.name),
      where("id", "==", id)
    ),
    BoardSchema
  );
