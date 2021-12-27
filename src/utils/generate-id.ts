import { collection, doc, Firestore } from "firebase/firestore";
import { string } from "fp-ts";
import { useContext, useRef } from "react";
import { DependencyProviderContext } from "../components/DependencyProvider";

export const generateId = (firestore: Firestore) =>
  doc(collection(firestore, "anything")).id;

export const useRandomId = (defaultId?: string) => {
  const { firestore } = useContext(DependencyProviderContext);
  const idRef = useRef(defaultId ?? generateId(firestore));

  return idRef.current;
};
