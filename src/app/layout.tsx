"use client"
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { PageProvider } from "@/context/PageContext";
import { useEffect, useState } from "react";
import Head from "next/head";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [startTimestamp, setStartTimestamp] = useState("")

  useEffect(() => {
    const now = new Date();
    const formattedTimestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    setStartTimestamp(formattedTimestamp)
  }, []);

  return (
    <ThemeProvider>
      <PageProvider participantID={`p_${startTimestamp}`} pages={
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
    </ThemeProvider>
  );
}
