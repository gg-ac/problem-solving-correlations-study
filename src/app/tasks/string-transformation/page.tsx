"use client"

import { CustomStepType, stringTransformationInstructionSteps } from "@/components/string-transformation/config/TourConfig";
import GameContainer from "@/components/string-transformation/GameContainer";
import { GameContextProvider } from "@/components/string-transformation/GameContext";
import { TEST_LEVEL_SCHEDULE_1 } from "@/test/TestLevelSchedule";
import { TourProvider, useTour } from "@reactour/tour";
import { useEffect } from "react";
import NavArrowForwards from '../../../components/string-transformation/ui/nav_arrow_forwards.svg'
import { generateRandomOrderRewritingTrials } from "@/components/string-transformation/TrialGenerator";

export default function Home() {


  const { setIsOpen } = useTour()
  useEffect(() => {setIsOpen(true)}, [])


  return (
     <TourProvider
        steps={stringTransformationInstructionSteps}
        padding={0}
        disableKeyboardNavigation={true}
        onClickMask={()=>{}}
        className={"bg-slate-900 text-white text-lg font-mono shadow-lg shadow-black/50 border-2 border-gray-500"}
        nextButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep, steps, }) => {
          const last = currentStep === stepsLength - 1
          return (
            <button
              className={"cursor-pointer"}
              onClick={() => {
                if (last) {
                  setIsOpen(false)
                } else {
                  var id = (steps as CustomStepType[])[currentStep].id                  
                  if (id !== undefined && ["rule-select", "symbol-select"].includes((steps as CustomStepType[])[currentStep].id!)){
                    return
                  }
                  setCurrentStep((s) => (s === steps!.length - 1 ? 0 : s + 1))
                }
              }}
            >
              {<NavArrowForwards className="w-[24px] h-[24px]" />}
            </button>
          )
        }}
        prevButton={({ }) => { return (<div></div>) }}
        showDots={false} showBadge={false} showCloseButton={false} styles={{
          popover: (base) => ({
            ...base,
            '--reactour-accent': '#000000ff',
            backgroundColor: "",
            color: "",
            boxShadow: "",
            borderRadius: 10,
            margin:10
          }),
          maskArea: (base) => ({ ...base, rx: 10 }),
          maskWrapper: (base) => ({ ...base, opacity: 0.8, color: '#000000ff', backdropFilter: "blur(8px)" }),
          controls: (base) => ({ ...base, marginTop: 20 }),
        }}>
    <div className="h-screen flex flex-col">
      <GameContextProvider levelSchedule={generateRandomOrderRewritingTrials("test-participant")} startLevelIndex={0}>
          <GameContainer></GameContainer>
      </GameContextProvider>
    </div>
    </TourProvider>
  );
}
