import { useGameContext } from "./GameContext";
import { Source_Code_Pro } from 'next/font/google'
import IconTick from './ui/icon_tick.svg'
import IconCross from './ui/icon_cross.svg'

interface DecoderLevelProps {
  levelIndex: number
}

const scp = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  weight: "400"
})


const DecoderLevelFeedback: React.FC<DecoderLevelProps> = () => {

  const { state, nextLevel } = useGameContext();

  const solveTime = (state.currentLevelState.currentTime !== null) && (state.currentLevelState.startTime !== null) ? Math.round((state.currentLevelState.currentTime - state.currentLevelState.startTime) / 1000) : 0

  return (
    <div className="flex flex-col justify-center items-center h-full bg-linear-to-t from-stone-400 to-stone-300 dark:from-gray-900 dark:to-slate-900 font-(family-name:--font-geist-sans)">
      <div className=" text-gray-800 dark:text-gray-200 flex flex-col justify-center items-center grow p-4 m-4 space-y-20 min-w-[500px] border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 shadow-lg dark:shadow-inset-game-panel rounded-2xl overflow-y-auto">
        {state.currentLevelState.goalAchieved ? <IconTick></IconTick> : <IconCross></IconCross>}
        <span className="text-2xl">Level {state.currentLevelState.goalAchieved ? ` Completed in ${solveTime}s` : "Failed"}</span>
        <button onClick={() => { nextLevel() }} className={`bg-transparent hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold hover:text-white py-2 px-4 border-2 border-gray-500 hover:border-transparent rounded ${scp.className}`}>
          Press to Continue {` (${state.currentLevelState.continueCountdownTimeRemaining})`}
        </button>
      </div>
    </div>
  );
};

export default DecoderLevelFeedback;