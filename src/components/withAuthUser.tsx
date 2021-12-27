import { User } from "firebase/auth";
import { pipe } from "fp-ts/lib/function";
import { AnyObject } from "../models/AnyObject";
import { useAuthUser } from "../utils/use-auth";
import * as O from "fp-ts/lib/Option";
import { Text } from "@chakra-ui/react";
import React from "react";

const DefaultNoAuthComponent = <Props extends AnyObject>(_props: Props) => (
  <Text>Loading...</Text>
);
export const withAuthUser =
  <Props extends AnyObject>() =>
  (
    WrappedWithAuthComponent: React.FC<{
      props: Props;
      authUser: User;
    }>,
    NoAuthComponent: React.FC<Props> = DefaultNoAuthComponent
  ) => {
    return function AuthWrapper(props: Props) {
      const oAuthUser = useAuthUser();

      return pipe(
        oAuthUser,
        O.match(
          () => <NoAuthComponent {...props} />,
          (authUser) => (
            <WrappedWithAuthComponent props={props} authUser={authUser} />
          )
        )
      );
    };
  };
