import seedrandom from 'seedrandom';
import { getRandomInt, shuffleArray } from '../utils/random';


function generateRandomString(n: number, randomSeed: string): number[] {
    const rng = seedrandom(randomSeed);
    const digits = '123456789';
    const result: number[] = [];
    const digitCount: { [key: string]: number } = {};

    // Helper function to check if the last 6 digits contain the current digit
    const isValidWindow = (digit: number): boolean => {
        const window = result.slice(-6);
        return !window.includes(digit);
    };

    // Helper function to check if the digit can be added
    const canAddDigit = (digit: number): boolean => {
        if (digitCount[digit] >= 3) return false; // No more than 3 occurrences
        if (!isValidWindow(digit)) return false; // No repeats in the last 6 digits
        if (result.length > 0) {
            const lastDigit = result[result.length - 1];
            // Check if the current digit is in forward numerical order with the last digit
            if (digit === lastDigit + 1) return false;

            // Check if the current digit is in reverse numerical order with the last digit
            if (digit === lastDigit - 1) return false;
        }
        return true;
    };

    while (result.length < n) {
        const randomIndex = getRandomInt(0, digits.length, rng)
        const digit = parseInt(digits[randomIndex]);

        if (canAddDigit(digit)) {
            result.push(digit);
            digitCount[digit] = (digitCount[digit] || 0) + 1;
        }

    }
    return result
}

export function generateMemorySpanTaskTrials(sequenceLengths: number[], trialsPerSize: number, randomSeed: string) {
    let sequences: number[][] = [];
    for (let i = 0; i < sequenceLengths.length; i++) {
        for (let j = 0; j < trialsPerSize; j++) {
            const sequenceLength = sequenceLengths[i]
            sequences.push(generateRandomString(sequenceLength, randomSeed + i + j * sequenceLengths.length));
        }
    }
    let shuffledSequences = shuffleArray(sequences, randomSeed)
    return shuffledSequences
}
