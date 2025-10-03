"use client"

import { TaskContextProviderGoNogo } from "@/components/go-nogo/TaskContextGoNogo";
import TaskGoNogo from "@/components/go-nogo/TaskGoNogo";
import { generateGoNogoTaskTrialsDistributed } from "@/components/go-nogo/TrialGenerator";

export default function Home() {

  return (
    <div className="overflow-hidden h-screen">
      <TaskContextProviderGoNogo trialSpecs={
        generateGoNogoTaskTrialsDistributed(200, 0.30, "gonogo").map((isGoTrial) => {
          return {
            isGoTrial: isGoTrial,
            maxTime: 1000,
            feedbackTime: 500
          }
        })} startTrialIndex={0}>
        <TaskGoNogo></TaskGoNogo>
      </TaskContextProviderGoNogo>
    </div>
  );
}
