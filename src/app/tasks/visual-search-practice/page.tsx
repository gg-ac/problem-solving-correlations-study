"use client"

import { TaskContextProviderVisualSearch } from "@/components/visual-search/TaskContextVisualSearch";
import { TaskVisualSearch } from "@/components/visual-search/TaskVisualSearch";
import { generateVisualSearchTaskTrials } from "@/components/visual-search/TrialGenerator";

export default function Home() {

  return (
    <div className="overflow-hidden h-screen">
      <TaskContextProviderVisualSearch 
      trialSpecs={generateVisualSearchTaskTrials([3, 9, 15], 2, "visualsearchpractice").map((grid) => {
        return {
          gridContents: grid,
          targetIsPresent: grid.includes(2),
          maxTime: 2000,
          feedbackTime: 1000
        }
      })}
      startTrialIndex={0}>
        <TaskVisualSearch isPractice={true}></TaskVisualSearch>
      </TaskContextProviderVisualSearch>
    </div>
  );
}
