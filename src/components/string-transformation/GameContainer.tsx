"use client"
import { usePageContext } from "@/context/PageContext";
import { saveToDownloadsFolder } from "../io/DataStorage";
import DecoderLevel from "./DecoderLevel";
import DecoderLevelFeedback from "./DecoderLevelFeedback";
import { useGameContext } from "./GameContext";
import { useEffect } from "react";

const GameContainer: React.FC = () => {
    const { state, exportLevelEventHistory } = useGameContext();
    const { taskData, setTaskData } = usePageContext();


    useEffect(() => {
        if(state.gameCompleted){
        const taskEventData = exportLevelEventHistory()
        setTaskData([...taskData, {taskName:"visual-search", data:taskEventData}])
        }
    }, [state.gameCompleted]);

    return (
        <div className="h-full">
            {
                !state.currentLevelState.levelEnded ? <DecoderLevel levelIndex={state.currentLevelIndex} /> : <DecoderLevelFeedback levelIndex={state.currentLevelIndex} />
            }
        </div>
    );
}

export default GameContainer