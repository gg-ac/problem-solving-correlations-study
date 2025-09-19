"use client"

import SignalGo from "@/components/go-nogo/SignalGo";
import { TaskContextProviderGoNogo, useTaskContextGoNogo } from "@/components/go-nogo/TaskContextGoNogo";
import TaskGoNogo from "@/components/go-nogo/TaskGoNogo";

export default function Home() {

  return (
    <div className="overflow-hidden h-screen">
      <TaskContextProviderGoNogo trialSpecs={[{
        isGoTrial: false,
        maxTime: 2000,
        feedbackTime: 1000
      },
      {
        isGoTrial: false,
        maxTime: 2000,
        feedbackTime: 1000
      }]} startTrialIndex={0}>
        <TaskGoNogo></TaskGoNogo>
      </TaskContextProviderGoNogo>
    </div>
  );
}
