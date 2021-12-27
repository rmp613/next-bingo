import { Box, Center, Heading, Input, VStack } from "@chakra-ui/react";
import { isString } from "fp-ts/lib/string";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { BoardView } from "../src/components/BoardView";

const Board: NextPage = () => {
  const router = useRouter();
  const { boardId } = router.query;

  if (!isString(boardId)) {
    return null;
  }
  return (
    <Box>
      <Center>
        <VStack>
          <BoardView boardId={boardId} />
        </VStack>
      </Center>
    </Box>
  );
};

export default Board;
