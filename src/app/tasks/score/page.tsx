"use client"

import { saveToDownloadsFolder } from "@/components/io/DataStorage";
import { uploadJSONData } from "@/components/utils/dataStorageWrappers";
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

enum DataUploadState {
    UPLOAD_IN_PROGRESS,
    UPLOAD_FAILED,
    UPLOAD_COMPLETE,
    UPLOAD_AWAITING_START
}


export default function Home() {
  const { scoreData, saveDataToCloud, completedSessionRedirectURL, currentPageIndex, setCurrentPageIndex, pages, taskData, participantID } = usePageContext();

  const [uploadState, setUploadState] = useState<DataUploadState>(DataUploadState.UPLOAD_AWAITING_START)

  var dataSaved = false
  useEffect(() => {
    if (currentPageIndex + 1 >= pages.length) {
      if (!dataSaved) {
        if (saveDataToCloud) {
          if(uploadState == DataUploadState.UPLOAD_AWAITING_START){
            setUploadState(DataUploadState.UPLOAD_IN_PROGRESS)
                const data = JSON.stringify(taskData)     
                uploadJSONData(data, "p_"+participantID, () => {setUploadState(DataUploadState.UPLOAD_COMPLETE)}, () => {setUploadState(DataUploadState.UPLOAD_FAILED)})
            }                  
        } else{
          saveToDownloadsFolder(JSON.stringify(taskData), `${participantID}_trial_data.json`)
        }        
        dataSaved = true
      }
    }
  }, []);

  useEffect(() => {
    if(uploadState == DataUploadState.UPLOAD_COMPLETE){
      if (completedSessionRedirectURL != null){
          const w = window.open(completedSessionRedirectURL, '_blank');
          if (w == null) {
              alert(`You have completed the session, but your browser prevented the confirmation URL from loading. To confirm that you have completed the session, please visit ${completedSessionRedirectURL}.`)
          }
        }
    }
  }, [uploadState])

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
      {currentPageIndex + 1 >= pages.length ? <h2 className=" mt-10 text-lg font-semibold">Congratulations on completing the study! {completedSessionRedirectURL != null ? <a className="underline" href={completedSessionRedirectURL}>Click here to confirm completion in Prolific</a> : <></>}</h2> :
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-10 py-2 px-4 rounded-full" onClick={() => { currentPageIndex + 1 < pages.length ? setCurrentPageIndex(currentPageIndex + 1) : null }}>Next Task</button>}
      {currentPageIndex + 1 >= pages.length ? <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-10 py-2 px-4 rounded-full" onClick={() => { saveToDownloadsFolder(JSON.stringify(taskData), `${participantID}_trial_data.json`) }}>Download Data</button> : <></>}
    </div>
  );
}
