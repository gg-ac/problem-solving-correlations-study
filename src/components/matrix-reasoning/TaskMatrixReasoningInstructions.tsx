
import KeyboardIcon from "../common/KeyboardIcon";

export default function TaskMatrixReasoningInstructions() {

    return (
        <div className="h-full w-full grid font-sans grid-rows-5 gap-2 px-80 py-5">

            <div className="flex items-end py-10">
                <span className="text-2xl">Matrix Reasoning Task</span>
            </div>

            <div className=" text-lg row-span-3 px-10 py-5 mx-10 rounded-lg border-2 border-dashed">
                <div className="flex flex-col items-center justify-center space-y-5">
                <div >You will see a 9-by-9 grid of shapes</div>
                <div >The shapes follow a pattern from left to right and top to bottom</div>
                <div >There is a missing shape in the bottom right</div>
                <div >You will be shown four options that complete the grid pattern</div>
                <div >Click the correct one to solve the puzzle</div>
                </div>
            </div>

            <div className="flex items-end justify-center">
                <div className="flex items-center text-xl">Press<KeyboardIcon>Space</KeyboardIcon>to start</div>
            </div>

        </div>
    );
}
