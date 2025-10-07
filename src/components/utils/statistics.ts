import * as ss from 'simple-statistics';

export function computeNormalPercentile(popMean:number, popStd:number, value:number){
    const z = (value - popMean) / popStd;
    const percentile = ss.cumulativeStdNormalProbability(z) * 100;
    return percentile
}

