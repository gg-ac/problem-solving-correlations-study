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

  const [startTimestamp, setStartTimestamp] = useState("")
  const [localPID, setLocalPID] = useState("")
  const [localSaveDataToCloud, setLocalSaveDataToCloud] = useState(false)
  const [localRedirectCode, setLocalRedirectCode] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const now = new Date();
    const formattedTimestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    setStartTimestamp(formattedTimestamp)
    setLocalPID(`p_${startTimestamp}`)

    // Get the recruitment platform participant ID from the URL parameter, if available
    const rid = searchParams.get('rid')
    if (rid != null) {
      if (rid) {
        setLocalPID(rid)
        // Set the data to save to the cloud rather than downloads folder if using a recruitment platform URL
        setLocalSaveDataToCloud(true)
        // Set the recruitment platform's completion redirect code
        const redirectCode = searchParams.get('rc')
        if (redirectCode != null) {
          if (redirectCode) {
            setLocalRedirectCode(redirectCode)
          }
        }
      }
    }
  }, []);

  // Set the user's auth ID to let the browser upload data to firebase
  useEffect(() => {
    authenticateAnonymously(() => { console.log("Firebase authorisation succeeded") }, () => { console.log("Firebase authorisation failed") })
  }, []);

  return (
    <ThemeProvider>
      <Suspense>
        <PageProvider participantID={localPID} saveDataToCloud={localSaveDataToCloud} completedSessionRedirectURL={localRedirectCode !== "" ? `https://app.prolific.com/submissions/complete?cc=${localRedirectCode}` : null} pages={
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
