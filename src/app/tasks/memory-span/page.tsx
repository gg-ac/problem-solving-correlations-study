"use client"

import { TaskContextProviderMemorySpan } from "@/components/memory-span/TaskContextMemorySpan";
import TaskMemorySpan from "@/components/memory-span/TaskMemorySpan";

export default function Home() {

  return (
    <div className="overflow-hidden h-screen">
      <TaskContextProviderMemorySpan trialSpecs={[{
        digits: [1,3,2,4,3,5,4,6,5,7,6,8,7,9,8,0,1],
        maxResponseTime: 15000,
        feedbackTime: 5000
      },
      {
        digits: [4,2,6,3,7,4,7,5,8,1,3,2],
        maxResponseTime: 15000,
        feedbackTime: 5000
      },]} startTrialIndex={0}>
        <TaskMemorySpan></TaskMemorySpan>
      </TaskContextProviderMemorySpan>
    </div>
  );
}
