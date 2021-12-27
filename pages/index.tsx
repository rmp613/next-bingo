import { Box, Button, Center, Heading, Input, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { NewBoardButton } from "../src/components/NewBoardButton";

const Home: NextPage = () => {
  return (
    <Center>
      <Box w={{ base: "90%", md: "500px", sm: "400px" }}>
        <Box h="50px" />
        <VStack>
          <Heading as="h1">
            Build you own bingo game and share it with your friends!
          </Heading>
          <Heading as="h5" size="sm">
            When you share it with your friends they will see a randomized
            board.
          </Heading>
        </VStack>
        <NewBoardButton />
      </Box>
    </Center>
  );
};

export default Home;
