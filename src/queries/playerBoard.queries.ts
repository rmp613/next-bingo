import {
  collection,
  doc,
  Firestore,
} from "firebase/firestore";
// todo: move to own file
import { BoardSchema } from "../models/Board";
import {
  firestoreListenToDoc,
} from "../utils/fp-firestore";
import { FIRESTORE_STRUCTURE } from "../config/firestore";

export const listenToPlayerBoard =
  (firestore: Firestore) => (uid: string) => (playerBoardId: string) =>
    firestoreListenToDoc(
      doc(
        collection(
          doc(collection(firestore, FIRESTORE_STRUCTURE.users.name), uid),
          FIRESTORE_STRUCTURE.users.playerBoards.name
        ),
        playerBoardId
      ),
      BoardSchema
    );
