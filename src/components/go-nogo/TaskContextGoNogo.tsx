import { usePageContext } from '@/context/PageContext';
import React, { createContext, useContext, useState, ReactNode, useReducer, useEffect } from 'react';
import { computeNormalPercentile } from '../utils/statistics';
import { Howl } from 'howler';


var errorSound = new Howl({
    src: [`/audio/sound_effects/error_sound.mp3`],
});

interface TaskState {
    trialState: TrialState
    currentTrialIndex: number
    trialSpecs: TrialSpec[]
    trialEventHistory: TrialEventRecord[]
    blockStarted: boolean
    blockCompleted: boolean
    fixationActive: boolean
}


interface TrialState {
    startTime: number
    currentTime: number
    goPressed: boolean
    trialStarted: boolean
    trialEnded: boolean
    feedbackStarted: boolean,
    feedbackEnded: boolean,
    responseCorrect: boolean | null
}


interface TrialSpec {
    isGoTrial: boolean
    maxTime: number
    feedbackTime: number
}


interface TrialEventRecord {
    trialNumber: number
    timestamp: number
    action: TaskActionEnum | null
    isGoTrial: boolean
}


interface TaskContextType {
    state: TaskState
    exportTrialEventHistory: () => TrialEventRecord[]
    handleGoPressed: () => void
    nextTrial: () => number | null
    startTrial: (trialIndex: number) => void
    endTrial: () => void
}


export enum TaskActionEnum {
    START_TRIAL = "START_TRIAL",
    END_TRIAL = "END_TRIAL",
    START_FEEDBACK = "START_FEEDBACK",
    END_FEEDBACK = "END_FEEDBACK",
    SET_TRIAL_TIME = "SET_TRIAL_TIME",
    PRESS_GO = "PRESS_GO",
    START_TASK_BLOCK = "START_TASK_BLOCK",
    COMPLETE_TASK_BLOCK = "COMPLETE_TASK_BLOCK",
    CLEAR_FIXATION = "CLEAR_FIXATION"
}


type TaskAction =
    { type: TaskActionEnum.START_TRIAL, timestamp: number, trialIndex: number }
    | { type: TaskActionEnum.START_FEEDBACK, timestamp: number }
    | { type: TaskActionEnum.END_TRIAL, timestamp: number }
    | { type: TaskActionEnum.END_FEEDBACK, timestamp: number }
    | { type: TaskActionEnum.SET_TRIAL_TIME, timestamp: number }
    | { type: TaskActionEnum.PRESS_GO, timestamp: number }
    | { type: TaskActionEnum.START_TASK_BLOCK, timestamp: number }
    | { type: TaskActionEnum.COMPLETE_TASK_BLOCK, timestamp: number }
    | { type: TaskActionEnum.CLEAR_FIXATION, timestamp: number }


const TaskContext = createContext<TaskContextType | undefined>(undefined)


const initialTrialState: TrialState = {
    startTime: 0,
    currentTime: 0,
    goPressed: false,
    trialStarted: false,
    trialEnded: false,
    feedbackStarted: false,
    feedbackEnded: false,
    responseCorrect: null
}


const initialTaskState: TaskState = {
    trialState: initialTrialState,
    currentTrialIndex: 0,
    trialSpecs: [],
    trialEventHistory: [],
    blockStarted: false,
    blockCompleted: false,
    fixationActive: true
}


const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
    let newState = state
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
        case TaskActionEnum.PRESS_GO:
            console.log(state.trialState.goPressed)
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp, goPressed: true } }
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
    }

    const responseCorrect = (newState.trialState.goPressed && newState.trialSpecs[newState.currentTrialIndex].isGoTrial) || (!newState.trialState.goPressed && !newState.trialSpecs[newState.currentTrialIndex].isGoTrial)
    const newRecord: TrialEventRecord = {
        trialNumber: newState.currentTrialIndex,
        timestamp: newState.trialState.currentTime,
        action: action.type,
        isGoTrial: newState.trialSpecs[newState.currentTrialIndex].isGoTrial,
    }
    let newTrialEventHistory = [...state.trialEventHistory, newRecord]
    newState = { ...newState, trialEventHistory: newTrialEventHistory, trialState: { ...newState.trialState, responseCorrect: responseCorrect } }

    if (!responseCorrect && action.type == TaskActionEnum.START_FEEDBACK) {
        errorSound.play()
    }

    return newState
}


export const TaskContextProviderGoNogo: React.FC<{ children: ReactNode, trialSpecs: TrialSpec[], startTrialIndex: number }> = ({ children, trialSpecs, startTrialIndex }) => {

    const [state, dispatch] = useReducer(taskReducer, { ...initialTaskState, trialSpecs: trialSpecs, currentTrialIndex: startTrialIndex })
    const { pages, currentPageIndex, scoreData, setCurrentPageIndex, setScoreData } = usePageContext();

    function computeCommissionErrorRate() {
        var noGoTrialsTotal = new Set<number>([])
        var noGoTrialsCommissionError = new Set<number>([])
        for (var event of state.trialEventHistory) {
            if (!event.isGoTrial) {
                noGoTrialsTotal.add(event.trialNumber)
                if (event.action == TaskActionEnum.PRESS_GO) {
                    noGoTrialsCommissionError.add(event.trialNumber)
                }
            }
        }
        return noGoTrialsCommissionError.size / noGoTrialsTotal.size
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

    const nextTrial = () => {
        if (state.currentTrialIndex < state.trialSpecs.length - 1) {
            let nextIndex = state.currentTrialIndex + 1
            startTrial(nextIndex)
            return nextIndex
        }
        else {
            dispatch({ type: TaskActionEnum.COMPLETE_TASK_BLOCK, timestamp: performance.now() })
            currentPageIndex + 1 < pages.length ? setCurrentPageIndex(currentPageIndex + 1) : null
            console.log(`errors: ${computeCommissionErrorRate()}`)
            setScoreData({ ...scoreData, goNogo: computeNormalPercentile(96.0, 4.9, 100 * (1 - computeCommissionErrorRate())) })
            return null
        }
    }

    const handleGoPressed = () => {
        if (!state.trialState.goPressed && !state.trialState.trialEnded) {
            if (!state.blockStarted) {
                startBlock()
            } else {
                dispatch({ type: TaskActionEnum.PRESS_GO, timestamp: performance.now() })
            }
        }
    }

    // Flags to prevent triggering multiple go events by holding the go key down
    let spaceDown = false
    const handleSpaceDown = () => {
        spaceDown = true
    }
    const handleSpaceUp = () => {
        spaceDown = false
    }


    // Trigger the start level event when the block is started
    useEffect(() => {
        if (state.blockStarted && !state.fixationActive) {
            startTrial(startTrialIndex)
        }
    }, [state.blockStarted, state.fixationActive]);

    // Add a key press listener for the Go event
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code == "Space") {
                // Only trigger a go event when the space is pressed once, not held down
                if (!spaceDown) {
                    handleGoPressed()
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

    // End the trial when Go is pressed
    useEffect(() => {
        if (state.trialState.goPressed) {
            endTrial()
            startFeedback()
        }
    }, [state.trialState.goPressed]);

    // End the trial after maximum trial duration
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (state.trialState.trialStarted && !state.trialState.trialEnded) {
                endTrial()
                startFeedback()
            }
        }, state.trialSpecs[state.currentTrialIndex].maxTime);
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [state.trialState.trialStarted]);

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


    return (
        <TaskContext.Provider value={{
            state,
            exportTrialEventHistory,
            handleGoPressed,
            nextTrial,
            startTrial,
            endTrial
        }}>
            {children}
        </TaskContext.Provider>
    );

}

export const useTaskContextGoNogo = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContextGoNogo must be used within a TaskContext Provider');
    }
    return context;
};

