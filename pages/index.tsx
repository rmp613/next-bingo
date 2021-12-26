import { Box, Center, Heading, Input, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { BingoBuilder } from "../src/components/BingoBuilder";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <Box>
      <Center>
        <Box h="10em" />
        <VStack>
          <Heading as="h1">
            Build you own bingo game and share it with your friends!
          </Heading>
          <Heading as="h5" size="sm">
            When you share it with your friends they will see a randomized
            board.
          </Heading>
        </VStack>
      </Center>

      <BingoBuilder />
    </Box>
  );
};

export default Home;
