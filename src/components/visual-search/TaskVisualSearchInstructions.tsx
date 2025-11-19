
import KeyboardIcon from "../common/KeyboardIcon";
import StimulusDistractor from "./StimulusDistractor";
import StimulusTarget from "./StimulusTarget";

export const TaskVisualSearchInstructions: React.FC<{ isPractice: boolean }> = ({ isPractice }) => {

    return (
        <div className="h-full w-full grid font-sans grid-rows-5 gap-2 px-30 py-10">

            <div className="flex items-end py-10">
                <span className="text-2xl">Visual Search Task {isPractice && <>(Practice)</>}</span>
            </div>
            {isPractice ? (
                <div className="flex flex-col row-span-3 items-center text-lg gap-10 px-10 py-10 mx-10 rounded-lg border-2 border-dashed overflow-auto">
                    <span>You will see a square grid containing symbols<StimulusTarget className="max-h-[48px]"/>and<StimulusDistractor className="max-h-[48px]"/></span>
                    <span> Press <KeyboardIcon>J</KeyboardIcon> with your right index finger if there <b>is</b> a <StimulusTarget className="max-h-[48px]"/> anywhere in the grid of symbols</span>
                    <span>Press <KeyboardIcon>F</KeyboardIcon> with your left index finger if there <u>is not</u> a<StimulusTarget className="max-h-[48px]"/>in the grid of symbols</span>
                    <span>Try to answer as quickly and accurately as possible</span>
                    <span>You will complete a short practice round before beginning the full task</span>
                </div>
            ) :
                <div className="flex flex-col row-span-3 items-center text-lg gap-10 px-10 py-10 mx-10 rounded-lg border-2 border-dashed overflow-auto">
                    <div className="flex items-center justify-center">Practice completed. You will now begin the full task.</div>
                    <div className="flex items-center justify-center"><span>Try to react as quickly as possible (but avoid incorrect answers)</span></div>
                </div>
            }

            <div className="flex items-end justify-center">
                <div className="flex items-center text-xl">Press<KeyboardIcon>J</KeyboardIcon>to start</div>
            </div>

        </div>
    );
}
