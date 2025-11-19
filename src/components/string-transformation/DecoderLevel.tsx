import { SymbolEnum } from "./enums/SymbolEnum";
import SymbolRow from "./SymbolRow";
import RuleRow from "./RuleRow";
import UndoButton from "./UndoButton";
import ResetButton from "./ResetButton";
import { Source_Code_Pro } from 'next/font/google'
import { useGameContext } from "./GameContext";
import { useEffect } from "react";
import { useTour } from "@reactour/tour";
import { CustomStepType } from "./config/TourConfig";
import { usePageContext } from "@/context/PageContext";

interface DecoderLevelProps {
  levelIndex: number
}

const scp = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  weight: "300"
})


const DecoderLevel: React.FC<DecoderLevelProps> = ({ levelIndex }) => {

  const { state,
    handleActiveSymbolIndexChange,
    handleActiveRuleIndexChange,
    handleUndoTransformation,
    handleResetLevel, exportLevelEventHistory } = useGameContext();
    
  const { taskData, addTaskData } = usePageContext();
    
  //TODO: This effect isn't triggering correctly?
    useEffect(() => {
        if(state.gameCompleted){
        const taskEventData = exportLevelEventHistory()
        console.log(taskEventData)
        addTaskData({taskName:"string-transformation", data:taskEventData})
        }
    }, [state.gameCompleted]);



  const { setIsOpen, setCurrentStep, isOpen, currentStep, steps } = useTour()

  function tourAdvance() {
    if (state.levelSchedule[state.currentLevelIndex].isTutorial){
      if ((steps as CustomStepType[])[currentStep].id == "symbol-select"){
        setCurrentStep(currentStep + 1)
      }
      if ((steps as CustomStepType[])[currentStep].id == "rule-select"){
        setCurrentStep(currentStep + 1)
      }
    }
  }

  useEffect(() => {
    if (state.levelSchedule[state.currentLevelIndex].isTutorial){
      setIsOpen(true)
    }
  }, [])

  function formatTime(value:number|null) {
    if (value === Infinity || value === null){
      return ""
    }
    return value.toString()
  }

  function interactionEnabled(){
    if (state.levelSchedule[state.currentLevelIndex].isTutorial && isOpen){
      var id = (steps as CustomStepType[])[currentStep].id
      if (id !== undefined){
        if (["symbol-select", "rule-select", "try-undo", "try-redo"].includes(id)){
          return true
        }
      }
      return false
    }
    return true
  }

   

  return (
    <div id="level" className="flex flex-col justify-center items-center h-full bg-linear-to-t from-stone-400 to-stone-300 dark:from-gray-900 dark:to-slate-900 font-(family-name:--font-geist-sans)">

      <div className="flex flex-col justify-center h-full p-1 m-1 sm:p-5 sm:m-5 bg-stone-200 dark:bg-slate-800 shadow-inset-game-panel-background border-2 border-stone-500 dark:border-slate-700 rounded-2xl max-w-xl">
        <div className="grid grid-cols-5 mx-4 space-x-2">
          <div className="grid col-span-2 grid-cols-2 content-center gap-2">
            {state.levelSchedule[state.currentLevelIndex].maxSolveTime !== null ?
              <div className={`py-2 my-2 max-h-16 border-2 border-gray-300 dark:border-gray-700 shadow-lg dark:shadow-inset-game-panel bg-gray-100 dark:bg-gray-900 dark:text-gray-200 text-xl sm:text-3xl text-center select-none flex justify-center rounded-xl overflow-hidden ${scp.className}`}>{state.currentLevelState.remainingTime ? formatTime(Math.round(state.currentLevelState.remainingTime)) : formatTime(state.levelSchedule[state.currentLevelIndex].maxSolveTime)}</div>
              :
              <></>}
            <div className="py-2 my-2 max-h-16 border-2 border-gray-300 dark:border-gray-700 shadow-lg dark:shadow-inset-game-panel bg-gray-100 dark:bg-gray-900 dark:text-gray-200 select-none flex items-baseline justify-center rounded-xl overflow-hidden"><span className={`text-xl sm:text-3xl ${scp.className}`}>{state.currentLevelIndex + 1}</span><span className={`text-md sm:text-lg ${scp.className}`}>/{state.levelSchedule.length}</span></div>
          </div>
          <div id="button-undo" className="py-2 my-2 col-span-1 col-start-4 dark:text-gray-200 flex justify-center rounded-xl overflow-hidden"><UndoButton onClick={() => {if(interactionEnabled()) {handleUndoTransformation()}}} /></div>
          <div id="button-reset" className="py-2 my-2 col-span-1 col-start-5 dark:text-gray-200 flex justify-center rounded-xl overflow-hidden"><ResetButton onClick={() => {if(interactionEnabled()) {handleResetLevel()}}}  /></div>
        </div>

        <div className="flex-col shrink-0 p-2 px-4 mx-4 space-y-4 border-2 border-gray-300 dark:border-gray-700 shadow-lg dark:shadow-inset-game-panel bg-gray-100 dark:bg-gray-900 flex justify-center rounded-2xl overflow-hidden">
          <SymbolRow id="goal-string" symbols={state.currentLevelState.puzzleState.targetString.map((s) => { return s.id }) as SymbolEnum[]} interactive={false} selectedIndex={null} maxSymbols={8} onSelect={() => { }} />
          <SymbolRow id="state-string" symbols={state.currentLevelState.puzzleState.currentString.map((s) => { return s.id }) as SymbolEnum[]} interactive={true} selectedIndex={state.currentLevelState.activeSymbolIndex} maxSymbols={8} onSelect={(index) => { if(interactionEnabled()) {handleActiveSymbolIndexChange(index); tourAdvance()} }} />
        </div>
        <div id="rules" className="flex-col grow p-4 m-4 space-y-4 border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 shadow-lg dark:shadow-inset-game-panel rounded-2xl overflow-y-auto">
          {state.currentLevelState.rules.map((tr, i) => {
            return <RuleRow id={`rules-${i}`} key={i} index={i} maxSymbols={9} inputSymbols={tr.input.map((s) => { return s.id }) as SymbolEnum[]} outputSymbols={tr.output.map((s) => { return s.id }) as SymbolEnum[]} isSelected={state.currentLevelState.activeRuleIndex === i} onSelect={() => { if(interactionEnabled()) {handleActiveRuleIndexChange(i); tourAdvance()} }} />
          })}
          {/* <RuleRow maxSymbols={9} inputSymbols={[SymbolEnum.G2]} outputSymbols={[SymbolEnum.S1]} isSelected={true} onSelect={() => { }} />
          <RuleRow maxSymbols={9} inputSymbols={[SymbolEnum.S1, SymbolEnum.S3]} outputSymbols={[SymbolEnum.S2]} isSelected={false} onSelect={() => { }} />
          <RuleRow maxSymbols={9} inputSymbols={[SymbolEnum.S2, SymbolEnum.S3, SymbolEnum.S4]} outputSymbols={[SymbolEnum.S1, SymbolEnum.S5]} isSelected={false} onSelect={() => { }} /> */}
        </div>
      </div>
    </div>
  );
};

export default DecoderLevel;