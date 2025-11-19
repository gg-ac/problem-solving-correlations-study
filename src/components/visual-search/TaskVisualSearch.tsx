"use client"

import StimulusDistractor from "./StimulusDistractor";
import StimulusTarget from "./StimulusTarget";
import StimulusPlaceholder from "./StimulusPlaceholder";
import { useTaskContextVisualSearch } from "./TaskContextVisualSearch";
import FixationCross from "../common/FixationCross";
import FeedbackIconCorrect from "../common/FeedbackIconCorrect";
import FeedbackIconIncorrect from "../common/FeedbackIconIncorrect";
import KeyboardIcon from "../common/KeyboardIcon";
import { useEffect } from "react";
import { usePageContext } from "@/context/PageContext";
import { TaskVisualSearchInstructions } from "./TaskVisualSearchInstructions";



export const TaskVisualSearch: React.FC<{ isPractice:boolean }> = ({ isPractice }) => {

    const { state, exportTrialEventHistory } = useTaskContextVisualSearch();
    const { taskData, addTaskData } = usePageContext();

    useEffect(() => {
        if(state.blockCompleted && !isPractice){
        const taskEventData = exportTrialEventHistory()
        addTaskData({taskName:"visual-search", data:taskEventData})
        }
    }, [state.blockCompleted]);


    return (
        <div className="h-full grid grid-rows-8">
            <div className="row-span-1"></div>
            <div className="row-span-6 flex items-center justify-center">
                {state.blockStarted ? <></> : <TaskVisualSearchInstructions isPractice={isPractice}></TaskVisualSearchInstructions>}

                {state.fixationActive && state.blockStarted ? <div className="flex items-center justify-center"> <FixationCross></FixationCross> </div>: <></>}

                {state.trialState.trialStarted && !state.trialState.trialEnded ?
                    <div className="h-[256px] w-[256px] aspect-square grid grid-rows-5 grid-cols-5">
                        {state.trialSpecs[state.currentTrialIndex].gridContents.map((val, index) => val == 2 ? <StimulusTarget key={index}></StimulusTarget> : val == 5 ? <StimulusDistractor key={index}></StimulusDistractor> : <StimulusPlaceholder key={index}></StimulusPlaceholder>)}
                    </div>
                    :
                    <></>
                }

                {state.trialState.feedbackStarted && !state.trialState.feedbackEnded ?
                    <div className="flex items-center justify-center">{state.trialState.responseCorrect ? <FeedbackIconCorrect></FeedbackIconCorrect> : <FeedbackIconIncorrect></FeedbackIconIncorrect>}</div> :
                    <></>
                }
            </div>

            {state.blockStarted ?
             <div className="row-span-1 grid grid-cols-2 justify-items-center">
                    <div className="flex items-center text-xl"><KeyboardIcon>F</KeyboardIcon> = NO</div>
                    <div className="flex items-center text-xl"><KeyboardIcon>J</KeyboardIcon> = YES</div>
                </div>
                :
                <></>
            }
            {/* <div className="h-[256px] w-[256px] aspect-square grid grid-rows-5 grid-cols-5">
                {generateStimulusArray(10, 0, 25, "a").map((val, index) => val == 2 ? <StimulusTarget key={index}></StimulusTarget> : val == 5 ? <StimulusDistractor key={index}></StimulusDistractor> : <StimulusPlaceholder key={index}></StimulusPlaceholder>)}
            </div> */}
        </div>
    );
}
