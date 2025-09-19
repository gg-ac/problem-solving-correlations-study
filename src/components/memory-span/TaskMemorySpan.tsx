"use client"

import TaskMemorySpanInstructions from "./TaskMemorySpanInstructions";
import FixationCross from "../common/FixationCross";
import { useTaskContextMemorySpan } from "./TaskContextMemorySpan";
import { countMatchingDigits, indicateMatchingDigits } from "./utils";
import { useEffect, useRef, useState } from "react";
import KeyboardIcon from "../common/KeyboardIcon";


export default function TaskGoNogo() {
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { state, setResponseString, skipResponseWait } = useTaskContextMemorySpan();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        // Allow only integer digits
        if (/^\d*$/.test(value)) {
            setInputValue(value);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            setResponseString(inputValue);
            skipResponseWait()
        }
    };

    useEffect(() => {
        if (state.trialState.responseStarted && !state.trialState.responseEnded && inputRef.current) {
            setInputValue("")
            inputRef.current.focus();
        }
    }, [state.trialState.responseStarted, state.trialState.responseEnded]);


    useEffect(() => {
    if (state.trialState.trialStarted && !state.trialState.responseStarted && !state.trialState.trialEnded) {
      if (audioRef.current) {
        audioRef.current.play();
        console.log(audioRef)
      }
    }
  }, [state.trialState.currentDigitIndex, state.trialState.trialStarted, state.trialState.responseStarted, state.trialState.trialEnded]);


    let renderResponse = () => {
        if (state.trialState.responseString !== null) {
            console.log(indicateMatchingDigits(state.trialSpecs[state.currentTrialIndex].digits, state.trialState.responseString))
            return indicateMatchingDigits(state.trialSpecs[state.currentTrialIndex].digits, state.trialState.responseString).map((matched, i) => matched ? <span key = {i} className="text-green-600 font-mono">{state.trialState.responseString![i]}</span> : <span key = {i} className="text-grey-300 font-mono">{state.trialState.responseString![i]}</span>)
        }
    }

    return (
        <div className="h-full flex flex-col justify-center items-center">

            {state.trialState.responseStarted && !state.trialState.responseEnded ?
                <div className="flex flex-col text-xl">
                    <span className="my-10">
                        Enter as many digits as you can remember from the end of the list.
                    </span>
                    <input
                        type="text"
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="..." />
                    <div className="flex items-center justify-center my-10">Press<KeyboardIcon>Enter</KeyboardIcon>to confirm </div>
                </div>
                : <></>}

            {state.blockStarted ? <></> : <TaskMemorySpanInstructions></TaskMemorySpanInstructions>}

            {/* {state.trialEventHistory.map(val => "\n" + val.action)} */}
            <div className="flex items-center justify-center">
                {state.fixationActive && state.blockStarted ? <FixationCross></FixationCross> : <></>}

                {state.trialState.trialStarted && !state.trialState.responseStarted && !state.trialState.trialEnded ?
                    state.trialState.currentDigitIndex !== null ? 
                    <div className="text-6xl">
                        {state.trialSpecs[state.currentTrialIndex].digits[state.trialState.currentDigitIndex]}
                        <audio ref={audioRef} src={`/audio/digits/sound_${state.trialSpecs[state.currentTrialIndex].digits[state.trialState.currentDigitIndex]}.mp3`} />
                        </div> : <></>
                    :
                    <></>
                }

                {state.trialState.feedbackStarted && !state.trialState.feedbackEnded ?
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-col items-right justify-center text-xl">
                            <span className="font-mono text-right py-2">{state.trialSpecs[state.currentTrialIndex].digits.join("")}</span>
                            <span className="font-mono text-right py-2">{renderResponse()}</span>
                        </div>
                        <span className="text-3xl py-10">{countMatchingDigits(state.trialSpecs[state.currentTrialIndex].digits, state.trialState.responseString)} Correct</span>
                    </div> :
                    <></>
                }
            </div>
        </div>
    );
}
