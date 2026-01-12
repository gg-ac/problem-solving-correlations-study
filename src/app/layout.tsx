"use client"
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { PageProvider } from "@/context/PageContext";
import { Suspense, useEffect, useState } from "react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { authenticateAnonymously } from "@/components/utils/authWrappers";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Set the user's auth ID to let the browser upload data to firebase
  useEffect(() => {
    authenticateAnonymously(() => { console.log("Firebase authorisation succeeded") }, () => { console.log("Firebase authorisation failed") })
  }, []);

  return (
    <ThemeProvider>
      <Suspense>
        <PageProvider pages={
          ["introduction",
            "demographic-survey",
            "go-nogo-practice",
            "go-nogo",
            "score",
            "matrix-reasoning-practice",
            "matrix-reasoning",
            "score",
            "memory-span-practice",
            "memory-span",
            "score",
            "visual-search-practice",
            "visual-search",
            "score",
            "string-transformation",
            "score"]} startPageIndex={0}>
          <html lang="en" className="dark">
            <Head>
              <title>Cognitive Abilities Study</title>
              <meta name="description" content="Tasks for the cognitive abilities study" />
            </Head>
            <body
              className={`antialiased dark:bg-slate-900 dark:text-white`}
            >
              {children}
            </body>
          </html>
        </PageProvider>
      </Suspense>
    </ThemeProvider>
  );
}
