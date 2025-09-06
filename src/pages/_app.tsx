import type { AppProps, AppContext } from "next/app";
import { trpc } from "@/shared/api";
import { SessionProvider, getSession } from "next-auth/react";

import "@/app/global.css";
import { Header } from "@/widgets/header";

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <div className="mx-auto max-w-4xl p-6">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

App.getInitialProps = async (ctx: AppContext) => {
  return {
    pageProps: {
      session: await getSession(ctx.ctx),
    },
  };
};

export default trpc.withTRPC(App);
