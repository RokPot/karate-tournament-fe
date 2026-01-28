import { clsx } from "clsx";
import { Head, Html, Main, NextScript } from "next/document";

import { defaultLanguage } from "@/hooks/useLanguageSwitcher";
import { globalFontClass } from "@/styles/font";

export default function Document() {
  return (
    <Html lang={defaultLanguage}>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body className={clsx("dark bg-secondary-300 text-white", globalFontClass)}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
