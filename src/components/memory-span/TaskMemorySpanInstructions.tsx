import KeyboardIcon from "../common/KeyboardIcon";

export default function TaskMemorySpanInstructions() {

    return (
        <div className="h-full w-full grid font-sans grid-rows-5 gap-2 px-80 py-10">

            <div className="flex items-end py-10">
                <span className="text-2xl">Memory Span</span>
            </div>

            <div className="overflow-auto text-md row-span-3 grid grid-rows-3 gap-8 px-10 mx-10 rounded-lg border-2 border-dashed">
                <ul>
                    <li className="py-5">You will hear a list of digits read out quickly</li>
                    <li className="py-5">Try to remember as many digits as you can from the <u>end of the list</u> (i.e. the ones you hear last)</li>
                    <li className="py-5">When prompted, enter as many digits as you can remember using the keyboard</li>
                    <li className="py-5">Example:</li>
                    <li className="py-2">If you hear the list "9 3 6 5 4 1 3 5 7 2" try to remember the most recent digits</li>
                    <li className="py-2">If you can only remember the most recent three digits, you'll enter "572"</li>
                    <li className="py-2">If you can remember the most recent five digits, you'll enter "13572"</li>
                    <li className="py-2">Try to remember as many digits as you can from the end of the list</li>
                </ul>
            </div>

            <div className="flex items-end justify-center">
                <div className="flex items-center text-xl">Press<KeyboardIcon>Enter</KeyboardIcon>to start</div>
            </div>

        </div>
    );
}
