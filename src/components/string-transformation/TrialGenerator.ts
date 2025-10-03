import { SymbolEnum } from "@/components/string-transformation/enums/SymbolEnum"
import { LevelSpec } from "@/components/string-transformation/GameContext"
import { TransformationRule, TSymbol } from "@/components/string-transformation/logic/StringTransformation"
import { shuffleArray } from "@/components/utils/random"

let a = new TSymbol(SymbolEnum.S1, false)
let b = new TSymbol(SymbolEnum.S2, false)
let c = new TSymbol(SymbolEnum.S3, false)
let d = new TSymbol(SymbolEnum.S4, false)

let demo_rule_1 = new TransformationRule([a, b], [b])
let demo_rule_2 = new TransformationRule([c, b], [d])
let demo_rule_3 = new TransformationRule([d, b, a], [d, c])
let demo_rules = [demo_rule_1, demo_rule_2, demo_rule_3]

let rule_1 = new TransformationRule([a, b], [a])
let rule_2 = new TransformationRule([a, a], [c])
let rule_3 = new TransformationRule([b, a], [d, c])
let rule_4 = new TransformationRule([d, c], [a, b])
let rule_5 = new TransformationRule([b, a, c], [b, c])
let rule_6 = new TransformationRule([d, c, b], [b, a, c])
let ruleset_a = [rule_1, rule_2, rule_3, rule_4, rule_5, rule_6]

let sl_5_trials = [
    [[d, a, b, a, d, a, b, c,], [a, d, a, b, c,]],
    [[b, c, a, d, c, a, b,], [b, c, a, a, a, c,]],
    [[d, c, a, b, d, d, a, b,], [a, a, c, d, d, a, b,]],
    [[c, d, a, a, b, c, d, c,], [c, a, c, d, c,]],
    [[d, c, a, b, d, d, c, c,], [a, a, c, d, d, c, c,]]]

let sl_6_trials = [
    [[b, d, b, a, d, b, d, c,], [b, d, b, a, d, a,]],
    [[d, c, d, c, b, d,], [a, b, c, b, d,]],
    [[a, c, d, c, d, c, b,], [a, c, a, b, c, b,]],
    [[c, d, c, d, c, b,], [c, a, b, c, b,]],
    [[a, b, c, c, b, d, c, d,], [a, b, c, c, a, d,]]
]

let sl_7_trials = [
    [[b, b, a, c, a, a, c, c,], [a, c, a, a, c, c,]],
    [[c, a, a, c, d, c, b, a,], [c, a, a, c, a, b, c,]],
    [[a, a, c, c, b, d, a, a,], [a, a, c, c, a,]],
    [[b, d, a, a, d, b, a,], [a, d, b, a,]],
    [[b, a, d, b, b, a, c,], [b, a, d, a, c,]]
]

const demoSchedule = { rulesetID: "demo", isPractice: true, isTutorial: true, rules: demo_rules, startString: [c, a, b, d, a], targetString: [d, d, a], maxSolveTime: Infinity, maxRestTime: 30 }

export function generateRandomOrderRewritingTrials(randomSeed:string){
    let allSchedules:LevelSpec[][] = []
    for (let schedule of [sl_5_trials, sl_6_trials, sl_7_trials]){
        let subschedule = schedule.map((io) => {return {
        rulesetID: "a",
        isPractice: false,
        isTutorial: false,
        rules: ruleset_a,
        startString: io[0],
        targetString: io[1],
        maxSolveTime: 75,
        maxRestTime: 30
    }})
        allSchedules.push(subschedule)
    }
    return [demoSchedule, ...shuffleArray(allSchedules.flat(), randomSeed)]
}