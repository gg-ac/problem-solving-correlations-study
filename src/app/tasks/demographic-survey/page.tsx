"use client"

import { TaskContextProviderDemographicSurvey } from "@/components/demographic-survey/TaskContextDemographicSurvey";
import TaskDemographicSurvey from "@/components/demographic-survey/TaskDemographicSurvey";

export default function Home() {

  return (
    <div className="overflow-hidden h-screen">
      <TaskContextProviderDemographicSurvey>
        <TaskDemographicSurvey></TaskDemographicSurvey>
      </TaskContextProviderDemographicSurvey>
    </div>
  );
}
