"use client"
import DecoderLevel from "./DecoderLevel";
import DecoderLevelFeedback from "./DecoderLevelFeedback";
import { useGameContext } from "./GameContext";

const GameContainer: React.FC = () => {
    const { state } = useGameContext();

    return (
        <div className="h-full">
            {
                !state.currentLevelState.levelEnded ? <DecoderLevel levelIndex={state.currentLevelIndex} /> : <DecoderLevelFeedback levelIndex={state.currentLevelIndex} />
            }
        </div>
    );
}

export default GameContainer