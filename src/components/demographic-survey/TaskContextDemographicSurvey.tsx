import React, { createContext, useContext, useState, ReactNode, useReducer, useEffect } from 'react';


interface TaskState {
    participantID: string | null
    biologicalSex: "male" | "female" | null
    age: number | null
    handedness: "left" | "right" | "ambidextrous" | null
    surveyCompleted: boolean
}


interface TaskContextType {
    state: TaskState
    setParticipantID: (participantID:string) => void,
    setBiologicalSex: (biologicalSex: "male" | "female" | null) => void,
    setAge: (age:number) => void,
    setHandedness: (handedness:"left" | "right" | "ambidextrous" | null) => void,
    setSurveyCompleted: (surveyCompleted: boolean) => void
}


export enum TaskActionEnum {
    SET_PARTICIPANT_ID = "SET_PARTICIPANT_ID",
    SET_BIOLOGICAL_SEX = "SET_BIOLOGICAL_SEX",
    SET_AGE = "SET_AGE",
    SET_HANDEDNESS = "SET_HANDEDNESS",
    SET_SURVEY_COMPLETED = "SET_SURVEY_COMPLETED",
}


type TaskAction =
    { type: TaskActionEnum.SET_PARTICIPANT_ID, participantID: string | null }
    | { type: TaskActionEnum.SET_BIOLOGICAL_SEX, biologicalSex: "male" | "female" | null }
    | { type: TaskActionEnum.SET_AGE, age: number | null }
    | { type: TaskActionEnum.SET_HANDEDNESS, handedness: "left" | "right" | "ambidextrous" | null }
    | { type: TaskActionEnum.SET_SURVEY_COMPLETED, surveyCompleted: boolean }


const TaskContext = createContext<TaskContextType | undefined>(undefined)


const initialTaskState: TaskState = {
    participantID: null,
    biologicalSex: null,
    age: null,
    handedness: null,
    surveyCompleted:false
}


const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
    let newState = state
    switch (action.type) {
        case TaskActionEnum.SET_PARTICIPANT_ID:
            newState = { ...state, participantID: action.participantID }
            break
        case TaskActionEnum.SET_BIOLOGICAL_SEX:
            newState = { ...state, biologicalSex: action.biologicalSex }
            break
        case TaskActionEnum.SET_AGE:
            newState = { ...state, age: action.age }
            break
        case TaskActionEnum.SET_HANDEDNESS:
            newState = { ...state, handedness: action.handedness }
            break
        case TaskActionEnum.SET_SURVEY_COMPLETED:
            newState = { ...state, surveyCompleted: action.surveyCompleted }
            break
    }
    return newState
}


export const TaskContextProviderDemographicSurvey: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [state, dispatch] = useReducer(taskReducer, { ...initialTaskState })

     const setParticipantID = (participantID:string) => {
            dispatch({ type: TaskActionEnum.SET_PARTICIPANT_ID, participantID:participantID })
        }
        const setBiologicalSex= (biologicalSex: "male" | "female" | null) => {
            dispatch({ type: TaskActionEnum.SET_BIOLOGICAL_SEX, biologicalSex:biologicalSex })
        }
     const setAge = (age:number) => {
            dispatch({ type: TaskActionEnum.SET_AGE, age:age })
        }
     const setHandedness = (handedness:"left" | "right" | "ambidextrous" | null) => {
            dispatch({ type: TaskActionEnum.SET_HANDEDNESS, handedness:handedness })
        }
     const setSurveyCompleted = (surveyCompleted:boolean) => {
            dispatch({ type: TaskActionEnum.SET_SURVEY_COMPLETED, surveyCompleted:surveyCompleted })
        }

    return (
        <TaskContext.Provider value={{
            state,
            setParticipantID,
            setBiologicalSex,
            setAge,
            setHandedness,
            setSurveyCompleted
        }}>
            {children}
        </TaskContext.Provider>
    );

}

export const useTaskContextDemographicSurvey = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContextDemographicSurvey must be used within a TaskContext Provider');
    }
    return context;
};