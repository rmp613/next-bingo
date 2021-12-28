import {
  collection,
  doc,
  Firestore,
  SetOptions,
} from "firebase/firestore";
import { PlayerBoardSchema, PlayerBoard } from "../models/PlayerBoard";
import { User } from "firebase/auth";
import { firestoreUpdate,firestoreSet } from "../utils/fp-firestore";

const USERS_COLLECTION = "users";
export const PLAYER_BOARDS_COLLECTION = "playerBoards";

const getPlayerBoardDoc = (
  firestore: Firestore,
  uid: string,
  boardId: string
) =>
  doc(
    collection(
      doc(collection(firestore, USERS_COLLECTION), uid),
      PLAYER_BOARDS_COLLECTION
    ),
    boardId
  );

export const updatePlayerBoard =
  (firestore: Firestore, user: User) =>
  (
    partialPlayerBoard: Partial<Omit<PlayerBoard, "id">> &
      Pick<PlayerBoard, "id">
  ) => {
    return firestoreUpdate(PlayerBoardSchema)(
      getPlayerBoardDoc(firestore, user.uid, partialPlayerBoard.id),
      partialPlayerBoard
    );
  };

export const setPlayerBoard =
  (firestore: Firestore, user: User) =>
  (partialPlayerBoard: PlayerBoard, setOptions: SetOptions = {}) => {
    return firestoreSet(PlayerBoardSchema)(
      getPlayerBoardDoc(firestore, user.uid, partialPlayerBoard.id),
      partialPlayerBoard,
      setOptions
    );
  };
