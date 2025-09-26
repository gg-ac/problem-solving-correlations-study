import seedrandom from 'seedrandom';

function getRandomInt(min: number, max: number, rng:seedrandom.PRNG): number {
    return Math.floor(rng() * (max - min)) + min;
}

export function generateSolutionIndexOrder(solutionCount:number, randomSeed:string){
    const rng = seedrandom(randomSeed);

    var i0 = getRandomInt(0, solutionCount, rng)
    let array = new Array(solutionCount).fill(0)

    for (let i = 0; i < solutionCount; i++) {
        array[(i + i0) % solutionCount] = i;
    }

    return array
}