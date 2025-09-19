import SignalGo from "@/components/go-nogo/SignalGo";
import SignalNogo from "./SignalNogo";
import KeyboardIcon from "../common/KeyboardIcon";

export default function TaskGoNogoInstructions() {

    return (
        <div className="h-full w-full grid font-sans grid-rows-5 gap-2 px-80 py-10">

            <div className="flex items-end py-10">
                <span className="text-2xl">Go/No-Go Task</span>
            </div>

            <div className=" text-lg row-span-3 grid grid-rows-3 gap-8 px-10 mx-10 rounded-lg border-2 border-dashed">
                <div className="flex items-center justify-center">Press<KeyboardIcon>Space</KeyboardIcon>when you see <span className="h-[32px] mx-3"><SignalGo></SignalGo></span></div>
                <div className="flex items-center justify-center"><span>Press <b>nothing</b> when you see </span><span className="h-[32px] mx-3"><SignalNogo></SignalNogo></span></div>
                <div className="flex items-center justify-center"><span>Try to react as quickly as possible</span></div>
            </div>

            <div className="flex items-end justify-center">
                <div className="flex items-center text-xl">Press<KeyboardIcon>Space</KeyboardIcon>to start</div>
            </div>

        </div>
    );
}
