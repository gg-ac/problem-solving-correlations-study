"use client"

import { saveToDownloadsFolder } from "@/components/io/DataStorage";
import { usePageContext } from "@/context/PageContext";
import { useEffect, useState } from "react";
type scoreTypeData = {
  goNogo: number | null;
  visualSearch: number | null;
  matrixReasoning: number | null;
  memorySpan: number | null;
  stringTransformation: number | null;
};

const scores: { [key in keyof scoreTypeData]: string } = {
  goNogo: "Go/No-Go",
  visualSearch: "Visual Search",
  matrixReasoning: "Matrix Reasoning",
  memorySpan: "Memory Span",
  stringTransformation: "String Transformation",
};

const scoreLabels: { [key in keyof scoreTypeData]: string } = {
  goNogo: "Attention + Inhibitory Control",
  visualSearch: "Visual perception",
  matrixReasoning: "Executive function",
  memorySpan: "Working memory",
  stringTransformation: "Executive function",
};

export default function Home() {
  const { scoreData, currentPageIndex, setCurrentPageIndex, pages, taskData, participantID } = usePageContext();
  
  var dataSaved = false
  useEffect(() => {
    if (currentPageIndex + 1 >= pages.length) {
      if (!dataSaved) {
        saveToDownloadsFolder(JSON.stringify(taskData), `${participantID}_trial_data.json`)
        dataSaved = true
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Percentile Scores...</h1>
      <h2 className="text-lg mb-4">(You scored better than N% of participants on similar tasks)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {Object.entries(scoreData).map(([key, score]) => {
          const displayScore = score !== null ? `${(score).toFixed(0)}%` : "-"; // Placeholder for null scores
          return (
            <div
              key={key}
              className="flex flex-col items-center justify-center aspect-square border border-gray-300 rounded-lg p-4 shadow-lg bg-slate-800"
            >
              <h2 className="text-lg font-semibold">{scores[key as keyof scoreTypeData]}</h2>
              <p className="text-3xl font-bold text-center mt-2">{displayScore}</p>
              <p className="text-sm font-semibold">{scoreLabels[key as keyof scoreTypeData]}</p>
            </div>
          );
        })}
      </div>
      {currentPageIndex + 1 >= pages.length ? <h2 className=" mt-10 text-lg font-semibold">Congratulations on completing the study!</h2> :
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-10 py-2 px-4 rounded-full" onClick={() => { currentPageIndex + 1 < pages.length ? setCurrentPageIndex(currentPageIndex + 1) : null }}>Next Task</button>}
    </div>
  );
}
