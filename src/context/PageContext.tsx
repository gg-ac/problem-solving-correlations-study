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

export const PageProvider: React.FC<{ children: ReactNode, pages: string[], startPageIndex: number }> = ({ children, pages, startPageIndex }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(startPageIndex);
  const [scoreData, setScoreData] = useState<scoreTypeData>({ goNogo: null, visualSearch: null, matrixReasoning: null, memorySpan: null, stringTransformation: null });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const [taskData, setTaskData] = useState<TaskDataType[]>([]);


  const [startTimestamp, setStartTimestamp] = useState("")
  const [localPID, setLocalPID] = useState("")
  const [localSaveDataToCloud, setLocalSaveDataToCloud] = useState(false)
  const [localRedirectURL, setLocalRedirectURL] = useState<string|null>("")

  useEffect(() => {
    const now = new Date();
    const formattedTimestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    setStartTimestamp(formattedTimestamp)
    setLocalPID(`p_${startTimestamp}`)

    // Get the recruitment platform participant ID from the URL parameter, if available
    const rid = searchParams.get('rid')
    if (rid != null) {
      if (rid) {
        setLocalPID(rid)
        // Set the data to save to the cloud rather than downloads folder if using a recruitment platform URL
        setLocalSaveDataToCloud(true)
        // Set the recruitment platform's completion redirect code
        const redirectCode = searchParams.get('rc')
        if (redirectCode != null) {
          if (redirectCode) {
            const url = redirectCode !== "" ? `https://app.prolific.com/submissions/complete?cc=${redirectCode}` : null
            setLocalRedirectURL(url)
          }
        }
      }
    }
  }, []);



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
    <PageContext.Provider value={{ participantID: localPID, saveDataToCloud: localSaveDataToCloud, completedSessionRedirectURL: localRedirectURL, pages, currentPageIndex, taskData, scoreData, setCurrentPageIndex, addTaskData, setScoreData }}>
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
