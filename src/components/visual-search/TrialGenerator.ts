import seedrandom from 'seedrandom';
import { getRandomInt, shuffleArray } from '../utils/random';


export function generateStimulusArray(distractorCount:number, targetCount:number, arraySize:number, randomSeed:string){

    if (distractorCount + targetCount > arraySize){
        throw RangeError(`Cannot create a stimulus array of size ${arraySize} with ${distractorCount} distractors and ${targetCount} targets`)
    }

    const rng = seedrandom(randomSeed);
    let array = new Array(arraySize).fill(0)

    // Fill the distractors
    for (let i = 0; i < distractorCount; i++) {
        array[i] = 5;
    }

    // Fill the targets
    for (let i = distractorCount; i < distractorCount + targetCount; i++) {
        array[i] = 2;
    }

    // Shuffle
    for (let i = 0; i < 1000; i++){
        let index1 = getRandomInt(0, arraySize, rng)
        let index2 = getRandomInt(0, arraySize, rng)
        let val1 = array[index1]
        array[index1] = array[index2]
        array[index2] = val1
    }

    return array

}

export function generateVisualSearchTaskTrials(setSizes:number[], trialsPerSizePerCondition:number, randomSeed:string){
    let pairs: [number, number][] = [];

    // Create pairs of each element with true and false
    for (const size of setSizes) {
        pairs.push([size, 1]);
        pairs.push([size, 0]);
    }

    // Repeat the pairs N times
    const repeatedPairs: [number, number][] = [];
    for (let i = 0; i < trialsPerSizePerCondition; i++) {
        repeatedPairs.push(...pairs);
    }

    let shuffledParams= shuffleArray(repeatedPairs, randomSeed)

    let stimuli:number[][] = []
    for(let i = 0; i < shuffledParams.length; i++){
        var params = shuffledParams[i]
        let stimulus = generateStimulusArray(params[0] - params[1], params[1], 25, randomSeed + i.toString())
        stimuli.push(stimulus)
    }
    return stimuli
}
