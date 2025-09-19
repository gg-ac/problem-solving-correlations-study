export function countMatchingDigits(arr: number[], str: string | null): number {

    if (str === null){
        return 0
    }

    const arrStr = arr.join('');
    const arrLength = arrStr.length;
    const strLength = str.length;
    const startIndex = Math.max(0, arrLength - strLength);

    let matchCount = 0;
    for (let i = startIndex; i < arrLength; i++) {
        if (arrStr[i] === str[i - startIndex]) {
            matchCount++;
        }
    }

    return matchCount;
}


export function indicateMatchingDigits(arr: number[], str: string | null): boolean[] {
    if (str === null){
        return []
    }

    const arrStr = arr.join('');
    const arrLength = arrStr.length;
    const strLength = str.length;
    const startIndex = Math.max(0, arrLength - strLength);

    let matches:boolean[] = [];
    for (let i = startIndex; i < arrLength; i++) {
        let matched = false
        if (arrStr[i] === str[i - startIndex]) {
            matched = true
        }
        matches = [...matches, matched]
    }
    return matches
}