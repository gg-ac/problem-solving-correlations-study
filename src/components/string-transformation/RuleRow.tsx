"use client"
import React from 'react';
import SelectableSymbol from './SelectableSymbol';
import { SymbolEnum } from './enums/SymbolEnum';
import { useGameContext } from './GameContext';
import { motion } from 'motion/react';

interface RuleRowProps {
    id: string
    inputSymbols: SymbolEnum[];
    outputSymbols: SymbolEnum[];
    maxSymbols: number,
    isSelected: boolean;
    onSelect: () => void;
    index: number
}

const RuleRow: React.FC<RuleRowProps> = ({ id, inputSymbols, outputSymbols, maxSymbols, isSelected, onSelect, index }) => {

    const { state } = useGameContext();


    let padSymbolCount = maxSymbols - 1 - inputSymbols.length - outputSymbols.length

    let prePad = new Array(Math.floor(padSymbolCount / 2)).fill(SymbolEnum.PLACEHOLDER);
    let postPad = new Array(Math.ceil(padSymbolCount / 2)).fill(SymbolEnum.PLACEHOLDER);

    let ruleInputIndices = Array.from({ length: inputSymbols.length }, (_, j) => { return prePad.length + j })

    return (
        <motion.div
            id={id}
            animate={state.currentLevelState.validRuleUseIndex == index ? { scale: [1, 1.05, 1] } : { scale: 1 }} // Shake animation
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={onSelect} className={`flex items-center justify-center rounded-md space-x-px sm:space-x-1 cursor-pointer  border-2
            ${isSelected ? ' bg-black/5 dark:bg-black/30 border-gray-600 dark:border-gray-400' : 'border-transparent'}`}>
            <div id={`${id}-lhs`} className="flex">
                {[...prePad, ...inputSymbols].map((symbolID, i) => {
                    return (
                        <div
                            key={i} >
                            <SelectableSymbol
                                key={index}
                                symbolID={symbolID}
                                isSelectable={false}
                                isSelected={false}
                                animateOnInvalidRuleUse={state.currentLevelState.invalidRuleUseIndex == index ? ruleInputIndices.includes(i) : false}
                                animateOnValidRuleUse={false}
                                animateOnSuccess={false}
                                onSelect={() => { }}
                                index={i}
                            />
                        </div>
                    );
                })}
            </div>
            <div id={`${id}-rhs`}  className="flex">
                {[SymbolEnum.ARROW, ...outputSymbols, ...postPad].map((symbolID, i) => {
                    return (
                        <div
                            key={i} >
                            <SelectableSymbol
                                key={index}
                                symbolID={symbolID}
                                isSelectable={false}
                                isSelected={false}
                                animateOnInvalidRuleUse={state.currentLevelState.invalidRuleUseIndex == index ? ruleInputIndices.includes(i) : false}
                                animateOnValidRuleUse={false}
                                animateOnSuccess={false}
                                onSelect={() => { }}
                                index={i}
                            />
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default RuleRow;
