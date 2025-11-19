"use client"

import { usePageContext } from "@/context/PageContext";

export default function Home() {
  const { pages, currentPageIndex, setCurrentPageIndex } = usePageContext();
  
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen">
     <span className="py-10 text-2xl">Problem-Solving Cognitive Correlations Study</span>
     <p className="py-10 text-2xl">Study loading... If you are not redirected to the introduction page, please click the button below.</p>
     <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => {currentPageIndex + 1 < pages.length ? setCurrentPageIndex(currentPageIndex + 1) : null}}>Start Study</button>
    </div>
  );
}
