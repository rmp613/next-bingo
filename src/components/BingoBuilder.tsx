import {
  Box,
  Button,
  Center,
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
import React, { KeyboardEventHandler, MouseEventHandler } from "react";
import { CloseIcon, DeleteIcon } from "@chakra-ui/icons";

const TileSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
});
const Schema = z.object({
  name: z.string().min(1),
  tiles: z.array(TileSchema),
});

type FormValues = z.infer<typeof Schema>;

const BingoInput: React.FC<{
  name: `tiles.${number}.title`;
  control: Control<FormValues, object>;
  index: number;
  register: UseFormRegister<FormValues>;
  append: () => void;
  remove: (index: number) => void;
  setFocus: UseFormSetFocus<FormValues>;
}> = ({ name, append, remove, control, index, register, setFocus }) => {
  const inputValueName = `tiles.${index}.title` as const
  const prevInputValueName = index > 0 ? `tiles.${index - 1}.title` as const : null;

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
          if (prevInputValueName) setFocus(prevInputValueName);
          //   removeEventListener()
        }
      }}
    />
  );
};

export const BingoBuilder: React.FC = () => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
    setFocus,
  } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: { tiles: [{ title: "", description: "" }], name: "" },
  });
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

  const appendOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    handleAppend();
  };
  return (
    <Center>
      <VStack spacing="1rem" w="500px">
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
              console.log(field);
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
                        name={`tiles.${index}.title` as const}
                        append={handleAppend}
                        remove={remove}
                        setFocus={setFocus}
                      />
                      <IconButton
                        aria-label="Remove Tile"
                        icon={<DeleteIcon />}
                        onClick={() => remove(index)}
                      />
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
        <Flex
          dir="row"
          align="center"
          justifyContent={"stretch"}
          borderWidth={1}
        >
          <Box>
            <Text>Total: {fields.length}</Text>
          </Box>
          <Spacer />
          <Button onClick={appendOnClick}>+</Button>
        </Flex>
      </VStack>
    </Center>
  );
};
