import { Board } from "../models/Board";
import { withBoard } from "./withBoard";
import * as O from "fp-ts/lib/Option";
import {
  Box,
  BoxProps,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { pipe } from "fp-ts/lib/function";
import { withAuthUser } from "./withAuthUser";
import { useEffect, useMemo, useRef, useState } from "react";
import { clone, cloneDeep, isEqual } from "lodash";
import { useRouter } from "next/router";

type Tile = { index: number; value: Board["tiles"][number] };
type RowTuple<T = Tile> = [T, T, T, T, T];
type ColumnTuple<T = RowTuple> = [T, T, T, T, T];

function getRow<T>(t: T): RowTuple<T> {
  return [t, t, t, t, t];
}
function getColumns<T>(t: RowTuple<T>): ColumnTuple<RowTuple<T>> {
  return [clone(t), clone(t), clone(t), clone(t), clone(t)];
}
function shuffleArray<T>(_array: T[]) {
  const array = [..._array];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
const generateBoardMatrix = ({
  tiles,
}: Board): O.Option<ColumnTuple<RowTuple<Tile>>> => {
  if (tiles.length < 25) {
    return O.none as O.Option<ColumnTuple<RowTuple<Tile>>>;
  }
  const matrix = getColumns<Tile | null>(getRow<Tile | null>(null));
  const shuffledTiles = shuffleArray(
    tiles.map((value, index) => ({ value, index }))
  );
  let index = 0;

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const next = shuffledTiles[index];
      if (!next) {
        throw new Error("Missing next tile");
      }
      console.log({ i, j, next, index, nIndex: next.index });
      matrix[i][j] = next;
      index++;
    }
  }
  return O.some(matrix as ColumnTuple<RowTuple<Tile>>);
};
const CustomButton = (props: BoxProps) => (
  <Box
    as="button"
    height="24px"
    lineHeight="1.2"
    transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
    border="1px"
    px="8px"
    borderRadius="8px"
    fontSize="14px"
    fontWeight="semibold"
    bg="#f5f6f7"
    borderColor="#ccd0d5"
    color="#4b4f56"
    _hover={{ bg: "#ebedf0" }}
    _active={{
      bg: "#dddfe2",
      transform: "scale(0.98)",
      borderColor: "#bec3c9",
    }}
    _focus={{
      boxShadow:
        "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)",
    }}
    {...props}
  />
);
const size = { base: "100%", sm: 100, md: 150 } as const;
const BoardViewWithBoard: React.FC<{ cachedBoard: Board }> = ({
  cachedBoard,
}) => {
  const router = useRouter();
  const prevRef = useRef(cachedBoard);
  const equal = isEqual(prevRef.current, cachedBoard);
  const [oMatrix, setOMatrix] = useState(generateBoardMatrix(cachedBoard));
  useEffect(() => {
    setOMatrix(generateBoardMatrix(cachedBoard));
  }, [equal]);

  return pipe(
    oMatrix,
    O.match(
      () => <Text>Not enough tiles, go back and add more</Text>,
      (matrix) => {
        return (
          <Flex flexDir={"column"}>
            <Button
              w={100}
              onClick={(e) => {
                e.preventDefault();
                router.push(`/${cachedBoard.id}/edit`);
              }}
            >
              Edit
            </Button>
            <Grid
              templateColumns="repeat(5, 1fr)"
              gap={1}
              p={{ base: 1, sm: 4, md: 20 }}
            >
              {matrix.map((row, index) => {
                return row.map((item) => (
                  <GridItem
                    colSpan={1}
                    key={`${index}.${item.index}`}
                    w={size}
                    h={{ base: size.sm, md: size.md }}
                    display={"table-cell"}
                  >
                    <CustomButton
                      onClick={() => console.log("hi")}
                      h={size}
                      w={size}
                      // textAlign={"left"}
                      textOverflow={"ellipsis"}
                      fontSize={{ base: 14, sm: 16, md: 18 }}
                    >
                      {item.value.title}
                    </CustomButton>
                  </GridItem>
                ));
              })}
            </Grid>
          </Flex>
        );
      }
    )
  );
};
export const BoardView = withBoard<{ boardId: string }>()(BoardViewWithBoard);
