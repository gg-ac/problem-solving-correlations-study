import seedrandom from 'seedrandom';

// Generate a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min: number, max: number, rng:seedrandom.PRNG): number {
    return Math.floor(rng() * (max - min)) + min;
}

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