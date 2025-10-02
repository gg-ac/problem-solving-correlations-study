import React, { createContext, useContext, ReactNode, useReducer, useEffect } from 'react';
import { symbolStringsMatch, TransformationRule, TSymbol } from './logic/StringTransformation';
import { AbuseWarningEnum } from './enums/AbuseWarningEnum';


interface GameState {
    currentLevelIndex: number;
    levelSchedule: LevelSpec[]
    currentLevelState: LevelState
    undoHistory: PuzzleState[];
    abuseStrikes: number;
    abuseWarningStack: AbuseWarningEnum[];
    gameCompleted: boolean;
    levelEventHistory: LevelEventRecord[];
    mouseX: number;
    mouseY: number;
}

export interface LevelSpec {
    rulesetID: string,
    isPractice: boolean,
    isTutorial: boolean,
    rules: TransformationRule[]
    startString: TSymbol[]
    targetString: TSymbol[]
    maxSolveTime: number | null
    maxRestTime: number
}

interface LevelState {
    rulesetID: string,
    rules: TransformationRule[];
    activeSymbolIndex: number | null;
    activeRuleIndex: number | null;
    invalidRuleUseIndex: number | null;
    invalidSymbolUseIndices: number[] | null;
    validRuleUseIndex: number | null;
    transformedSymbolIndices: number[] | null;
    interactionPaused: boolean,
    puzzleState: PuzzleState
    timestamp: number;
    previousAction: GameEventHistoryEnum | null;
    stepCount: number;
    startTime: number | null;
    currentTime: number | null;
    remainingTime: number | null;
    continueCountdownTimeRemaining: number | null;
    goalAchieved: boolean,
    levelActive: boolean,
    levelEnded: boolean
}

// A subset of LevelState to be exported for analysis
interface LevelEventRecord {
    levelNumber: number
    rulesetID: string,
    isPractice: boolean,
    isTutorial: boolean,
    activeSymbolIndex: number | null
    activeRuleIndex: number | null
    targetString: string
    currentString: string
    timestamp: number
    mouseX: number
    mouseY: number
    previousAction: GameEventHistoryEnum | null
    stepCount: number
}

interface PuzzleState {
    targetString: TSymbol[]
    currentString: TSymbol[]
}

interface GameContextType {
    state: GameState;
    storeLevelEventHistory: () => void;
    handleActiveSymbolIndexChange: (newIndex: number) => void;
    handleActiveRuleIndexChange: (newIndex: number) => void;
    handleTransformationSuccess: (newPuzzleState: PuzzleState) => void;
    handleTransformationFail: () => void;
    handleUndoTransformation: () => void;
    handleResetLevel: () => void;
    getAbuseWarning: () => AbuseWarningEnum | null;
    exportLevelEventHistory: () => LevelEventRecord[];
    nextLevel: () => number | null;
    startLevel: (trialIndex: number) => void;
    endLevel: () => void;
}

enum GameActionEnum {
    SELECT_RULE = "SELECT_RULE",
    DESELECT_RULE = "DESELECT_RULE",
    SELECT_SYMBOL = "SELECT_SYMBOL",
    DESELECT_SYMBOL = "DESELECT_SYMBOL",
    TRANSFORMATION_FAIL = "TRANSFORMATION_FAIL",
    TRANSFORMATION_SUCCESS = "TRANSFORMATION_SUCCESS",
    SET_PUZZLE_STATE = "SET_PUZZLE_STATE",
    UNDO_TRANSFORMATION = "UNDO_TRANSFORMATION",
    RESET_LEVEL = "RESET_LEVEL",
    START_TRIAL = "START_TRIAL",
    END_TRIAL = "END_TRIAL",
    COMPLETE_GAME = "COMPLETE_GAME",
    MARK_TRIAL_SOLVED = "MARK_TRIAL_SOLVED",
    INCREMENT_LEVEL_TRANSFORMATION_COUNT = "INCREMENT_LEVEL_TRANSFORMATION_COUNT",
    SET_LEVEL_TIME = "SET_LEVEL_TIME",
    DECREMENT_REST_TIME_REMAINING = "DECREMENT_REST_TIME_REMAINING",
    PAUSE_INTERACTION_INVALID_RULE_APPLICATION = "PAUSE_INTERACTION_INVALID_RULE_APPLICATION",
    UNPAUSE_INTERACTION_INVALID_RULE_APPLICATION = "UNPAUSE_INTERACTION_INVALID_RULE_APPLICATION",
    PAUSE_INTERACTION_VALID_RULE_APPLICATION = "PAUSE_INTERACTION_VALID_RULE_APPLICATION",
    UNPAUSE_INTERACTION_VALID_RULE_APPLICATION = "UNPAUSE_INTERACTION_VALID_RULE_APPLICATION",
    WARN_STRIKE_REST_TIME = "WARN_STRIKE_REST_TIME",
    DEQUEUE_WARNING = "DEQUEUE_WARNING",
    STORE_LEVEL_EVENT_RECORD = "STORE_LEVEL_EVENT_RECORD",
    SET_MOUSE_POSITION = "SET_MOUSE_POSITION"
}

enum GameEventHistoryEnum {
    SELECT_RULE = "rule:select",
    DESELECT_RULE = "rule:deselect",
    SELECT_SYMBOL = "symbol:select",
    DESELECT_SYMBOL = "symbol:deselect",

    SUCCESSFUL_RULE_APPLICATION = "rule:apply:success",
    INVALID_RULE_APPLICATION = "rule:apply:invalid",
    UNDO_RULE_APPLICATION = "rule:apply:undo",

    TRIAL_RESET = "trial:reset",

    GOAL_ACHIEVED = "goal:achieved",
    START_TRIAL = "trial:start",
    END_TRIAL = "trial:end"
}

type GameAction =
    | { type: GameActionEnum.SELECT_RULE, timestamp: number, payload: number }
    | { type: GameActionEnum.DESELECT_RULE, timestamp: number }
    | { type: GameActionEnum.SELECT_SYMBOL, timestamp: number, payload: number }
    | { type: GameActionEnum.DESELECT_SYMBOL, timestamp: number }
    | { type: GameActionEnum.TRANSFORMATION_SUCCESS, timestamp: number, payload: PuzzleState }
    | { type: GameActionEnum.TRANSFORMATION_FAIL, timestamp: number }
    | { type: GameActionEnum.UNDO_TRANSFORMATION, timestamp: number }
    | { type: GameActionEnum.RESET_LEVEL, timestamp: number }
    | { type: GameActionEnum.START_TRIAL, timestamp: number, trialIndex: number }
    | { type: GameActionEnum.END_TRIAL, timestamp: number }
    | { type: GameActionEnum.MARK_TRIAL_SOLVED, timestamp: number }
    | { type: GameActionEnum.INCREMENT_LEVEL_TRANSFORMATION_COUNT, timestamp: number }
    | { type: GameActionEnum.SET_LEVEL_TIME, timestamp: number }
    | { type: GameActionEnum.DECREMENT_REST_TIME_REMAINING }
    | { type: GameActionEnum.PAUSE_INTERACTION_INVALID_RULE_APPLICATION, timestamp: number }
    | { type: GameActionEnum.UNPAUSE_INTERACTION_INVALID_RULE_APPLICATION, timestamp: number }
    | { type: GameActionEnum.PAUSE_INTERACTION_VALID_RULE_APPLICATION, timestamp: number }
    | { type: GameActionEnum.UNPAUSE_INTERACTION_VALID_RULE_APPLICATION, timestamp: number }
    | { type: GameActionEnum.WARN_STRIKE_REST_TIME }
    | { type: GameActionEnum.DEQUEUE_WARNING }
    | { type: GameActionEnum.COMPLETE_GAME }
    | { type: GameActionEnum.STORE_LEVEL_EVENT_RECORD, payload: LevelEventRecord }
    | { type: GameActionEnum.SET_MOUSE_POSITION, payload: { mouseX: number; mouseY: number } }


const GameContext = createContext<GameContextType | undefined>(undefined)

const initialPuzzleState: PuzzleState = {
    targetString: [],
    currentString: []
}

const initialLevelState: LevelState = {
    rulesetID: "",
    rules: [],
    activeSymbolIndex: null,
    activeRuleIndex: null,
    invalidSymbolUseIndices: null,
    invalidRuleUseIndex: null,
    validRuleUseIndex: null,
    transformedSymbolIndices: null,
    interactionPaused: false,
    puzzleState: initialPuzzleState,
    timestamp: 0,
    previousAction: null,
    stepCount: 0,
    startTime: null,
    currentTime: null,
    remainingTime: null,
    continueCountdownTimeRemaining: null,
    goalAchieved: false,
    levelActive: false,
    levelEnded: false,
}

const initialGameState: GameState = {
    currentLevelIndex: 0,
    levelSchedule: [],
    currentLevelState: initialLevelState,
    undoHistory: [],
    abuseStrikes: 0,
    abuseWarningStack: [],
    gameCompleted: false,
    levelEventHistory: [],
    mouseX: 0,
    mouseY: 0
}




const gameReducer = (state: GameState, action: GameAction): GameState => {

    switch (action.type) {
        case GameActionEnum.START_TRIAL:
            let currentLevelSpec = state.levelSchedule[action.trialIndex]
            return { ...state, currentLevelIndex: action.trialIndex, currentLevelState: { ...initialLevelState, timestamp: action.timestamp, previousAction: GameEventHistoryEnum.START_TRIAL, rulesetID: state.levelSchedule[state.currentLevelIndex].rulesetID, rules: state.levelSchedule[state.currentLevelIndex].rules, puzzleState: { currentString: currentLevelSpec.startString, targetString: currentLevelSpec.targetString }, startTime: action.timestamp, currentTime: action.timestamp, levelActive: true } }
        case GameActionEnum.MARK_TRIAL_SOLVED:
            return { ...state, undoHistory: [], currentLevelState: { ...state.currentLevelState, timestamp: action.timestamp, previousAction: GameEventHistoryEnum.GOAL_ACHIEVED, levelActive: false, goalAchieved: true } }
        case GameActionEnum.END_TRIAL:
            return { ...state, undoHistory: [], currentLevelState: { ...state.currentLevelState, timestamp: action.timestamp, previousAction: GameEventHistoryEnum.END_TRIAL, levelActive: false, levelEnded: true, continueCountdownTimeRemaining: state.levelSchedule[state.currentLevelIndex].maxRestTime } }
        case GameActionEnum.COMPLETE_GAME:
            return { ...state, undoHistory: [], gameCompleted: true }
        case GameActionEnum.STORE_LEVEL_EVENT_RECORD:
            let newLevelEventHistory = [...state.levelEventHistory, action.payload]
            if (state.levelEventHistory.length > 0) {
                // Don't repeatedly store the same event history record
                const lastRecord = state.levelEventHistory[state.levelEventHistory.length - 1]
                if ((action.payload.previousAction == lastRecord.previousAction) && (action.payload.timestamp == lastRecord.timestamp)) {
                    newLevelEventHistory = state.levelEventHistory
                }
            }
            return { ...state, levelEventHistory: newLevelEventHistory }
        case GameActionEnum.SET_MOUSE_POSITION:
            return { ...state, mouseX: action.payload.mouseX, mouseY: action.payload.mouseY }
    }

    if (state.currentLevelState.levelActive) {
        if (!state.currentLevelState.interactionPaused) {
            switch (action.type) {
                case GameActionEnum.SELECT_RULE:
                    return { ...state, currentLevelState: { ...state.currentLevelState, timestamp: action.timestamp, previousAction: GameEventHistoryEnum.SELECT_RULE, activeRuleIndex: action.payload } };
                case GameActionEnum.SELECT_SYMBOL:
                    return { ...state, currentLevelState: { ...state.currentLevelState, timestamp: action.timestamp, previousAction: GameEventHistoryEnum.SELECT_SYMBOL, activeSymbolIndex: action.payload } };
                case GameActionEnum.DESELECT_RULE:
                    return { ...state, currentLevelState: { ...state.currentLevelState, timestamp: action.timestamp, previousAction: GameEventHistoryEnum.DESELECT_RULE, activeRuleIndex: null } };
                case GameActionEnum.DESELECT_SYMBOL:
                    return { ...state, currentLevelState: { ...state.currentLevelState, timestamp: action.timestamp, previousAction: GameEventHistoryEnum.DESELECT_SYMBOL, activeSymbolIndex: null } };
                case GameActionEnum.UNDO_TRANSFORMATION:
                    let revertedPuzzleState = state.currentLevelState.puzzleState
                    let newUndoHistory = state.undoHistory
                    if (state.undoHistory.length > 0) {
                        newUndoHistory = newUndoHistory.slice(0, -1)
                        revertedPuzzleState = state.undoHistory[state.undoHistory.length - 1]
                    }
                    return { ...state, undoHistory: newUndoHistory, currentLevelState: { ...state.currentLevelState, timestamp: action.timestamp, previousAction: GameEventHistoryEnum.UNDO_RULE_APPLICATION, activeRuleIndex: null, activeSymbolIndex: null, puzzleState: revertedPuzzleState } };
                case GameActionEnum.RESET_LEVEL:
                    let currentLevelSpec = state.levelSchedule[state.currentLevelIndex]
                    return { ...state, undoHistory: [], currentLevelState: { ...state.currentLevelState, timestamp: action.timestamp, previousAction: GameEventHistoryEnum.TRIAL_RESET, activeRuleIndex: null, activeSymbolIndex: null, puzzleState: { currentString: currentLevelSpec.startString, targetString: currentLevelSpec.targetString } } };
            }
        }
    }
    switch (action.type) {
        case GameActionEnum.TRANSFORMATION_SUCCESS:
            let transformedSymbolIndices = null
            let activeRuleIndex = state.currentLevelState.activeRuleIndex
            if (activeRuleIndex != null) {
                const ruleOutputLength = state.currentLevelState.rules[activeRuleIndex].output.length
                transformedSymbolIndices = Array.from({ length: ruleOutputLength }, (_, index) => state.currentLevelState.activeSymbolIndex! + index)
            }
            return { ...state, undoHistory: [...state.undoHistory, state.currentLevelState.puzzleState], currentLevelState: { ...state.currentLevelState, timestamp: action.timestamp, previousAction: GameEventHistoryEnum.SUCCESSFUL_RULE_APPLICATION, activeRuleIndex: null, activeSymbolIndex: null, transformedSymbolIndices: transformedSymbolIndices, validRuleUseIndex: state.currentLevelState.activeRuleIndex, puzzleState: action.payload, stepCount: state.currentLevelState.stepCount + 1 } }
        case GameActionEnum.TRANSFORMATION_FAIL:
            let mismatchedSymbolIndices = null
            if ((state.currentLevelState.activeRuleIndex != null) && (state.currentLevelState.activeSymbolIndex != null)) {
                const ruleInputLength = state.currentLevelState.rules[state.currentLevelState.activeRuleIndex].input.length
                mismatchedSymbolIndices = Array.from({ length: ruleInputLength }, (_, index) => state.currentLevelState.activeSymbolIndex! + index)
            }
            return { ...state, currentLevelState: { ...state.currentLevelState, timestamp: action.timestamp, previousAction: GameEventHistoryEnum.INVALID_RULE_APPLICATION, activeRuleIndex: null, activeSymbolIndex: null, invalidRuleUseIndex: state.currentLevelState.activeRuleIndex, invalidSymbolUseIndices: mismatchedSymbolIndices } }
        case GameActionEnum.PAUSE_INTERACTION_INVALID_RULE_APPLICATION:
            return { ...state, undoHistory: state.undoHistory, currentLevelState: { ...state.currentLevelState, interactionPaused: true } }
        case GameActionEnum.UNPAUSE_INTERACTION_INVALID_RULE_APPLICATION:
            return { ...state, undoHistory: state.undoHistory, currentLevelState: { ...state.currentLevelState, invalidRuleUseIndex: null, invalidSymbolUseIndices: null, interactionPaused: false } }
        case GameActionEnum.PAUSE_INTERACTION_VALID_RULE_APPLICATION:
            return { ...state, undoHistory: state.undoHistory, currentLevelState: { ...state.currentLevelState, interactionPaused: true } }
        case GameActionEnum.UNPAUSE_INTERACTION_VALID_RULE_APPLICATION:
            return { ...state, undoHistory: state.undoHistory, currentLevelState: { ...state.currentLevelState, transformedSymbolIndices: null, validRuleUseIndex: null, interactionPaused: false } }
        case GameActionEnum.SET_LEVEL_TIME:
            let currentLevelSpec = state.levelSchedule[state.currentLevelIndex]
            let timeRemaining = currentLevelSpec.maxSolveTime
            if (currentLevelSpec.maxSolveTime != null) {
                if (state.currentLevelState.startTime != null) {
                    timeRemaining = currentLevelSpec.maxSolveTime - (action.timestamp - state.currentLevelState.startTime) / 1000
                }
            }
            return { ...state, undoHistory: state.undoHistory, currentLevelState: { ...state.currentLevelState, currentTime: action.timestamp, remainingTime: timeRemaining } }
        case GameActionEnum.DECREMENT_REST_TIME_REMAINING:
            return { ...state, undoHistory: state.undoHistory, currentLevelState: { ...state.currentLevelState, continueCountdownTimeRemaining: state.currentLevelState.continueCountdownTimeRemaining ? state.currentLevelState.continueCountdownTimeRemaining - 1 : state.currentLevelState.continueCountdownTimeRemaining } }
        case GameActionEnum.WARN_STRIKE_REST_TIME:
            let newWarningStack = state.abuseWarningStack.concat([AbuseWarningEnum.EXCESS_REST_TIME])
            console.log(newWarningStack)
            return { ...state, undoHistory: state.undoHistory, abuseStrikes: state.abuseStrikes + 1, abuseWarningStack: newWarningStack, currentLevelState: { ...state.currentLevelState } }
        case GameActionEnum.DEQUEUE_WARNING:
            let remainingWarningStack = state.abuseWarningStack
            if (remainingWarningStack.length > 0) {
                remainingWarningStack = remainingWarningStack.slice(1, -1)
            }
            return { ...state, undoHistory: state.undoHistory, abuseStrikes: state.abuseStrikes + 1, abuseWarningStack: remainingWarningStack, currentLevelState: { ...state.currentLevelState } }
    }

    return state
};



export const GameContextProvider: React.FC<{ children: ReactNode, levelSchedule: LevelSpec[], startLevelIndex: number }> = ({ children, levelSchedule, startLevelIndex }) => {

    const [state, dispatch] = useReducer(gameReducer, { ...initialGameState, levelSchedule: levelSchedule, currentLevelIndex: startLevelIndex, currentLevelState: { ...initialLevelState } })

    // Append the relevant parts  of the current levelState to the levelEventHistory array.
    // (We don't need to record every aspect of level state history for export and analysis.)
    const storeLevelEventHistory = () => {
        const newRecord: LevelEventRecord = {
            levelNumber: state.currentLevelIndex,
            rulesetID: state.currentLevelState.rulesetID,
            isPractice: state.levelSchedule[state.currentLevelIndex].isPractice,
            isTutorial: state.levelSchedule[state.currentLevelIndex].isTutorial,
            activeSymbolIndex: state.currentLevelState.activeSymbolIndex,
            activeRuleIndex: state.currentLevelState.activeRuleIndex,
            targetString: state.currentLevelState.puzzleState.targetString.map((s) => { return s.id }).join(""),
            currentString: state.currentLevelState.puzzleState.currentString.map((s) => { return s.id }).join(""),
            timestamp: state.currentLevelState.timestamp,
            mouseX: state.mouseX,
            mouseY: state.mouseY,
            previousAction: state.currentLevelState.previousAction,
            stepCount: state.currentLevelState.stepCount
        }
        dispatch({ type: GameActionEnum.STORE_LEVEL_EVENT_RECORD, payload: newRecord })
    }

    const setMousePosition = (mouseX: number, mouseY: number) => {
        dispatch({ type: GameActionEnum.SET_MOUSE_POSITION, payload: { mouseX: mouseX, mouseY: mouseY } })
    }

    // Attempt to transform the state string using the current rule in the current position
    const tryTransformString = () => {
        storeLevelEventHistory()
        let levelState = state.currentLevelState
        if (levelState.activeRuleIndex !== null && levelState.activeSymbolIndex !== null) {
            let transformationRule = levelState.rules[levelState.activeRuleIndex]
            let result = transformationRule.apply(levelState.puzzleState.currentString, levelState.activeSymbolIndex)
            if (result !== null) {
                dispatch({ type: GameActionEnum.TRANSFORMATION_SUCCESS, timestamp: performance.now(), payload: { targetString: levelState.puzzleState.targetString, currentString: result } })
            } else {
                dispatch({ type: GameActionEnum.TRANSFORMATION_FAIL, timestamp: performance.now() })
            }
        }
    }

    const handleActiveSymbolIndexChange = (newIndex: number) => {
        storeLevelEventHistory()
        if (state.currentLevelState.activeSymbolIndex == newIndex) {
            dispatch({ type: GameActionEnum.DESELECT_SYMBOL, timestamp: performance.now() })
        } else {
            dispatch({ type: GameActionEnum.SELECT_SYMBOL, timestamp: performance.now(), payload: newIndex })
        }
    }

    const handleActiveRuleIndexChange = (newIndex: number) => {
        storeLevelEventHistory()
        if (state.currentLevelState.activeRuleIndex == newIndex) {
            dispatch({ type: GameActionEnum.DESELECT_RULE, timestamp: performance.now() })
        } else {
            dispatch({ type: GameActionEnum.SELECT_RULE, timestamp: performance.now(), payload: newIndex })
        }
    }

    const handleTransformationSuccess = (newPuzzleState: PuzzleState) => {
        storeLevelEventHistory()
        dispatch({ type: GameActionEnum.TRANSFORMATION_SUCCESS, timestamp: performance.now(), payload: newPuzzleState })
    }

    const handleTransformationFail = () => {
        storeLevelEventHistory()
        dispatch({ type: GameActionEnum.TRANSFORMATION_FAIL, timestamp: performance.now() })
    }

    const handleUndoTransformation = () => {
        storeLevelEventHistory()
        dispatch({ type: GameActionEnum.UNDO_TRANSFORMATION, timestamp: performance.now() })
    }

    const handleResetLevel = () => {
        storeLevelEventHistory()
        dispatch({ type: GameActionEnum.RESET_LEVEL, timestamp: performance.now() })
    }

    const exportLevelEventHistory = () => {
        storeLevelEventHistory()
        return state.levelEventHistory
    }

    const pauseInteractionInvalidRuleUse = () => {
        dispatch({ type: GameActionEnum.PAUSE_INTERACTION_INVALID_RULE_APPLICATION, timestamp: performance.now() })
    }

    const unpauseInteractionInvalidRuleUse = () => {
        dispatch({ type: GameActionEnum.UNPAUSE_INTERACTION_INVALID_RULE_APPLICATION, timestamp: performance.now() })
    }

    const pauseInteractionValidRuleUse = () => {
        dispatch({ type: GameActionEnum.PAUSE_INTERACTION_VALID_RULE_APPLICATION, timestamp: performance.now() })
    }

    const unpauseInteractionValidRuleUse = () => {
        dispatch({ type: GameActionEnum.UNPAUSE_INTERACTION_VALID_RULE_APPLICATION, timestamp: performance.now() })
    }

    const startLevel = (levelIndex: number) => {
        storeLevelEventHistory()
        dispatch({ type: GameActionEnum.START_TRIAL, timestamp: performance.now(), trialIndex: levelIndex })
    }

    const markTrialSolved = () => {
        storeLevelEventHistory()
        dispatch({ type: GameActionEnum.MARK_TRIAL_SOLVED, timestamp: performance.now() })
    }

    const endLevel = () => {
        storeLevelEventHistory()
        dispatch({ type: GameActionEnum.END_TRIAL, timestamp: performance.now() })
    }

    const getAbuseWarning = () => {
        if (state.abuseWarningStack.length > 0) {
            let warningType = state.abuseWarningStack[0]
            dispatch({ type: GameActionEnum.DEQUEUE_WARNING })
            return warningType
        }
        return null
    }

    const nextLevel = () => {
        storeLevelEventHistory()
        if (state.currentLevelIndex < state.levelSchedule.length - 1) {
            let nextIndex = state.currentLevelIndex + 1
            dispatch({ type: GameActionEnum.START_TRIAL, timestamp: performance.now(), trialIndex: nextIndex })
            return nextIndex
        }
        else {
            dispatch({ type: GameActionEnum.COMPLETE_GAME })
            return null
        }
    }

    // Trigger the start level event once on load
    useEffect(() => {
        startLevel(startLevelIndex)
    }, []);

    // When the currentTime changes, schedule a subsequent update to currentTime to execute if there is time remaining
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!state.currentLevelState.goalAchieved) {
                let currentTimestamp = state.currentLevelState.currentTime
                let startTimestamp = state.currentLevelState.startTime
                if ((currentTimestamp != null) && (startTimestamp != null)) {
                    const timeElapsedSeconds = (currentTimestamp - startTimestamp) / 1000
                    const maxSolveTime = state.levelSchedule[state.currentLevelIndex].maxSolveTime
                    if (maxSolveTime !== null) {
                        if (timeElapsedSeconds < maxSolveTime) {
                            dispatch({ type: GameActionEnum.SET_LEVEL_TIME, timestamp: performance.now() })
                        }
                    }else{
                        dispatch({ type: GameActionEnum.SET_LEVEL_TIME, timestamp: performance.now() })
                    }
                }
            }
        }, 5);
        return () => clearTimeout(timeoutId);
    }, [state.currentLevelState.currentTime]);


    // When the click to continue countdown time changes, schedule its next change one second later.
    // Dispatch a warning and start the next level is the timer runs out
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (state.currentLevelState.continueCountdownTimeRemaining != null) {
                if (state.currentLevelState.continueCountdownTimeRemaining > 0) {
                    dispatch({ type: GameActionEnum.DECREMENT_REST_TIME_REMAINING })
                } else {
                    dispatch({ type: GameActionEnum.WARN_STRIKE_REST_TIME })
                    nextLevel()
                }
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [state.currentLevelState.continueCountdownTimeRemaining]);


    // When the list of abuse warnings to trigger changes, trigger the relevant warning type
    useEffect(() => {
        let warningType = getAbuseWarning()
        if (warningType != null) {
            alert(warningType)
        }
    }, [state.abuseWarningStack]);


    // When the active rule or state symbol changes, try to apply the active rule in the active symbol position.
    useEffect(() => {
        tryTransformString();
    }, [state.currentLevelState.activeSymbolIndex, state.currentLevelState.activeRuleIndex]);


    // When the invalid rule use index changes to a non-null value, pause user interaction.
    useEffect(() => {
        if (state.currentLevelState.invalidRuleUseIndex != null) {
            pauseInteractionInvalidRuleUse()
        }
    }, [state.currentLevelState.invalidRuleUseIndex])


    // When the transformed symbol indices change to a non-null value, pause user interaction.
    // (This is when a rule has just been successfully applied)
    useEffect(() => {
        if (state.currentLevelState.validRuleUseIndex != null) {
            pauseInteractionValidRuleUse()
        }
    }, [state.currentLevelState.validRuleUseIndex])


    // When interaction becomes paused due to invalid rule use, trigger an unpause event after a delay.
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (state.currentLevelState.interactionPaused && state.currentLevelState.invalidRuleUseIndex != null) {
                unpauseInteractionInvalidRuleUse()
            }
        }, 500);
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [state.currentLevelState.interactionPaused]);


    // When interaction becomes paused after a successful rule use, trigger an unpause event after a delay.
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (state.currentLevelState.interactionPaused && state.currentLevelState.transformedSymbolIndices != null) {
                unpauseInteractionValidRuleUse()
            }
        }, state.currentLevelState.transformedSymbolIndices ? state.currentLevelState.transformedSymbolIndices.length * 30 + 200 : 200);
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [state.currentLevelState.interactionPaused]);


    // When the puzzle state changes, if it matches the target string then mark the trial as solved
    useEffect(() => {
        if (state.currentLevelState.levelActive) {
            if (symbolStringsMatch(state.currentLevelState.puzzleState.currentString, state.currentLevelState.puzzleState.targetString)) {
                markTrialSolved()
            }
        }
    }, [state.currentLevelState.puzzleState])


    // When the trial has been marked as solved, end the level
    useEffect(() => {
        if (state.currentLevelState.goalAchieved) {
            endLevel()
        }
    }, [state.currentLevelState.goalAchieved])


    // When the remaining time in the trial runs out, end the level
    useEffect(() => {
        if (state.currentLevelState.remainingTime != null) {
            if (state.currentLevelState.remainingTime <= 0) {
                endLevel()
            }
        }
    }, [state.currentLevelState.remainingTime])


    // Add a mouse move listener to update the mouse position
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition(event.clientX, event.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);



    return (
        <GameContext.Provider value={{
            state,
            storeLevelEventHistory,
            handleActiveSymbolIndexChange,
            handleActiveRuleIndexChange,
            handleTransformationSuccess,
            handleTransformationFail,
            handleUndoTransformation,
            handleResetLevel,
            getAbuseWarning,
            exportLevelEventHistory,
            nextLevel,
            startLevel,
            endLevel
        }}>
            {children}
        </GameContext.Provider>
    );

}

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameContext');
    }
    return context;
};
