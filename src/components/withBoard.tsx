import { pipe } from "fp-ts/lib/function";
import { AnyObject } from "../models/AnyObject";
import * as O from "fp-ts/lib/Option";
import { Text } from "@chakra-ui/react";
import { useBoard } from "../utils/use-board";
import { Board } from "../models/Board";
import { updateBoard } from "../commands/board.commands";
import React, { useCallback } from "react";
import { useFirestore } from "./DependencyProvider";
import { User } from "firebase/auth";
import { useAuthUser } from "../utils/use-auth";

export type SaveBoard = (
  board: Board
) => ReturnType<ReturnType<typeof updateBoard>>;

const DefaultLoadingComponent = () => {
  return <Text>Loading...</Text>;
};
export function withBoard<Props>() {
  return function withComponent(
    RightComponent: React.FC<Props & { cachedBoard: Board; authUser: User;saveBoard:SaveBoard }>,
    LoadingComponent: React.FC = DefaultLoadingComponent,
    NoneComponent: React.FC = LoadingComponent
  ) {
    const UidComponent: React.FC<{
      authUser: User;
      props: Props;
      boardId: string;
    }> = ({ authUser, props, boardId, children }) => {
      const oBoard = useBoard(boardId);
      const firestore = useFirestore();
      const saveBoard = useCallback(
        (board: Board) => pipe(board, updateBoard(firestore, authUser)),
        [authUser]
      );
      return pipe(
        oBoard,
        O.match(
          () => <NoneComponent />,
          (cachedBoard) => (
            <RightComponent
              {...props}
              boardId={boardId}
              cachedBoard={cachedBoard}
              authUser={authUser}
              saveBoard={saveBoard}
            >
              {children}
            </RightComponent>
          )
        )
      );
    };
    return function WrappedWithViewComponent(
      props: Props & { boardId: string }
    ) {
      const oAuthUser = useAuthUser();
      return pipe(
        oAuthUser,
        O.match(
          () => <LoadingComponent />,
          (authUser) => (
            <UidComponent
              props={props}
              authUser={authUser}
              boardId={props.boardId}
            />
          )
        )
      );
    };
  };
}
