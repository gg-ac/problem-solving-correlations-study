import { SymbolEnum } from "@/components/string-transformation/enums/SymbolEnum"
import { LevelSpec } from "@/components/string-transformation/GameContext"
import { TransformationRule, TSymbol } from "@/components/string-transformation/logic/StringTransformation"

let a = new TSymbol(SymbolEnum.S1, false)
let b = new TSymbol(SymbolEnum.S2, false)
let c = new TSymbol(SymbolEnum.S3, false)
let d = new TSymbol(SymbolEnum.S4, false)
let e = new TSymbol(SymbolEnum.S5, false)
let x = new TSymbol(SymbolEnum.G1, true)
let y = new TSymbol(SymbolEnum.G2, true)
let z = new TSymbol(SymbolEnum.G3, true)

let rule_1 = new TransformationRule([x, x], [x])
let rule_2 = new TransformationRule([b, a], [d, c])
let rule_3 = new TransformationRule([d, c], [a, b])
let rule_4 = new TransformationRule([c, b, c], [a, d, c])
let rule_5 = new TransformationRule([d, c, a], [b, a, d])

let test_rules_1 = [rule_1, rule_2, rule_3, rule_4, rule_5]


let demo_rule_1 = new TransformationRule([a, b], [b])
let demo_rule_2 = new TransformationRule([c, b], [d])
let demo_rule_3 = new TransformationRule([d, b, a], [d, c])
let demo_rules = [demo_rule_1, demo_rule_2, demo_rule_3]


export const TEST_LEVEL_SCHEDULE_1: LevelSpec[] = [
    {rulesetID:"demo", isPractice:true, isTutorial:true, rules: demo_rules, startString: [c, a, b, d, a], targetString: [d, d, a], maxSolveTime: Infinity, maxRestTime: 30 },
    {rulesetID:"a", isPractice:false, isTutorial:false, rules: test_rules_1, startString: [a, d, b, a, a, c, c], targetString: [a, b, d, c], maxSolveTime: 75, maxRestTime: 30 },
    {rulesetID:"a", isPractice:false, isTutorial:false, rules: test_rules_1, startString: [b, d, c, b, c, d, d, a], targetString: [d, a, b, d, d, a], maxSolveTime: 90, maxRestTime: 30 },
    {rulesetID:"a", isPractice:false, isTutorial:false, rules: test_rules_1, startString: [b, a, c, c, d, d, a], targetString: [d, c, d, d, a], maxSolveTime: 90, maxRestTime: 30 }]


