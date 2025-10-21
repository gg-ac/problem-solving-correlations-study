
import KeyboardIcon from "../common/KeyboardIcon";
import StimulusDistractor from "./StimulusDistractor";
import StimulusTarget from "./StimulusTarget";

export default function TaskVisualSearchInstructions() {

    return (
        <div className="h-full w-full grid font-sans grid-rows-5 gap-2 px-60 py-5">

            <div className="flex items-end py-10">
                <span className="text-2xl">Visual Search Task</span>
            </div>

            <div className=" text-lg row-span-3 grid grid-rows-3 gap-8 px-10 py-5 mx-10 rounded-lg border-2 border-dashed">
                <div className="flex items-center justify-center">You will see a square grid containing symbols <span className="h-[32px] mx-3"><StimulusTarget></StimulusTarget></span>  and <span className="h-[32px] mx-3"><StimulusDistractor></StimulusDistractor></span></div>
                <div className="flex items-center justify-center">Press<KeyboardIcon>J</KeyboardIcon><span> with your right index finger if there <b>is</b> a </span><span className="h-[32px] mx-3"><StimulusTarget></StimulusTarget></span> anywhere in the grid of symbols</div>
                <div className="flex items-center justify-center">Press<KeyboardIcon>F</KeyboardIcon><span> with your left index finger if there <u>is not</u> a </span><span className="h-[32px] mx-3"><StimulusTarget></StimulusTarget></span>in the grid of symbols</div>
                <div className="flex items-center justify-center"><span>Try to answer as quickly and accurately as possible</span></div>
                <div className="flex items-center justify-center"><span>The task will start immediately, so get ready!</span></div>
            </div>

            <div className="flex items-end justify-center">
                <div className="flex items-center text-xl">Press<KeyboardIcon>J</KeyboardIcon>to start</div>
            </div>

        </div>
    );
}
