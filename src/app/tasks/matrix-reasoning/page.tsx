"use client"

import { TaskContextProviderMatrixReasoning } from "@/components/matrix-reasoning/TaskContextMatrixReasoning";
import TaskMatrixReasoning from "@/components/matrix-reasoning/TaskMatrixReasoning";

export default function Home() {

  return (
    <div className="overflow-hidden h-screen">
      <TaskContextProviderMatrixReasoning startTrialIndex={0} maxTrialIndex={17} trialMaxDuration={30} trialFeedbackDuration={2}>
        <TaskMatrixReasoning></TaskMatrixReasoning>
      </TaskContextProviderMatrixReasoning>
    </div>
  );
}
