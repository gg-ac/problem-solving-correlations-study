"use client"

import { TaskContextProviderGoNogo } from "@/components/go-nogo/TaskContextGoNogo";
import { TaskGoNogo } from "@/components/go-nogo/TaskGoNogo";
import { generateGoNogoTaskTrialsDistributed } from "@/components/go-nogo/TrialGenerator";

export default function Home() {

  return (
    <div className="overflow-hidden h-screen">
      <TaskContextProviderGoNogo trialSpecs={
        generateGoNogoTaskTrialsDistributed(20, 0.70, "gonogopractice").map((isGoTrial) => {
          return {
            isGoTrial: isGoTrial,
            maxTime: 1000,
            feedbackTime: 2000
          }
        })} startTrialIndex={0}>
        <TaskGoNogo isPractice={true}></TaskGoNogo>
      </TaskContextProviderGoNogo>
    </div>
  );
}
