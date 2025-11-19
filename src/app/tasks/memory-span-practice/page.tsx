"use client"

import { TaskContextProviderMemorySpan } from "@/components/memory-span/TaskContextMemorySpan";
import { TaskMemorySpan } from "@/components/memory-span/TaskMemorySpan";

import { generateMemorySpanTaskTrials } from "@/components/memory-span/TrialGenerator";

export default function Home() {

  return (
    <div className="overflow-hidden h-screen">
      <TaskContextProviderMemorySpan trialSpecs={generateMemorySpanTaskTrials([12, 21], 2, "memory-span-practice").map((sequence) => {return {
        digits: sequence,
        maxResponseTime: 15000,
        feedbackTime: 7000
      }})} startTrialIndex={0}>
        <TaskMemorySpan isPractice={true}></TaskMemorySpan>
      </TaskContextProviderMemorySpan>
    </div>
  );
}
