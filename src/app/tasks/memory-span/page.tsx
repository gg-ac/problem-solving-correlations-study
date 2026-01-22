"use client"

import { TaskContextProviderMemorySpan } from "@/components/memory-span/TaskContextMemorySpan";
import { TaskMemorySpan } from "@/components/memory-span/TaskMemorySpan";
import { generateMemorySpanTaskTrials } from "@/components/memory-span/TrialGenerator";
import WarningSystem from "@/components/warning-system/WarningSystem";

export default function Home() {

  return (
    <div className="overflow-hidden h-screen">
      <TaskContextProviderMemorySpan trialSpecs={generateMemorySpanTaskTrials([12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 2, "memory-span").map((sequence) => {return {
        digits: sequence,
        maxResponseTime: 15000,
        feedbackTime: 5000
      }})} startTrialIndex={0}>
        <WarningSystem/>
        <TaskMemorySpan isPractice={false}></TaskMemorySpan>
      </TaskContextProviderMemorySpan>
    </div>
  );
}
