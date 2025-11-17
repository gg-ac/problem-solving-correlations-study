
import KeyboardIcon from "../common/KeyboardIcon";
import StimulusDistractor from "./StimulusDistractor";
import StimulusTarget from "./StimulusTarget";

export default function TaskVisualSearchInstructions() {

    return (
        <div className="h-full w-full grid font-sans gap-2 px-60 py-5">

            <div className="flex items-end py-10">
                <span className="text-2xl">Visual Search Task</span>
            </div>

            <div className="text-md grid gap-12 px-10 py-5 mx-10 rounded-lg border-2 border-dashed 
                min-h-[30vh] overflow-y-auto">

                <div className="flex flex-wrap items-center justify-center gap-x-2">
                    You will see a square grid containing symbols
                    <span className="flex h-[32px] mx-2"><StimulusTarget /></span>
                    and
                    <span className="h-[32px] mx-2"><StimulusDistractor /></span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-2">
                    Press <KeyboardIcon>J</KeyboardIcon>
                    <span>with your right index finger if there <b>is</b> a</span>
                    <span className="h-[32px] mx-2"><StimulusTarget /></span>
                    anywhere in the grid of symbols
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-2">
                    Press <KeyboardIcon>F</KeyboardIcon>
                    <span>with your left index finger if there <u>is not</u> a</span>
                    <span className="h-[32px] mx-2"><StimulusTarget /></span>
                    in the grid of symbols
                </div>

                <div className="flex flex-wrap items-center justify-center">
                    Try to answer as quickly and accurately as possible
                </div>

                <div className="flex flex-wrap items-center justify-center">
                    The task will start immediately, so get ready!
                </div>

            </div>


            <div className="flex items-end justify-center">
                <div className="flex items-center text-xl">Press<KeyboardIcon>J</KeyboardIcon>to start</div>
            </div>

        </div>
    );
}
