import { useAtomValue } from "jotai/utils";
import { authUserAtom } from "../config/firebase-auth";

export const useAuthUser = () => {
  return useAtomValue(authUserAtom);
};
