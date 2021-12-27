import {
  Box,
  Center,
  FormHelperText,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { isString } from "lodash";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { BingoBuilder } from "../../src/components/BingoBuilder";

const EditBoard: NextPage = () => {
  const router = useRouter();
  const { boardId } = router.query;

  return (
    <Box>
      <Center>
        <VStack>
          <Heading>Edit {boardId}</Heading>
          {isString(boardId) ? (
            <BingoBuilder boardId={boardId} />
          ) : (
            <Text>Invalid board id</Text>
          )}
        </VStack>
      </Center>
    </Box>
  );
};

export default EditBoard;
