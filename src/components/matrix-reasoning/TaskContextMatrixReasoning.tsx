import { usePageContext } from '@/context/PageContext';
import React, { createContext, useContext, useState, ReactNode, useReducer, useEffect } from 'react';
import { computeNormalPercentile } from '../utils/statistics';


interface TaskState {
    trialState: TrialState
    currentTrialIndex: number
    maxTrialIndex: number
    trialMaxDuration: number
    trialFeedbackDuration: number
    trialEventHistory: TrialEventRecord[]
    blockStarted: boolean
    blockCompleted: boolean
    fixationActive: boolean
    currentInstructionsPageIndex: number
    isPractice: boolean
}


interface TrialState {
    startTime: number
    currentTime: number
    trialStarted: boolean
    trialEnded: boolean
    feedbackStarted: boolean,
    feedbackEnded: boolean,
    responseCorrect: boolean | null,
    selectedAnswerID: number | null
}


interface TrialEventRecord {
    trialNumber: number
    timestamp: number
    action: TaskActionEnum | null
    selectedAnswerID: number | null
    responseCorrect: boolean | null
}


interface TaskContextType {
    state: TaskState
    exportTrialEventHistory: () => TrialEventRecord[]
    handleSolutionPressed: (solutionID: number) => void
    nextTrial: () => number | null
    startTrial: (trialIndex: number) => void
    endTrial: () => void
    setCurrentInstructionsPageIndex: (value:number) => void
}


export enum TaskActionEnum {
    START_TRIAL = "START_TRIAL",
    END_TRIAL = "END_TRIAL",
    START_FEEDBACK = "START_FEEDBACK",
    END_FEEDBACK = "END_FEEDBACK",
    SET_TRIAL_TIME = "SET_TRIAL_TIME",
    SELECT_ANSWER = "SELECT_ANSWER",
    START_TASK_BLOCK = "START_TASK_BLOCK",
    COMPLETE_TASK_BLOCK = "COMPLETE_TASK_BLOCK",
    CLEAR_FIXATION = "CLEAR_FIXATION",
    UPDATE_TIME = "UPDATE_TIME",
    SET_INSTRUCTIONS_PAGE_INDEX = "SET_INSTRUCTIONS_PAGE_INDEX"
}


type TaskAction =
    { type: TaskActionEnum.START_TRIAL, timestamp: number, trialIndex: number }
    | { type: TaskActionEnum.START_FEEDBACK, timestamp: number }
    | { type: TaskActionEnum.END_TRIAL, timestamp: number }
    | { type: TaskActionEnum.END_FEEDBACK, timestamp: number }
    | { type: TaskActionEnum.SET_TRIAL_TIME, timestamp: number }
    | { type: TaskActionEnum.SELECT_ANSWER, timestamp: number, answerID: number }
    | { type: TaskActionEnum.START_TASK_BLOCK, timestamp: number }
    | { type: TaskActionEnum.COMPLETE_TASK_BLOCK, timestamp: number }
    | { type: TaskActionEnum.CLEAR_FIXATION, timestamp: number }
    | { type: TaskActionEnum.UPDATE_TIME, timestamp: number }
    | { type: TaskActionEnum.SET_INSTRUCTIONS_PAGE_INDEX, index: number }


const TaskContext = createContext<TaskContextType | undefined>(undefined)


const initialTrialState: TrialState = {
    startTime: 0,
    currentTime: 0,
    trialStarted: false,
    trialEnded: false,
    feedbackStarted: false,
    feedbackEnded: false,
    responseCorrect: null,
    selectedAnswerID: null
}


const initialTaskState: TaskState = {
    trialState: initialTrialState,
    maxTrialIndex: 0,
    currentTrialIndex: 0,
    trialMaxDuration: 0,
    trialFeedbackDuration: 0,
    trialEventHistory: [],
    blockStarted: false,
    blockCompleted: false,
    fixationActive: true,
    currentInstructionsPageIndex: 0,
    isPractice: true
}


const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
    let newState = state
    let newTrialEventHistory = state.trialEventHistory
    switch (action.type) {
        case TaskActionEnum.START_TRIAL:
            newState = { ...state, currentTrialIndex: action.trialIndex, trialState: { ...initialTrialState, startTime: action.timestamp, currentTime: action.timestamp, trialStarted: true } }
            break
        case TaskActionEnum.END_TRIAL:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp, trialStarted: false, trialEnded: true } }
            break
        case TaskActionEnum.START_FEEDBACK:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp, feedbackStarted: true } }
            break
        case TaskActionEnum.END_FEEDBACK:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp, feedbackStarted: false, feedbackEnded: true } }
            break
        case TaskActionEnum.SET_TRIAL_TIME:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp } }
            break
        case TaskActionEnum.SELECT_ANSWER:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp, selectedAnswerID: action.answerID } }
            break
        case TaskActionEnum.START_TASK_BLOCK:
            newState = { ...state, blockStarted: true, trialState: { ...state.trialState, currentTime: action.timestamp } }
            break
        case TaskActionEnum.COMPLETE_TASK_BLOCK:
            newState = { ...state, blockCompleted: true, trialState: { ...state.trialState, currentTime: action.timestamp } }
            break
        case TaskActionEnum.CLEAR_FIXATION:
            newState = { ...state, fixationActive: false, trialState: { ...state.trialState, currentTime: action.timestamp } }
            break
        case TaskActionEnum.UPDATE_TIME:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp } }
            break
        case TaskActionEnum.SET_INSTRUCTIONS_PAGE_INDEX:
            newState = { ...state, currentInstructionsPageIndex:action.index }
            break
    }
    const responseCorrect = newState.trialState.selectedAnswerID == 0
    if (action.type != TaskActionEnum.UPDATE_TIME) {        
        const newRecord: TrialEventRecord = {
            trialNumber: newState.currentTrialIndex,
            timestamp: newState.trialState.currentTime,
            action: action.type,
            selectedAnswerID: newState.trialState.selectedAnswerID,
            responseCorrect: responseCorrect,
        }
        newTrialEventHistory = [...state.trialEventHistory, newRecord]
    }
    newState = { ...newState, trialEventHistory: newTrialEventHistory, trialState: { ...newState.trialState, responseCorrect: responseCorrect } }

    return newState
}


export const TaskContextProviderMatrixReasoning: React.FC<{ children: ReactNode, startTrialIndex: number, maxTrialIndex: number, trialMaxDuration: number, trialFeedbackDuration: number, isPractice:boolean }> = ({ children, startTrialIndex, maxTrialIndex, trialMaxDuration, trialFeedbackDuration, isPractice }) => {

    const [state, dispatch] = useReducer(taskReducer, { ...initialTaskState, currentTrialIndex: startTrialIndex, maxTrialIndex: maxTrialIndex, trialMaxDuration: trialMaxDuration, trialFeedbackDuration: trialFeedbackDuration, isPractice: isPractice })
    const { pages, currentPageIndex, scoreData, setCurrentPageIndex, setScoreData } = usePageContext();


    function computePerformanceScore(){
        var solvedTrials:Set<number> = new Set()
        var totalTrials:Set<number> = new Set()
        for (var event of state.trialEventHistory){            
                if(event.action == TaskActionEnum.END_TRIAL){
                    totalTrials.add(event.trialNumber)
                    if(event.responseCorrect){
                    solvedTrials.add(event.trialNumber)
                    }
                }
            }
        return 100 * solvedTrials.size / totalTrials.size
    }
    
    const exportTrialEventHistory = () => {
        return state.trialEventHistory
    }

    const startBlock = () => {
        dispatch({ type: TaskActionEnum.START_TASK_BLOCK, timestamp: performance.now() })
    }

    const clearFixation = () => {
        dispatch({ type: TaskActionEnum.CLEAR_FIXATION, timestamp: performance.now() })
    }

    const startTrial = (trialIndex: number) => {
        dispatch({ type: TaskActionEnum.START_TRIAL, timestamp: performance.now(), trialIndex: trialIndex })
    }

    const endTrial = () => {
        dispatch({ type: TaskActionEnum.END_TRIAL, timestamp: performance.now() })
    }

    const startFeedback = () => {
        dispatch({ type: TaskActionEnum.START_FEEDBACK, timestamp: performance.now() })
    }

    const endFeedback = () => {
        dispatch({ type: TaskActionEnum.END_FEEDBACK, timestamp: performance.now() })
    }

    const updateTime = () => {
        dispatch({ type: TaskActionEnum.UPDATE_TIME, timestamp: performance.now() })
    }

    const setCurrentInstructionsPageIndex = (index:number) => {
        dispatch({ type: TaskActionEnum.SET_INSTRUCTIONS_PAGE_INDEX, index:index })
    }

    const nextTrial = () => {
        if (state.currentTrialIndex < state.maxTrialIndex) {
            let nextIndex = state.currentTrialIndex + 1
            startTrial(nextIndex)
            return nextIndex
        }
        else {
            dispatch({ type: TaskActionEnum.COMPLETE_TASK_BLOCK, timestamp: performance.now() })
            currentPageIndex + 1 < pages.length ? setCurrentPageIndex(currentPageIndex + 1) : null
            console.log(`performance score: ${computePerformanceScore()}`)
            setScoreData({...scoreData, matrixReasoning:computeNormalPercentile(69.15, 16.69, computePerformanceScore())})
            return null
        }
    }

    const handleSolutionPressed = (solutionID: number) => {
        if (state.trialState.selectedAnswerID == null && !state.trialState.trialEnded) {
            dispatch({ type: TaskActionEnum.SELECT_ANSWER, timestamp: performance.now(), answerID: solutionID })
        }
    }


    // Trigger the start level event when the block is started
    useEffect(() => {
        if (state.blockStarted && !state.fixationActive) {
            startTrial(startTrialIndex)
        }
    }, [state.blockStarted, state.fixationActive]);


    // End the trial when an answer is selected
    useEffect(() => {
        if (state.trialState.selectedAnswerID != null) {
            endTrial()
            startFeedback()
        }
    }, [state.trialState.selectedAnswerID]);


    // End the trial after maximum trial duration
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (state.trialState.trialStarted && !state.trialState.trialEnded) {
                endTrial()
                startFeedback()
            }
        }, state.trialMaxDuration * 1000);
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [state.trialState.trialStarted]);


    // Update the current trial time
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (state.trialState.trialStarted && !state.trialState.trialEnded) {
                updateTime()
            }
        }, 10);
        return () => clearTimeout(timeoutId);
    }, [state.trialState.trialStarted, state.trialState.currentTime]);


    // End the feedback after feedback duration
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (state.trialState.feedbackStarted && !state.trialState.feedbackEnded) {
                endFeedback()
                nextTrial()
            }
        }, state.trialFeedbackDuration * 1000);
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [state.trialState.feedbackStarted]);

    // Show the fixation marker for a while, then start the task stimuli
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (state.blockStarted && state.fixationActive) {
                clearFixation()
            }
        }, 1000);
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [state.fixationActive, state.blockStarted]);



    // Flags to prevent triggering multiple go events by holding the go key down
    let spaceDown = false
    const handleSpaceDown = () => {
        spaceDown = true
    }
    const handleSpaceUp = () => {
        spaceDown = false
    }

    // Add a key press listener for the Go event
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code == "Space") {
                // Only trigger a go event when the space is pressed once, not held down
                if (!spaceDown && (state.currentInstructionsPageIndex == 3 || !state.isPractice)) {
                    startBlock()
                }
                handleSpaceDown()
            }
        };
        const handleKeyRelease = (event: KeyboardEvent) => {
            if (event.code == "Space") {
                handleSpaceUp()
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('keyup', handleKeyRelease);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('keyup', handleKeyRelease);
        };
    });



    return (
        <TaskContext.Provider value={{
            state,
            exportTrialEventHistory,
            handleSolutionPressed,
            nextTrial,
            startTrial,
            endTrial,
            setCurrentInstructionsPageIndex
        }}>
            {children}
        </TaskContext.Provider>
    );

}

export const useTaskContextMatrixReasoning = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContextMatrixReasoning must be used within a TaskContext Provider');
    }
    return context;
};