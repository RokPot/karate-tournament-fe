import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { useReportWebVitals } from "next/web-vitals";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ErrorBoundaryTrigger } from "@/components/shared/error/ErrorBoundaryTrigger";
import { DefaultAppHead } from "@/components/shared/head/DefaultAppHead";
import { PageWrapper } from "@/components/shared/layout/PageWrapper";
import { ToastContainer } from "@/components/ui/status/Toast/Toast";
import { AppConfig } from "@/config/app.config";
import { initA11y } from "@/config/inits/a11y";
import { initSentry } from "@/config/inits/sentry";
import { QueryConfig } from "@/config/query.config";
import { AuthAuth0Provider } from "@/data/auth/auth-auth0/auth-auth0.provider";
import Providers from "@/providers";
import { AppErrorBoundary } from "@/providers/AppErrorBoundary";
import { ThemeProvider } from "@/providers/ThemeModeContext";
import { Fonts } from "@/styles/font";
import "@/styles/globals.css";
import { logger } from "@/util/logger";

initSentry();
initA11y();

export function App({ Component, pageProps }: AppProps) {
  const { i18n } = useTranslation();
  const [queryClient] = useState(() => new QueryClient(QueryConfig));

  useEffect(() => {
    i18n.on("languageChanged", (lng) => {
      if (typeof document !== undefined) {
        document.documentElement.setAttribute("lang", lng);
      }
    });
  }, [i18n]);

  useReportWebVitals((metric) => {
    logger.info("Web Vitals", metric);
  });

  return (
    <AppErrorBoundary>
      <Providers
        providers={[
          { provider: QueryClientProvider, props: { client: queryClient } },
          { provider: ThemeProvider },
          { provider: AuthAuth0Provider },
        ]}
      >
        <ErrorBoundaryTrigger />
        <Fonts />
        <DefaultAppHead />
        <PageWrapper>
          <Component {...pageProps} />

          <ToastContainer />
        </PageWrapper>
        {!AppConfig.isProduction && <ReactQueryDevtools initialIsOpen={false} />}
      </Providers>
    </AppErrorBoundary>
  );
}

export default App;
