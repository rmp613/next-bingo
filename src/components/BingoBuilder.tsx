import {
  Box,
  Button,
  Center,
  chakra,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  useForm,
  useFieldArray,
  useWatch,
  Control,
  UseFormRegister,
  UseFormSetFocus,
} from "react-hook-form";
import { string, z } from "zod";
import { useFormComponent } from "./Form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  useContext,
} from "react";
import { AddIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { Board, BoardSchema, getDefaultBoard } from "../models/Board";
import { updateBoard } from "../commands/board.commands";
import { pipe } from "fp-ts/lib/function";
import { DependencyProviderContext } from "./DependencyProvider";
import { useRandomId } from "../utils/generate-id";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import { isZodError } from "../utils/fp-zod";
import { withAuthUser } from "./withAuthUser";
import { omit } from "lodash";
import { atom } from "jotai";
import { withBoard } from "./withBoard";

// tODO: collection group query board id
const Schema = BoardSchema.omit({ id: true });
type FormValues = z.infer<typeof Schema>;

const BingoInput: React.FC<{
  name: `tiles.${number}.title`;
  control: Control<FormValues, object>;
  index: number;
  register: UseFormRegister<FormValues>;
  append: () => void;
  remove: (index: number) => void;
}> = ({ name, append, remove, control, index, register }) => {
  const inputValueName = `tiles.${index}.title` as const;

  const value = useWatch({
    name: inputValueName,
    control,
  });
  return (
    <Input
      maxLength={100}
      {...register(name)}
      placeholder="Bingo tile"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          append();
        } else if (e.key === "Backspace" && !value) {
          remove(index);
        }
      }}
    />
  );
};

const BoardBuilderForm: React.FC<{
  cachedBoard: Board;
  saveBoard: (board: Board) => ReturnType<ReturnType<typeof updateBoard>>;
}> = ({ saveBoard, cachedBoard }) => {
  const {
    control,
    register,
    setError,
    formState: { errors, isSubmitting },
    setFocus,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: omit(getDefaultBoard(""), "id"),
  });
  const getTitleFieldName = (index: number): `tiles.${number}.title` =>
    `tiles.${index}.title`;
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "tiles", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );

  const handleAppend = () => {
    append({ title: "", description: "" });
  };
  const handleRemove = (arrLength: number) => (index: number) => {
    if (arrLength < 2) {
      return;
    }
    remove(index);
    Promise.resolve().then(() => {
      setFocus(
        index > 0 ? getTitleFieldName(index - 1) : getTitleFieldName(index)
      );
    });
  };

  const appendOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    handleAppend();
  };

  const removeOnClick =
    (index: number): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      e.preventDefault();
      handleRemove(fields.length)(index);
    };

  const onSubmit = async (values: FormValues) => {
    const error = await pipe(
      { ...values, id: cachedBoard.id },
      saveBoard,
      TE.match(
        (l) => l,
        () => null
      )
    )();
    if (error) {
      if (isZodError<FormValues>(error)) {
        error.issues.forEach((issue) => {
          setError(issue.path as any, { message: issue.message });
        });
      } else {
        console.error("Unexpected error:", error);
        setError("name", { message: "An unexpected error occurred" });
      }
    }
  };
  return (
    <chakra.form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing="1rem">
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">Name your bingo game</FormLabel>
          <Input {...register("name")} placeholder="E.g. Family bingo game" />
          <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
        </FormControl>
        <Divider />
        <FormControl isInvalid={!!errors.tiles?.length}>
          <FormLabel htmlFor="tiles">Add your bingo tiles:</FormLabel>
          <VStack spacing="1rem">
            {fields.map((field, index) => {
              const name = `tiles.${index}.title` as const;
              const isLast = index === fields.length - 1;
              return (
                <>
                  <FormControl
                    isInvalid={!!errors.tiles?.[index]}
                    key={field.id} // important to include key with field's id
                  >
                    <HStack>
                      <BingoInput
                        register={register}
                        control={control}
                        index={index}
                        name={name}
                        append={handleAppend}
                        remove={handleRemove(fields.length)}
                      />
                      {isLast ? (
                        <IconButton
                          aria-label="Add Tile"
                          icon={<AddIcon />}
                          onClick={appendOnClick}
                        />
                      ) : (
                        <IconButton
                          aria-label="Remove Tile"
                          icon={<DeleteIcon />}
                          onClick={removeOnClick(index)}
                        />
                      )}
                    </HStack>
                    <FormErrorMessage>
                      {errors.tiles?.[index]?.title?.message}
                    </FormErrorMessage>
                  </FormControl>
                </>
              );
            })}
          </VStack>
        </FormControl>
        <Text>Total: {fields.length}</Text>
        <Button type="submit" isLoading={isSubmitting}>
          Continue
        </Button>
      </VStack>
    </chakra.form>
  );
};

export const BingoBuilder: React.FC<{ boardId: string }> = ({ boardId }) => 
   pipe(
    withBoard(boardId, BoardBuilderForm),
    withAuthUser<{ boardId: string }>()
  )({ boardId });
