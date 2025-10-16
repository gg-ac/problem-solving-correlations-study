import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { PageProvider } from "@/context/PageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cognitive Abilities Study",
  description: "Tasks for the cognitive abilities study",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  function generateTimestamp(): string {
    const now = new Date();

    const formattedTimestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    return formattedTimestamp;
}

  return (
    <ThemeProvider>
      <PageProvider participantID={`p_${generateTimestamp()}`} pages={
        ["introduction", 
        "demographic-survey", 
        "go-nogo", 
        "score", 
        "matrix-reasoning", 
        "score", 
        "memory-span", 
        "score", 
        "visual-search", 
        "score", 
        "string-transformation", 
        "score" ]} startPageIndex={0}>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-slate-900 dark:text-white`}
        >
          {children}
        </body>
      </html>
      </PageProvider>
    </ThemeProvider>
  );
}
