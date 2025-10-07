"use client"
import { saveToDownloadsFolder } from "@/components/io/DataStorage";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type PageContextType = {
  participantID: string,
  pages: string[];
  currentPageIndex: number;
  taskData: TaskDataType[];
  scoreData: scoreTypeData;
  setCurrentPageIndex: (index: number) => void;
  setTaskData: (data: TaskDataType[]) => void;
  setScoreData: (scoreDate: scoreTypeData) => void;
};

type TaskDataType = {
  taskName: string,
  data: object[]
}

type scoreTypeData = {
  goNogo: number | null
  visualSearch: number | null,
  matrixReasoning: number | null,
  memorySpan: number | null,
  stringTransformation: number | null
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider: React.FC<{ children: ReactNode, participantID: string, pages: string[], startPageIndex: number }> = ({ children, participantID, pages, startPageIndex }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(startPageIndex);
  const [taskData, setTaskData] = useState<TaskDataType[]>([]);
  const [scoreData, setScoreData] = useState<scoreTypeData>({ goNogo: null, visualSearch: null, matrixReasoning: null, memorySpan: null, stringTransformation: null});
  const router = useRouter();

  useEffect(() => {
    router.push(`/tasks/${pages[currentPageIndex]}`)
    if (currentPageIndex >= pages.length) {
      saveToDownloadsFolder(JSON.stringify(taskData), "trial_data.json")
    }
  }, [currentPageIndex]);

  return (
    <PageContext.Provider value={{ participantID, pages, currentPageIndex, taskData, scoreData, setCurrentPageIndex, setTaskData, setScoreData }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePageContext must be used within a PageProvider');
  }
  return context;
};
