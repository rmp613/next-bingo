type BaseStructure<
  Name extends string,
  Subcollections extends {} | Record<string, any> = {}
> = { [K in Name]: { name: Name } & Subcollections };
// expands object types one level deep
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// expands object types recursively
export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

export type FirestoreStructure = BaseStructure<
  "users",
  BaseStructure<"boards"> & BaseStructure<"playerBoards">
>;

type A = ExpandRecursively<FirestoreStructure>;
export const FIRESTORE_STRUCTURE: FirestoreStructure = {
  users: {
    name: "users",
    boards: {
      name: "boards",
    },
    playerBoards: {
      name: "playerBoards",
    },
  },
};
