import SignalGo from "@/components/go-nogo/SignalGo";
import SignalNogo from "./SignalNogo";
import KeyboardIcon from "../common/KeyboardIcon";

export const TaskGoNogoInstructions: React.FC<{ isPractice: boolean }> = ({ isPractice }) => {

    return (
        <div className="h-full w-full grid font-sans grid-rows-5 gap-2 px-30 py-10">

            <div className="flex items-end py-10">
                <span className="text-2xl">Go/No-Go Task {isPractice && <>(Practice)</>}</span>
            </div>

            
                {isPractice ? (
                    <div className="flex flex-col row-span-3 items-center text-lg gap-10 px-10 py-10 mx-10 rounded-lg border-2 border-dashed overflow-auto">
                        <span >You will see a sequence of symbols quickly shown on the screen</span>
                        <span >Press<KeyboardIcon>Space</KeyboardIcon>when you see the "Go" symbol: <SignalGo className="max-h-[64px]"></SignalGo></span>
                        <span >Press <b>nothing</b> when you see the "No-Go" symbol: <SignalNogo className="max-h-[64px]"></SignalNogo></span>
                        <span >Try to react as quickly as possible (but avoid incorrect presses)</span>
                        <span >You will complete a short set of practice trials before beginning the full task</span>
                    </div>) :
                    <div className="flex flex-col row-span-3 items-center text-lg gap-10 px-10 py-10 mx-10 rounded-lg border-2 border-dashed overflow-auto">
                        <div className="flex items-center justify-center">Practice completed. You will now begin the full task.</div>
                        <div className="flex items-center justify-center">The task will be faster and you will not receive full feedback</div>
                        <div className="flex items-center justify-center"><span>Try to react as quickly as possible (but avoid incorrect presses)</span></div>
                    </div>
                }

            <div className="flex items-end justify-center">
                <div className="flex items-center text-xl">Press<KeyboardIcon>Space</KeyboardIcon>to start</div>
            </div>

        </div>
    );
}
