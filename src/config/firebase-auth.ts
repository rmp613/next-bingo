import { signInAnonymously, User } from "firebase/auth";
import { atom } from "jotai";
import { useEffect } from "react";
import { auth } from "./firebase";
import { useUpdateAtom } from "jotai/utils";
import * as O from 'fp-ts/lib/Option';

export const authUserAtom = atom(O.none as O.Option<User>);
export const useConfigureAuth = () => {
  const setAuthUser = useUpdateAtom(authUserAtom);
  useEffect(() => {
    signInAnonymously(auth).then((user) => {
      setAuthUser(O.some(user.user));
    });
  }, []);
};
