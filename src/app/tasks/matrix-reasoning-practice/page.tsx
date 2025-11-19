"use client"

import { TaskContextProviderMatrixReasoning } from "@/components/matrix-reasoning/TaskContextMatrixReasoning";
import { TaskMatrixReasoning } from "@/components/matrix-reasoning/TaskMatrixReasoning";


export default function Home() {

  return (
    <div className="overflow-hidden h-screen">
      <TaskContextProviderMatrixReasoning startTrialIndex={0} maxTrialIndex={2} trialMaxDuration={60} trialFeedbackDuration={10} isPractice={true}>
        <TaskMatrixReasoning isPractice={true}></TaskMatrixReasoning>
      </TaskContextProviderMatrixReasoning>
    </div>
  );
}
