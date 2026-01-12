"use client"
import { saveToDownloadsFolder } from "@/components/io/DataStorage";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type PageContextType = {
  participantID: string,
  saveDataToCloud: boolean,
  completedSessionRedirectURL: string | null,
  pages: string[];
  currentPageIndex: number;
  taskData: TaskDataType[];
  scoreData: scoreTypeData;
  setCurrentPageIndex: (index: number) => void;
  addTaskData: (data: TaskDataType) => void;
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

export const PageProvider: React.FC<{ children: ReactNode, participantID: string, saveDataToCloud: boolean, completedSessionRedirectURL: string | null, pages: string[], startPageIndex: number }> = ({ children, participantID, completedSessionRedirectURL, saveDataToCloud, pages, startPageIndex }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(startPageIndex);
  const [scoreData, setScoreData] = useState<scoreTypeData>({ goNogo: null, visualSearch: null, matrixReasoning: null, memorySpan: null, stringTransformation: null });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()

  const [taskData, setTaskData] = useState<TaskDataType[]>([]);

  const addTaskData = (newTaskData: TaskDataType) => {
    const updatedTaskData = [...taskData, newTaskData];
    setTaskData(updatedTaskData);
    localStorage.setItem('taskData', JSON.stringify(updatedTaskData));
  };


  // Allow resuming a specific task using the exception URL parameter
  useEffect(() => {
    const exception = searchParams.get('exception')
    if (exception != null) {
      if (exception) {
        // Load any existing task data
        const savedTaskData = localStorage.getItem('taskData');
        setTaskData(savedTaskData ? JSON.parse(savedTaskData) : [])

        // Go to the required page
        const splitPath = pathname.split("/")
        const newIndex = pages.indexOf(splitPath[splitPath.length - 1])
        setCurrentPageIndex(newIndex)
        // Remove the exception query parameter
        router.push(`/tasks/${pages[currentPageIndex]}`)
        return
      }
    } else {
      router.push(`/tasks/${pages[currentPageIndex]}`)
    }

    // if (currentPageIndex >= pages.length) {
    //   saveToDownloadsFolder(JSON.stringify(taskData), "trial_data.json")
    // }
  }, [currentPageIndex]);



  return (
    <PageContext.Provider value={{ participantID, saveDataToCloud, completedSessionRedirectURL, pages, currentPageIndex, taskData, scoreData, setCurrentPageIndex, addTaskData, setScoreData }}>
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
