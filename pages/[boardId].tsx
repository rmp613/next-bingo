import { Box, Center, Heading, Input, VStack } from "@chakra-ui/react";
import { isString } from "fp-ts/lib/string";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { BingoBuilder } from "../src/components/BingoBuilder";

const Board: NextPage = () => {
  const router = useRouter();
  const { boardId } = router.query;

  if(!isString(boardId)){
    return null;
  }
  return (
    <Box>
      <Center>
        <Heading>{boardId}</Heading>
      </Center>
    </Box>
  );
};

export default Board;
