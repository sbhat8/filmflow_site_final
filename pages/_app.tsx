import "@mantine/core/styles.css";
import Head from "next/head";
import {MantineProvider} from "@mantine/core";
import {theme} from "../theme";
import {Layout} from "../components/Layout";
import {AppProps} from "next/app";
import {SessionProvider} from "next-auth/react";

export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
  return (
    <SessionProvider session={session}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Head>
          <title>FilmFlow</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
          <link rel="shortcut icon" href="/favicon.svg"/>
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </SessionProvider>
  );
}
