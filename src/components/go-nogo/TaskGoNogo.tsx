"use client"

import SignalGo from "@/components/go-nogo/SignalGo";
import { useTaskContextGoNogo } from "@/components/go-nogo/TaskContextGoNogo";
import FeedbackIconIncorrect from "../common/FeedbackIconIncorrect";
import SignalNogo from "./SignalNogo";
import TaskGoNogoInstructions from "./TaskGoNogoInstructions";
import FixationCross from "../common/FixationCross";
import { useEffect } from "react";
import { usePageContext } from "@/context/PageContext";


export default function TaskGoNogo() {

    const { state, exportTrialEventHistory } = useTaskContextGoNogo();
    const { taskData, setTaskData } = usePageContext();


    useEffect(() => {
        if(state.blockCompleted){
        const taskEventData = exportTrialEventHistory()
        setTaskData([...taskData, {taskName:"go-nogo", data:taskEventData}])
        }
    }, [state.blockCompleted]);
    

    return (
        <div className="h-full flex flex-col justify-center items-center">

            {state.blockStarted ? <></> : <TaskGoNogoInstructions></TaskGoNogoInstructions>}

            {/* {state.trialEventHistory.map(val => val.action)} */}
            <div className="flex items-center justify-center">
                {state.fixationActive && state.blockStarted ? <FixationCross></FixationCross> : <></>}

                {state.trialState.trialStarted && !state.trialState.trialEnded ?
                    state.trialSpecs[state.currentTrialIndex].isGoTrial ? <SignalGo></SignalGo> : <SignalNogo></SignalNogo>
                    :
                    <></>
                }

                {state.trialState.feedbackStarted && !state.trialState.feedbackEnded ?
                    <div className="flex items-center justify-center">{state.trialState.responseCorrect ? <></> : <FeedbackIconIncorrect></FeedbackIconIncorrect>}</div> :
                    <></>
                }
            </div>
        </div>
    );
}
