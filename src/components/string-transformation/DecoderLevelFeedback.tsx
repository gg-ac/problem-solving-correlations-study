import { useGameContext } from "./GameContext";
import { Source_Code_Pro } from 'next/font/google'
import IconTick from './ui/icon_tick.svg'
import IconCross from './ui/icon_cross.svg'
import { PuzzleFeedback, PuzzleFeedbackPanel } from "./likert/PuzzleFeedbackPanel";

interface DecoderLevelProps {
  trialNumber:number
  levelID:string
  hasQuestions:boolean
  onSubmit: (data: PuzzleFeedback) => void;
}

const scp = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  weight: "400"
})


const DecoderLevelFeedback: React.FC<DecoderLevelProps> = ({trialNumber, levelID, hasQuestions, onSubmit}) => {

  const { state, nextLevel } = useGameContext();

  const solveTime = (state.currentLevelState.currentTime !== null) && (state.currentLevelState.startTime !== null) ? Math.round((state.currentLevelState.currentTime - state.currentLevelState.startTime) / 1000) : 0

  return (
<div className="flex flex-col min-h-screen max-h-screen p-4 bg-gradient-to-t from-stone-400 to-stone-300 dark:from-gray-900 dark:to-slate-900 font-[family-name:var(--font-geist-sans)] overflow-hidden">
  
  <div className="w-full h-full flex-grow max-w-[480px] mx-auto p-1 sm:p-5  bg-stone-200 dark:bg-slate-800 shadow-inset-game-panel-background border-2 border-stone-500 dark:border-slate-700 dark:text-gray-200 rounded-2xl overflow-y-scroll">
    
    <div className="flex flex-col items-center">
        <div className="max-w-40 flex items-center justify-center mb-10 mt-5">{state.currentLevelState.goalAchieved ? <IconTick></IconTick> : <IconCross></IconCross>}</div>
        <span className="text-2xl mb-5">{state.currentLevelState.goalAchieved ? "Level Solved" : "Level Failed"}</span>
        
        {hasQuestions 
        ? 
        <PuzzleFeedbackPanel trialNumber={trialNumber} puzzleId={levelID} onSubmit={(d) => {onSubmit(d); nextLevel()}}></PuzzleFeedbackPanel>
        : 
        <button onClick={() => { nextLevel() }} className={`bg-transparent hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold hover:text-white py-2 px-4 border-2 border-gray-500 hover:border-transparent rounded ${scp.className}`}>
          {"Continue "} {state.currentLevelState.continueCountdownTimeRemaining !== Infinity ? ` (${state.currentLevelState.continueCountdownTimeRemaining})` : ''}
        </button>}
      </div>
    </div>
    </div>
  );
};

export default DecoderLevelFeedback;