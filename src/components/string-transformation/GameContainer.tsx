"use client"
import { usePageContext } from "@/context/PageContext";
import DecoderLevel from "./DecoderLevel";
import DecoderLevelFeedback from "./DecoderLevelFeedback";
import { useGameContext } from "./GameContext";

const GameContainer: React.FC = () => {
    const { state } = useGameContext();

    const { taskData, addTaskData } = usePageContext();

    return (
        <div className="h-full">
            {
                !state.currentLevelState.levelEnded ? <DecoderLevel levelIndex={state.currentLevelIndex} /> : <DecoderLevelFeedback trialNumber={state.currentLevelIndex}
                levelID={state.currentLevelIndex.toString()} 
                hasQuestions={!state.levelSchedule[state.currentLevelIndex].isPractice} 
                onSubmit={(d) => {addTaskData({taskName:"puzzleFeedbackData", data:[d]})}} />
            }
        </div>
    );
}

export default GameContainer