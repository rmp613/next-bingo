import {
  CollectionReference,
  doc,
  DocumentReference,
  FirestoreError,
  onSnapshot,
  Query,
  setDoc,
  SetOptions,
  updateDoc,
} from "firebase/firestore";
import { pipe } from "fp-ts/lib/function";
import { zodParse } from "./fp-zod";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { z } from "zod";
import { first } from "lodash";

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

export const firestoreListenToQuery =
  <T extends { id: string }>(query: Query, Schema: z.ZodSchema<T>) =>
  (onNext: (board: O.Option<T>) => void) =>
    onSnapshot(query, (snap) => {
      return pipe(
        first(snap.docs),
        O.fromNullable,
        O.map((doc) => ({ ...(doc.data() ?? {}), id: doc.ref.id })),
        O.map(zodParse(Schema)),
        O.chain(
          E.match((l) => {
            console.error(l);
            return O.none as O.Option<T>;
          }, O.some)
        ),
        onNext
      );
    });

export const firestoreListenToDoc =
  <T extends { id: string }>(ref: DocumentReference, Schema: z.ZodSchema<T>) =>
  (onNext: (board: O.Option<T>) => void) =>
    onSnapshot(ref, (snap) => {
      return pipe(
        snap.exists() ? null : snap,
        O.fromNullable,
        O.map((doc) => ({ ...(doc.data() ?? {}), id: doc.ref.id })),
        O.map(zodParse(Schema)),
        O.chain(
          E.match((l) => {
            console.error(l);
            return O.none as O.Option<T>;
          }, O.some)
        ),
        onNext
      );
    });
