"use client"

import SignalGo from "@/components/go-nogo/SignalGo";
import { useTaskContextGoNogo } from "@/components/go-nogo/TaskContextGoNogo";
import FeedbackIconIncorrect from "../common/FeedbackIconIncorrect";
import SignalNogo from "./SignalNogo";
import FixationCross from "../common/FixationCross";
import { useEffect } from "react";
import { usePageContext } from "@/context/PageContext";
import { TaskGoNogoInstructions } from "./TaskGoNogoInstructions";


export const TaskGoNogo: React.FC<{ isPractice:boolean }> = ({ isPractice }) => {

    const { state, exportTrialEventHistory } = useTaskContextGoNogo();
    const { taskData, addTaskData } = usePageContext();


    useEffect(() => {
        if(state.blockCompleted && !isPractice){
        const taskEventData = exportTrialEventHistory()
        addTaskData({taskName:"go-nogo", data:taskEventData})
        }
    }, [state.blockCompleted]);
    

    return (
        <div className="h-full flex flex-col justify-center items-center">

            {state.blockStarted ? <></> : <TaskGoNogoInstructions isPractice={isPractice}></TaskGoNogoInstructions>}

            {/* {state.trialEventHistory.map(val => val.action)} */}
            <div className="flex items-center justify-center">
                {state.fixationActive && state.blockStarted ? <FixationCross></FixationCross> : <></>}

                {state.trialState.trialStarted && !state.trialState.trialEnded ?
                    state.trialSpecs[state.currentTrialIndex].isGoTrial ? <SignalGo></SignalGo> : <SignalNogo></SignalNogo>
                    :
                    <></>
                }

                {state.trialState.feedbackStarted && !state.trialState.feedbackEnded && !isPractice ?
                    <div className="flex items-center justify-center">{state.trialState.responseCorrect ? <></> : <FeedbackIconIncorrect></FeedbackIconIncorrect>}</div> :
                    <></>
                }
                {state.trialState.feedbackStarted && !state.trialState.feedbackEnded && isPractice ?
                    <div className="flex items-center justify-center">{state.trialState.responseCorrect ? <></> : state.trialSpecs[state.currentTrialIndex].isGoTrial ? <div><FeedbackIconIncorrect></FeedbackIconIncorrect> <span>(Should have pressed Space)</span> </div> : <div><FeedbackIconIncorrect></FeedbackIconIncorrect> <span>(Should NOT have pressed Space)</span> </div>}</div> :
                    <></>
                }
            </div>
        </div>
    );
}
