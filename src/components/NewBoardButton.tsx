import { Button, useCallbackRef, useToast } from "@chakra-ui/react";
import { useCallback, useContext } from "react";
import { setBoard } from "../commands/board.commands";
import { getDefaultBoard } from "../models/Board";
import { useRandomId } from "../utils/generate-id";
import { DependencyProviderContext } from "./DependencyProvider";
import { withAuthUser } from "./withAuthUser";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { useRouter } from "next/router";

export const NewBoardButton = withAuthUser()(function NewBoardButtonWithAuth({
  authUser,
}) {
  const id = useRandomId();
  const router = useRouter();
  const toast = useToast();
  const { firestore } = useContext(DependencyProviderContext);
  const createBoard = useCallback(async () => {
    const error = await pipe(
      setBoard(firestore, authUser)(getDefaultBoard(id)),
      TE.match(
        (l) => l,
        () => null
      )
    )();
    if (error) {
      toast({ title: "Error", status: "error", description: error.message });
    } else {
      router.push(`/${id}`);
    }
  }, []);
  return <Button onClick={createBoard}>New Bingo Game</Button>;
});
