import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { useConfigureAuth } from "../src/config/firebase-auth";
import { DependencyProviderContext } from "../src/components/DependencyProvider";
import { auth, firestore } from "../src/config/firebase";

function MyApp({ Component, pageProps }: AppProps) {
  useConfigureAuth();
  return (
    <DependencyProviderContext.Provider value={{ firestore, auth }}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </DependencyProviderContext.Provider>
  );
}

export default MyApp;
