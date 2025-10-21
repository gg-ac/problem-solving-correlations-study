
import { useState } from "react";
import KeyboardIcon from "../common/KeyboardIcon";

export default function TaskMatrixReasoningInstructions() {

    const [currentInstructionsPageIndex, setCurrentInstructionsPageIndex] = useState(0);

    return (
        <div className="h-full w-full flex flex-col font-sans px-5">
            <div className="flex items-end py-10">
                <span className="text-2xl">Matrix Reasoning Task</span>
            </div>

            <div className="flex text-lg flex-col flex-grow px-5 py-5 rounded-lg border-2 border-dashed">
                <div className="flex flex-col flex-grow items-center justify-center space-y-5">
                    {
                        currentInstructionsPageIndex === 0 &&
                        <div className="flex flex-col items-center">
                            <div className="text-center py-5">You will see a 9-by-9 grid of shapes like this:</div>
                            <img className="max-h-[256px] object-contain py-5" src='/problem-solving-correlations-study/images/matrix-tasks/practice/0.jpeg' alt="Matrix Example" />
                        </div>
                    }
                    {
                        currentInstructionsPageIndex === 1 &&
                        <div className="flex flex-col items-center">
                            <div className="text-center py-2">The shapes follow a pattern from left to right and top to bottom</div>
                            <div className="text-center py-2">The pattern can involve positions, colours, sizes, and combinations of shapes</div>
                        </div>
                    }
                    {
                        currentInstructionsPageIndex === 2 &&
                        <div className="flex flex-col items-center">                            
                            <div className="text-center py-2">You will be shown four options that complete the grid pattern like this:</div>
                            <div className="flex flex-row justify-center space-x-2">
                                <img className="max-h-[80px] object-contain" src={`/problem-solving-correlations-study/images/matrix-tasks/practice/0_1.jpeg`} alt="Option 1" />
                                <img className="max-h-[80px] object-contain" src={`/problem-solving-correlations-study/images/matrix-tasks/practice/0_2.jpeg`} alt="Option 2" />
                                <img className="max-h-[80px] object-contain" src={`/problem-solving-correlations-study/images/matrix-tasks/practice/0_3.jpeg`} alt="Option 3" />
                                <img className="max-h-[80px] object-contain" src={`/problem-solving-correlations-study/images/matrix-tasks/practice/0_4.jpeg`} alt="Option 4" />
                            </div>
                        </div>
                    }
                    {
                        currentInstructionsPageIndex === 3 &&
                        <div className="flex flex-col items-center">
                        <div className="text-center">Click the correct one to solve the puzzle</div>
                        <div className="flex justify-center items-center">
                        <img className="max-h-[256px] object-contain py-5 mx-10" src='/problem-solving-correlations-study/images/matrix-tasks/practice/0.jpeg' alt="Matrix Example" />
                                <img className="max-h-[80px] object-contain" src={`/problem-solving-correlations-study/images/matrix-tasks/practice/0_1.jpeg`} alt="Option 1" />
                                </div>
                        </div>
                    }
                    <div className="flex flex-row justify-center space-x-10">
                        <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${currentInstructionsPageIndex == 0 ? "opacity-50 cursor-not-allowed" : ""}`}  onClick={() => { currentInstructionsPageIndex > 0 ? setCurrentInstructionsPageIndex(currentInstructionsPageIndex - 1) : null }}>Previous</button>
                        <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${currentInstructionsPageIndex == 3 ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => { currentInstructionsPageIndex < 3 ? setCurrentInstructionsPageIndex(currentInstructionsPageIndex + 1) : null }}>Next</button>
                    </div>
                </div>
            </div>

            <div className="flex items-end justify-center py-5">
                <div className="flex items-center text-xl">Press <KeyboardIcon>Space</KeyboardIcon> to start</div>
            </div>
        </div>

    );
}
