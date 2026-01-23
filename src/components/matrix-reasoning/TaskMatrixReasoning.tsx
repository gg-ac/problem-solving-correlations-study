"use client"

import FixationCross from "../common/FixationCross";
import FeedbackIconCorrect from "../common/FeedbackIconCorrect";
import FeedbackIconIncorrect from "../common/FeedbackIconIncorrect";
import { useTaskContextMatrixReasoning } from "./TaskContextMatrixReasoning";
import { generateSolutionIndexOrder } from "./utils";
import { useEffect } from "react";
import { saveToDownloadsFolder } from "../io/DataStorage";
import { usePageContext } from "@/context/PageContext";
import { TaskMatrixReasoningInstructions } from "./TaskMatrixReasoningInstructions";



export const TaskMatrixReasoning: React.FC<{ isPractice:boolean }> = ({ isPractice }) => {

    const { state, handleSolutionPressed, exportTrialEventHistory } = useTaskContextMatrixReasoning();
    const { taskData, addTaskData } = usePageContext();


    useEffect(() => {
        if(state.blockCompleted && !isPractice){
        const taskEventData = exportTrialEventHistory()
        addTaskData({taskName:"matrix-reasoning", data:taskEventData})
        }
    }, [state.blockCompleted]);


    let imagePath = "/images/matrix-tasks/test/"
    if (isPractice) {
        imagePath = "/images/matrix-tasks/practice/"
    }

    return (
        <div className="h-full grid grid-rows-8">
            <div className="row-span-1"></div>

            <div className="row-span-6 flex items-center justify-center">
                {state.blockStarted ? <></> : <TaskMatrixReasoningInstructions isPractice={isPractice}></TaskMatrixReasoningInstructions>}

                {state.fixationActive && state.blockStarted ? <div className="flex items-center justify-center"> <FixationCross></FixationCross> </div> : <></>}

                {(state.trialState.trialStarted && !state.trialState.trialEnded) || (state.trialState.trialEnded && isPractice) ?
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-3xl">{!state.trialState.feedbackStarted ? Math.ceil(((state.trialMaxDuration * 1000) - (state.trialState.currentTime - state.trialState.startTime)) / 1000) : ""}</span>
                        <div className="flex items-center justify-center">
                            <img className="py-5" src={imagePath + `${state.currentTrialIndex}.jpeg`}></img>
                        </div>
                        <div className="flex">
                            {generateSolutionIndexOrder(4, state.currentTrialIndex.toString()).map((i: number, idx: number) => (<div>
                                <img key={idx} onClick={() => { handleSolutionPressed(i) }} className={"mx-5 " + (state.trialState.feedbackStarted && i == 0 ? " m-5 border-8 border-lime-500" : state.trialState.feedbackStarted ? " m-5 border-8 border-red-500" : "")} src={imagePath+`${state.currentTrialIndex}_${i + 1}.jpeg`}></img>
                                {(state.trialState.feedbackStarted && i == 0) && <FeedbackIconCorrect></FeedbackIconCorrect> }
                                {(state.trialState.feedbackStarted && i != 0) && <FeedbackIconIncorrect></FeedbackIconIncorrect>}
                                </div>))}
                        </div>
                    </div>
                    : <></>}

                {(state.trialState.feedbackStarted && !state.trialState.feedbackEnded && !isPractice) ?
                    <div className="flex items-center justify-center">{state.trialState.responseCorrect ? <FeedbackIconCorrect></FeedbackIconCorrect> : <FeedbackIconIncorrect></FeedbackIconIncorrect>}</div> :
                    <></>
                }
            </div>
        </div>
    );
}
