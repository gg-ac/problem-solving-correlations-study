import { usePageContext } from '@/context/PageContext';
import React, { createContext, useContext, ReactNode, useReducer, useEffect } from 'react';
import { mean } from 'simple-statistics';
import { computeNormalPercentile } from '../utils/statistics';
import { Howl } from 'howler';
import { asset } from '@/utils/assets';


var errorSound =  new Howl({
        src: [asset(`/audio/sound_effects/error_sound.mp3`)],
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
    yesPressed: boolean
    noPressed: boolean
    trialStarted: boolean
    trialEnded: boolean
    feedbackStarted: boolean,
    feedbackEnded: boolean,
    responseCorrect: boolean | null
}


interface TrialSpec {
    gridContents: number[]
    targetIsPresent: boolean
    maxTime: number
    feedbackTime: number
}


interface TrialEventRecord {
    trialNumber: number
    timestamp: number
    action: TaskActionEnum | null
    gridContents: number[]
    targetIsPresent: boolean
}


interface TaskContextType {
    state: TaskState
    exportTrialEventHistory: () => TrialEventRecord[]
    handleYesPressed: () => void
    handleNoPressed: () => void
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
    PRESS_NO = "PRESS_NO",
    PRESS_YES = "PRESS_YES",
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
    | { type: TaskActionEnum.PRESS_NO, timestamp: number }
    | { type: TaskActionEnum.PRESS_YES, timestamp: number }
    | { type: TaskActionEnum.START_TASK_BLOCK, timestamp: number }
    | { type: TaskActionEnum.COMPLETE_TASK_BLOCK, timestamp: number }
    | { type: TaskActionEnum.CLEAR_FIXATION, timestamp: number }


const TaskContext = createContext<TaskContextType | undefined>(undefined)


const initialTrialState: TrialState = {
    startTime: 0,
    currentTime: 0,
    noPressed: false,
    yesPressed: false,
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
        case TaskActionEnum.PRESS_NO:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp, noPressed: true } }
            break
        case TaskActionEnum.PRESS_YES:
            newState = { ...state, trialState: { ...state.trialState, currentTime: action.timestamp, yesPressed: true } }
            break
        case TaskActionEnum.START_TASK_BLOCK:
            newState = { ...state, blockStarted: true, trialState: { ...state.trialState, currentTime: action.timestamp } }
            break
        case TaskActionEnum.COMPLETE_TASK_BLOCK:
            newState = { ...state, blockCompleted:true, trialState: { ...state.trialState, currentTime: action.timestamp } }
            break
        case TaskActionEnum.CLEAR_FIXATION:
            newState = { ...state, fixationActive:false, trialState: { ...state.trialState, currentTime: action.timestamp } }
            break
    }

    const responseCorrect = (newState.trialState.yesPressed && !newState.trialState.noPressed && newState.trialSpecs[newState.currentTrialIndex].targetIsPresent) || (!newState.trialState.yesPressed && newState.trialState.noPressed && !newState.trialSpecs[newState.currentTrialIndex].targetIsPresent)
    const newRecord: TrialEventRecord = {
        trialNumber: newState.currentTrialIndex,
        timestamp: newState.trialState.currentTime,
        action: action.type,
        gridContents: newState.trialSpecs[newState.currentTrialIndex].gridContents,
        targetIsPresent: newState.trialSpecs[newState.currentTrialIndex].targetIsPresent,
    }
    let newTrialEventHistory = [...state.trialEventHistory, newRecord]
    newState = { ...newState, trialEventHistory: newTrialEventHistory, trialState: { ...newState.trialState, responseCorrect: responseCorrect } }

    if(!responseCorrect && action.type == TaskActionEnum.START_FEEDBACK){
        errorSound.play()
    }

    return newState
}


export const TaskContextProviderVisualSearch: React.FC<{ children: ReactNode, trialSpecs: TrialSpec[], startTrialIndex: number }> = ({ children, trialSpecs, startTrialIndex }) => {

    const [state, dispatch] = useReducer(taskReducer, { ...initialTaskState, trialSpecs: trialSpecs, currentTrialIndex: startTrialIndex })
    const { pages, currentPageIndex, scoreData, setCurrentPageIndex, setScoreData } = usePageContext();

    function computeMeanRT(){
        var responseTimes:number[] = []        
        var startTime = 0
        for (var event of state.trialEventHistory){
            if(event.action == TaskActionEnum.START_TRIAL){
                startTime = event.timestamp
            }
            var correctNegative = !event.targetIsPresent && event.action == TaskActionEnum.PRESS_NO
            var correctPositive = event.targetIsPresent && event.action == TaskActionEnum.PRESS_YES
            if(correctNegative || correctPositive){
                responseTimes.push(event.timestamp - startTime)
            }
        }
        return mean(responseTimes)
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
            console.log(`mean RT: ${computeMeanRT()}`)
            setScoreData({...scoreData, visualSearch:100 - computeNormalPercentile(1256, 763, computeMeanRT())})
            return null
        }
    }

    const handleYesPressed = () => {
        if (!state.trialState.yesPressed && !state.trialState.noPressed && !state.trialState.trialEnded) {
            if (!state.blockStarted) {
                startBlock()
            }else{
                dispatch({ type: TaskActionEnum.PRESS_YES, timestamp: performance.now() })
            }    
        }
    }
    
    const handleNoPressed = () => {
        if (!state.trialState.yesPressed && !state.trialState.noPressed && state.trialState.trialStarted && !state.trialState.trialEnded) {
            dispatch({ type: TaskActionEnum.PRESS_NO, timestamp: performance.now() })            
        }
    }

    // Flags to prevent triggering multiple "yes" events by holding the go key down
    let jDown = false
    const handleJDown = () => {
        jDown = true
    }
    const handleJUp = () => {
        jDown = false
    }

    // Flags to prevent triggering multiple "no" events by holding the go key down
    let fDown = false
    const handleFDown = () => {
        fDown = true
    }
    const handleFUp = () => {
        fDown = false
    }

    // // Trigger the start block event once on load.
    // // Later, we'll have this trigger when a key is pressed
    // useEffect(() => {
    //     startBlock()
    // }, []);

    // Trigger the start level event when the block is started
    useEffect(() => {
        if (state.blockStarted && !state.fixationActive) {
            startTrial(startTrialIndex)
        }
    }, [state.blockStarted, state.fixationActive]);


    // Add a key press listener for the "yes" event
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code == "KeyJ") {
                // Only trigger a "yes" event when the J-key is pressed once, not held down
                if (!jDown) {
                    handleYesPressed()
                }
                handleJDown()
            }
            else if (event.code == "KeyF") {
                // Only trigger a "no" event when the F-key is pressed once, not held down
                if (!fDown) {
                    handleNoPressed()
                }
                handleFDown()
            }
        };
        const handleKeyRelease = (event: KeyboardEvent) => {
            if (event.code == "KeyJ") {
                handleJUp()
            }
            else if (event.code == "KeyF") {
                handleFUp()
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('keyup', handleKeyRelease);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('keyup', handleKeyRelease);
        };
    });

    // End the trial when "yes" or "no" is pressed
    useEffect(() => {
        if (state.trialState.yesPressed || state.trialState.noPressed) {
            endTrial()
            startFeedback()
        }
    }, [state.trialState.yesPressed, state.trialState.noPressed]);

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
            handleYesPressed,
            handleNoPressed,
            nextTrial,
            startTrial,
            endTrial
        }}>
            {children}
        </TaskContext.Provider>
    );

}

export const useTaskContextVisualSearch = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContextVisualSearch must be used within a TaskContext Provider');
    }
    return context;
};