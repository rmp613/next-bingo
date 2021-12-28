import {
  CollectionReference,
  doc,
  DocumentReference,
  FirestoreError,
  setDoc,
  SetOptions,
  updateDoc,
} from "firebase/firestore";
import { pipe } from "fp-ts/lib/function";
import { zodParse } from "./fp-zod";
import * as TE from "fp-ts/lib/TaskEither";
import { z } from "zod";

const isFirestoreError = (err: unknown): err is FirestoreError =>
  (err as any)?.code && (err as any)?.name && (err as any)?.stack;

const handleError = (err: unknown): FirestoreError =>
  isFirestoreError(err)
    ? err
    : ({
        code: "unknown",
        name: "Unknown",
        message: "Unknown error",
        stack: "",
      } as FirestoreError);

export const firestoreSet =
  <T extends { id: string }>(Schema: z.ZodSchema<T>) =>
  (ref: DocumentReference, value: T, setOptions: SetOptions = {}) => {
    return pipe(
      value,
      zodParse(Schema),
      TE.fromEither,
      TE.chainW(
        TE.tryCatchK((values) => {
          return setDoc(ref, values, setOptions);
        }, handleError)
      )
    );
  };

export const firestoreUpdate =
  <T extends { id: string }>(Schema: z.ZodSchema<T>) =>
  (ref: DocumentReference, value: Partial<T>) => {
    return pipe(
      value,
      zodParse(Schema),
      TE.fromEither,
      TE.chainW(
        TE.tryCatchK((values) => {
          return updateDoc(ref, values);
        }, handleError)
      )
    );
  };
