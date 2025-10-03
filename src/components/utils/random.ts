import seedrandom from 'seedrandom';

// Generate a random integer between min (inclusive) and max (exclusive)
export function getRandomInt(min: number, max: number, rng:seedrandom.PRNG): number {
    return Math.floor(rng() * (max - min)) + min;
}

export function shuffleArray<T>(array: T[], seed: string): T[] {
    const rng = seedrandom(seed);
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}