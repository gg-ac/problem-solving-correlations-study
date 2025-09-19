import SignalGo from "@/components/go-nogo/SignalGo";
import SignalNogo from "./SignalNogo";
import KeyboardIcon from "../common/KeyboardIcon";

export default function TaskMemorySpanInstructions() {

    return (
        <div className="h-full w-full grid font-sans grid-rows-5 gap-2 px-80 py-10">

            <div className="flex items-end py-10">
                <span className="text-2xl">Memory Span</span>
            </div>

            <div className=" text-lg row-span-3 grid grid-rows-3 gap-8 px-10 mx-10 rounded-lg border-2 border-dashed">
                <ul>
                    <li className="py-5">You will hear a list of digits read out quickly</li>
                    <li className="py-5">Try to remember as many digits as you can from the <u>end of the list</u> (i.e. the ones you hear last)</li>
                    <li className="py-5">When prompted, enter as many digits as you can remember using the keyboard</li>
                </ul>
            </div>

            <div className="flex items-end justify-center">
                <div className="flex items-center text-xl">Press<KeyboardIcon>Enter</KeyboardIcon>to start</div>
            </div>

        </div>
    );
}
