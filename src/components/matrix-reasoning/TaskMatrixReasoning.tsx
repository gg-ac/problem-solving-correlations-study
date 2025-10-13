"use client"

import FixationCross from "../common/FixationCross";
import FeedbackIconCorrect from "../common/FeedbackIconCorrect";
import FeedbackIconIncorrect from "../common/FeedbackIconIncorrect";
import { useTaskContextMatrixReasoning } from "./TaskContextMatrixReasoning";
import TaskMatrixReasoningInstructions from "./TaskMatrixReasoningInstructions";
import { generateSolutionIndexOrder } from "./utils";
import { useEffect } from "react";
import { saveToDownloadsFolder } from "../io/DataStorage";
import { usePageContext } from "@/context/PageContext";



export default function TaskMatrixReasoning() {

    const { state, handleSolutionPressed, exportTrialEventHistory } = useTaskContextMatrixReasoning();
    const { taskData, setTaskData } = usePageContext();


    useEffect(() => {
        if(state.blockCompleted){
        const taskEventData = exportTrialEventHistory()
        setTaskData([...taskData, {taskName:"matrix-reasoning", data:taskEventData}])
        }
    }, [state.blockCompleted]);

    return (
        <div className="h-full grid grid-rows-8">
            <div className="row-span-1"></div>

            <div className="row-span-6 flex items-center justify-center">
                {state.blockStarted ? <></> : <TaskMatrixReasoningInstructions></TaskMatrixReasoningInstructions>}

                {state.fixationActive && state.blockStarted ? <div className="flex items-center justify-center"> <FixationCross></FixationCross> </div> : <></>}

                {state.trialState.trialStarted && !state.trialState.trialEnded ?
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-3xl">{Math.ceil(((state.trialMaxDuration * 1000) - (state.trialState.currentTime - state.trialState.startTime)) / 1000)}</span>
                        <div className="flex items-center justify-center">
                            <img className="py-5" src={`/problem-solving-correlations-study/images/matrix-tasks/test/${state.currentTrialIndex}.jpeg`}></img>
                        </div>
                        <div className="flex">
                            {generateSolutionIndexOrder(4, state.currentTrialIndex.toString()).map((i: number, idx: number) => <img key={idx} onClick={() => { handleSolutionPressed(i) }} className={"mx-5 " + (state.trialState.feedbackStarted && i == 0 ? " border-8 border-lime-500" : "")} src={`/images/matrix-tasks/test/${state.currentTrialIndex}_${i + 1}.jpeg`}></img>)}
                        </div>
                    </div>
                    : <></>}

                {state.trialState.feedbackStarted && !state.trialState.feedbackEnded ?
                    <div className="flex items-center justify-center">{state.trialState.responseCorrect ? <FeedbackIconCorrect></FeedbackIconCorrect> : <FeedbackIconIncorrect></FeedbackIconIncorrect>}</div> :
                    <></>
                }
            </div>
        </div>
    );
}
