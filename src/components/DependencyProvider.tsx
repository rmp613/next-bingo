import React, { useContext } from "react";
import { auth, firestore } from "../config/firebase";

export const DependencyProviderContext = React.createContext({
  firestore,
  auth,
});

export const useFirestore = () => {
  const firestore = useContext(DependencyProviderContext).firestore;
  return firestore;
}