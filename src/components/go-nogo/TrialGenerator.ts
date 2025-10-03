import seedrandom from "seedrandom";
import { getRandomInt } from "../utils/random";

export function generateGoNogoTaskTrials(N: number, p: number, randomSeed:string): boolean[] {

    const rng = seedrandom(randomSeed);
    
    if (p < 0 || p > 1) {
        throw new Error("Proportion p must be between 0 and 1.");
    }

    const array: boolean[] = new Array(N).fill(true);
    const numberOfFalse = Math.round(N * p);

    const falseIndices: Set<number> = new Set();
    while (falseIndices.size < numberOfFalse) {
        const randomIndex = getRandomInt(0, N, rng);
        falseIndices.add(randomIndex);
    }

    falseIndices.forEach(index => {
        array[index] = false;
    });

    return array;
}

export function generateGoNogoTaskTrialsDistributed(N: number, p: number, randomSeed:string): boolean[] {

    const rng = seedrandom(randomSeed);
    
    if (p < 0 || p > 1) {
        throw new Error("Proportion p must be between 0 and 1.");
    }

    const nSubArrays = Math.ceil(N*p)
    const subArrayLength = Math.ceil(N / nSubArrays)
    let allSubArrays: boolean[][] = []

    for (let i = 0; i < nSubArrays; i++){
        const array: boolean[] = new Array(subArrayLength).fill(true);
        const randomIndex = getRandomInt(0, subArrayLength, rng);
        array[randomIndex] = false;
        allSubArrays.push(array)
    }

    let flatArray = allSubArrays.flat()
    
    return flatArray.slice(0, N);
}
