/* eslint-disable react-hooks/exhaustive-deps */
import { chakra } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type AnyObject = Record<string, any>;
type Props<FormValues extends AnyObject> = {
  defaultValues: FormValues;
  onSubmit: (values: FormValues) => any;
  schema: z.ZodSchema<FormValues>;
};

const isElement = (
  child: unknown
): child is React.ReactElement<
  any,
  string | React.JSXElementConstructor<any>
> => (child as any)?.props?.name && (child as any)?.type;

export const useFormComponent = <FormValues extends AnyObject>({
  defaultValues: _defaultValues,
  schema,
  onSubmit,
}: Props<FormValues>) => {
  const defaultValues = useMemo(() => _defaultValues, []);
  const methods = useForm<FormValues>({ defaultValues: defaultValues as any });
  const { handleSubmit } = methods;

  const Form: React.FC = ({ children }) => (
    <chakra.form onSubmit={handleSubmit(onSubmit as any)}>
      {React.Children.map(children, (child) => {
        return isElement(child)
          ? React.createElement(child.type, {
              ...{
                ...child.props,
                register: methods.register,
                key: child.props.name,
              },
            })
          : child;
      })}
    </chakra.form>
  );

  return Form;
};
