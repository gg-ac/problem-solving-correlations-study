"use client"

import { usePageContext } from "@/context/PageContext";
import { useEffect } from "react";

export default function Home() {
    const requestFullscreen = (): void => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
    };

    useEffect(() => {
        requestFullscreen();
    }, []);

    const { pages, currentPageIndex, setCurrentPageIndex } = usePageContext();
    return (
        <div className="flex flex-col items-center justify-items-center justify-center min-h-screen">
            <p className="py-10 text-2xl">Welcome to the Cognitive Correlations study!</p>
            <p className="text-lg pb-8">In this study, you will complete a series of game-like tasks using the keyboard and mouse.</p>
            <p className="text-lg pb-8">You will need audio for some of the tasks.</p>
            <p className="text-lg pb-8">Instructions will be provided before each task begins.</p>
            <p className="text-lg pb-8">Please try to perform as well as possible on each task.</p>
            <p className="text-lg font-bold pb-8">By continuing, you consent to participate in this study, and you agree to the terms described on the participant information sheet</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => { if (currentPageIndex + 1 < pages.length) {setCurrentPageIndex(currentPageIndex + 1); requestFullscreen()} }}>Start Study</button>
        </div>
    );
}