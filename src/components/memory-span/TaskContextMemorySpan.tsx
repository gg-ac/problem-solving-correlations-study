import React, { createContext, useContext, useState, ReactNode, useReducer, useEffect } from 'react';
import { countMatchingDigits } from './utils';
import { usePageContext } from '@/context/PageContext';
import { mean } from 'simple-statistics';
import { computeNormalPercentile } from '../utils/statistics';


interface TaskState {
    trialState: TrialState
    currentTrialIndex: number
    betweenDigitTimeInterval: number
    trialSpecs: TrialSpec[]
    trialEventHistory: TrialEventRecord[]
    blockStarted: boolean
    blockCompleted: boolean
    fixationActive: boolean
}


interface TrialState {
    startTime: number
    currentTime: number
    confirmPressed: boolean
    trialStarted: boolean
    trialEnded: boolean
    responseStarted: boolean
    responseEnded: boolean
    feedbackStarted: boolean
    feedbackEnded: boolean
    currentDigitIndex: number | null
    responseString: string | null
}


interface TrialSpec {
    digits: number[]
    maxResponseTime: number
    feedbackTime: number
}


interface TrialEventRecord {
    trialNumber: number
    timestamp: number
    action: TaskActionEnum | null
    targetString: string | null
    responseString: string | null
    digitsCorrect: number | null
}


interface TaskContextType {
    state: TaskState
    exportTrialEventHistory: () => TrialEventRecord[]
    setResponseString: (str: string) => void
    startTrial: (trialIndex: number) => void
    skipResponseWait: () => void
}


export enum TaskActionEnum {
    START_TRIAL = "START_TRIAL",
    SET_TRIAL_INDEX = "SET_TRIAL_INDEX",
    END_TRIAL = "END_TRIAL",
    START_RESPONSE_TIME = "START_RESPONSE_TIME",
    END_RESPONSE_TIME = "END_RESPONSE_TIME",
    START_FEEDBACK = "START_FEEDBACK",
    END_FEEDBACK = "END_FEEDBACK",
    SET_TRIAL_TIME = "SET_TRIAL_TIME",
    PRESS_CONFIRM = "PRESS_CONFIRM",
    START_TASK_BLOCK = "START_TASK_BLOCK",
    COMPLETE_TASK_BLOCK = "COMPLETE_TASK_BLOCK",
    SHOW_FIXATION = "SHOW_FIXATION",
    CLEAR_FIXATION = "CLEAR_FIXATION",
    SET_RESPONSE_STRING = "SET_RESPONSE_STRING",
    SET_DISPLAYED_DIGIT_INDEX = "SET_DISPLAYED_DIGIT_INDEX"
}


type TaskAction =
    { type: TaskActionEnum.START_TRIAL, timestamp: number, trialIndex: number }
    | { type: TaskActionEnum.SET_TRIAL_INDEX, timestamp: number, trialIndex: number }
    | { type: TaskActionEnum.START_FEEDBACK, timestamp: number }
    | { type: TaskActionEnum.END_TRIAL, timestamp: number }
    | { type: TaskActionEnum.END_FEEDBACK, timestamp: number }
    | { type: TaskActionEnum.SET_TRIAL_TIME, timestamp: number }
    | { type: TaskActionEnum.PRESS_CONFIRM, timestamp: number }
    | { type: TaskActionEnum.START_TASK_BLOCK, timestamp: number }
    | { type: TaskActionEnum.COMPLETE_TASK_BLOCK, timestamp: number }
    | { type: TaskActionEnum.SHOW_FIXATION, timestamp: number }
    | { type: TaskActionEnum.CLEAR_FIXATION, timestamp: number }
    | { type: TaskActionEnum.SET_RESPONSE_STRING, timestamp: number, str: string }
    | { type: TaskActionEnum.START_RESPONSE_TIME, timestamp: number }
    | { type: TaskActionEnum.END_RESPONSE_TIME, timestamp: number }
    | { type: TaskActionEnum.SET_DISPLAYED_DIGIT_INDEX, timestamp: number, digit: number | null }


const TaskContext = createContext<TaskContextType | undefined>(undefined)


const initialTrialState: TrialState = {
    startTime: 0,
    currentTime: 0,
    confirmPressed: false,
    trialStarted: false,
    trialEnded: false,
    responseStarted: false,
    responseEnded: false,
    feedbackStarted: false,
    feedbackEnded: false,
    currentDigitIndex: null,
    responseString: null
}


const initialTaskState: TaskState = {
    trialState: initialTrialState,
    betweenDigitTimeInterval: 250,
    currentTrialIndex: 0,
    trialSpecs: [],
    trialEventHistory: [],
    blockStarted: false,
    blockCompleted: false,
    fixationActive: true
}


const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
    let newState = state
    let newTrialEventHistory = state.trialEventHistory

    switch (action.type) {
        case TaskActionEnum.START_TRIAL:
            newState = { ...state, currentTrialIndex: action.trialIndex, trialState: { ...initialTrialState, startTime: action.timestamp, currentTime: action.timestamp, trialStarted: true } }
            break
        case TaskActionEnum.SET_TRIAL_INDEX:
            newState = { ...state, currentTrialIndex: action.trialIndex }
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
        case TaskActionEnum.PRESS_CONFIRM:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp, confirmPressed: true } }
            break
        case TaskActionEnum.START_TASK_BLOCK:
            newState = { ...state, blockStarted: true, trialState: { ...state.trialState, currentTime: action.timestamp } }
            break
        case TaskActionEnum.COMPLETE_TASK_BLOCK:
            newState = { ...state, blockCompleted: true, trialState: { ...state.trialState, currentTime: action.timestamp } }
            break
        case TaskActionEnum.SHOW_FIXATION:
            newState = { ...state, fixationActive: true, trialState: { ...state.trialState, currentTime: action.timestamp } }
            break
        case TaskActionEnum.CLEAR_FIXATION:
            newState = { ...state, fixationActive: false, trialState: { ...state.trialState, currentTime: action.timestamp } }
            break
        case TaskActionEnum.START_RESPONSE_TIME:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp, responseStarted: true } }
            break
        case TaskActionEnum.END_RESPONSE_TIME:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp, responseEnded: true } }
            break
        case TaskActionEnum.SET_RESPONSE_STRING:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp, responseString: action.str } }
            break
        case TaskActionEnum.SET_DISPLAYED_DIGIT_INDEX:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp, currentDigitIndex: action.digit } }
            break
    }

    const matchingDigits = countMatchingDigits(newState.trialSpecs[newState.currentTrialIndex].digits, newState.trialState.responseString)

    if (action.type != TaskActionEnum.SET_DISPLAYED_DIGIT_INDEX) {
        const newRecord: TrialEventRecord = {
            trialNumber: newState.currentTrialIndex,
            timestamp: newState.trialState.currentTime,
            action: action.type,
            responseString: newState.trialState.responseString,
            targetString: newState.trialSpecs[newState.currentTrialIndex].digits.join(""),
            digitsCorrect: matchingDigits
        }
        newTrialEventHistory = [...state.trialEventHistory, newRecord]
    }
    newState = { ...newState, trialEventHistory: newTrialEventHistory }

    return newState
}


export const TaskContextProviderMemorySpan: React.FC<{ children: ReactNode, trialSpecs: TrialSpec[], startTrialIndex: number }> = ({ children, trialSpecs, startTrialIndex }) => {

    const [state, dispatch] = useReducer(taskReducer, { ...initialTaskState, trialSpecs: trialSpecs, currentTrialIndex: startTrialIndex })
    const { pages, currentPageIndex, scoreData, setCurrentPageIndex, setScoreData } = usePageContext();


     function computeWMMatchScore(){
        var correctDigitCounts:number[] = []
        for (var event of state.trialEventHistory){
            if(event.action == TaskActionEnum.END_TRIAL){
                if(event.digitsCorrect != null){
                    correctDigitCounts.push(event.digitsCorrect)
                }
            }
        }
        return mean(correctDigitCounts)
    }

    const exportTrialEventHistory = () => {
        return state.trialEventHistory
    }

    const setDisplayedDigitIndex = (index: number) => {
        dispatch({ type: TaskActionEnum.SET_DISPLAYED_DIGIT_INDEX, timestamp: performance.now(), digit: index })
    }

    const startBlock = () => {
        dispatch({ type: TaskActionEnum.START_TASK_BLOCK, timestamp: performance.now() })
    }

    const setTrialIndex = (newIndex: number) => {
        dispatch({ type: TaskActionEnum.SET_TRIAL_INDEX, timestamp: performance.now(), trialIndex: newIndex })
    }

    const showFixation = () => {
        dispatch({ type: TaskActionEnum.SHOW_FIXATION, timestamp: performance.now() })
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

    const startResponseStage = () => {
        dispatch({ type: TaskActionEnum.START_RESPONSE_TIME, timestamp: performance.now() })
    }

    const endResponseStage = () => {
        dispatch({ type: TaskActionEnum.END_RESPONSE_TIME, timestamp: performance.now() })
    }

    const startFeedback = () => {
        dispatch({ type: TaskActionEnum.START_FEEDBACK, timestamp: performance.now() })
    }

    const endFeedback = () => {
        dispatch({ type: TaskActionEnum.END_FEEDBACK, timestamp: performance.now() })
    }

    const skipResponseWait = () => {
        endResponseStage()
        endTrial()
        startFeedback()
    }

    const nextTrial = () => {
        console.log(state.currentTrialIndex)
        if (state.currentTrialIndex < state.trialSpecs.length - 1) {
            let nextIndex = state.currentTrialIndex + 1
            setTrialIndex(nextIndex)
            showFixation()
            return nextIndex
        }
        else {
            dispatch({ type: TaskActionEnum.COMPLETE_TASK_BLOCK, timestamp: performance.now() })
            currentPageIndex + 1 < pages.length ? setCurrentPageIndex(currentPageIndex + 1) : null            
            console.log(`mean items recalled: ${computeWMMatchScore()}`)
            setScoreData({...scoreData, memorySpan:computeNormalPercentile(3.14, 0.68, computeWMMatchScore())})
            return null
        }
    }

    const setResponseString = (str: string) => {
        if (state.trialState.responseStarted && !state.trialState.responseEnded) {
            dispatch({ type: TaskActionEnum.SET_RESPONSE_STRING, timestamp: performance.now(), str: str })
        }
    }

    const handleStartBlockPressed = () => {
        if (!state.trialState.confirmPressed && !state.trialState.trialEnded) {
            if (!state.blockStarted) {
                startBlock()
            }
        }
    }

    // Flags to prevent triggering multiple confirm events by holding the confirm key down
    let enterDown = false
    const handleEnterDown = () => {
        enterDown = true
    }
    const handleEnterUp = () => {
        enterDown = false
    }

    // Trigger the start level event when the block is started
    useEffect(() => {
        if (state.blockStarted && !state.fixationActive) {
            startTrial(state.currentTrialIndex)
        }
    }, [state.blockStarted, state.fixationActive]);

    // Add a key press listener for the confirm event
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code == "Enter") {
                // Only trigger a confirm event when the enter key is pressed once, not held down
                if (!enterDown) {
                    handleStartBlockPressed()
                }
                handleEnterDown()
            }
        };
        const handleKeyRelease = (event: KeyboardEvent) => {
            if (event.code == "Enter") {
                handleEnterUp()
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('keyup', handleKeyRelease);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('keyup', handleKeyRelease);
        };
    });


    // End the trial after maximum response duration
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (state.trialState.responseStarted && !state.trialState.responseEnded && !state.trialState.trialEnded) {
                endResponseStage()
                endTrial()
                startFeedback()
            }
        }, state.trialSpecs[state.currentTrialIndex].maxResponseTime);
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [state.trialState.responseStarted, state.trialState.responseEnded, state.trialState.trialEnded]);


    // End the feedback after feedback duration
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (state.trialState.feedbackStarted && !state.trialState.feedbackEnded) {
                endFeedback()
                nextTrial()
            }
        }, state.trialSpecs[state.currentTrialIndex].feedbackTime);
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [state.trialState.feedbackStarted, state.currentTrialIndex]);


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


    // Cycle through the digits
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (state.trialState.trialStarted && !state.trialState.trialEnded) {
                let nextIndex = null
                if (state.trialState.currentDigitIndex === null) {
                    nextIndex = 0
                } else {
                    nextIndex = state.trialState.currentDigitIndex + 1
                }

                if (nextIndex >= state.trialSpecs[state.currentTrialIndex].digits.length) {
                    startResponseStage()
                } else {
                    setDisplayedDigitIndex(nextIndex)
                }

            }
        }, state.betweenDigitTimeInterval);
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [state.trialState.trialStarted, state.trialState.currentDigitIndex]);

    return (
        <TaskContext.Provider value={{
            state,
            exportTrialEventHistory,
            setResponseString,
            startTrial,
            skipResponseWait
        }}>
            {children}
        </TaskContext.Provider>
    );

}

export const useTaskContextMemorySpan = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContextMemorySpan must be used within a TaskContext Provider');
    }
    return context;
};