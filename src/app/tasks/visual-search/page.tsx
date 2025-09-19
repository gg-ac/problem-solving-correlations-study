"use client"

import { TaskContextProviderVisualSearch } from "@/components/visual-search/TaskContextVisualSearch";
import TaskVisualSearch from "@/components/visual-search/TaskVisualSearch";

export default function Home() {

  return (
    <div className="overflow-hidden h-screen">
      <TaskContextProviderVisualSearch trialSpecs={[{
        gridContents: [0, 0, 2, 0, 0, 5, 0, 0, 0, 2, 0, 5, 5],
        targetIsPresent: true,
        maxTime: 2000,
        feedbackTime: 1000
      },
      {
        gridContents: [5, 0, 0, 5, 5, 5, 0, 0, 5, 0, 0, 5, 5, 5, 5, 0],
        targetIsPresent: false,
        maxTime: 2000,
        feedbackTime: 1000
      }]} startTrialIndex={0}>
        <TaskVisualSearch></TaskVisualSearch>
      </TaskContextProviderVisualSearch>
    </div>
  );
}
