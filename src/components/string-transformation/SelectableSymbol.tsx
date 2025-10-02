"use client"
import React, { useState } from 'react';
import SymbolImage from './SymbolImage';
import { SymbolEnum } from './enums/SymbolEnum';
import { motion, TargetAndTransition } from 'motion/react';
import { Transition } from 'motion';

interface SelectableSymbolProps {
    symbolID: SymbolEnum;
    isSelectable: boolean;
    isSelected: boolean;
    animateOnInvalidRuleUse: boolean | undefined;
    animateOnValidRuleUse: boolean | undefined;
    animateOnSuccess: boolean | undefined;
    onSelect: () => void;
    index: number
}

const SelectableSymbol: React.FC<SelectableSymbolProps> = ({ symbolID, isSelectable, isSelected, animateOnInvalidRuleUse, animateOnValidRuleUse, animateOnSuccess, onSelect, index }) => {

    let animation:TargetAndTransition = {}
    let transition:Transition = {}

    if (animateOnInvalidRuleUse) {
        animation = { x: [0, -5, 5, -5, 5, 0] }
        transition = {duration: 0.5}
    }
    if (animateOnValidRuleUse){
        animation = { scale: [1, 1.1, 1], y: [0, -5, 0] }
        transition = {duration: 0.2,  delay: index * 0.03, ease: "easeInOut"}
    }
    if (animateOnSuccess){
        animation = {y:[0, -5, 0]}
        transition = {duration: 0.4,  delay: index * 0.1, ease: "easeInOut"}
    }

    return (
        <motion.div
            animate={animation}
            transition={transition}
            onClick={onSelect}
            className={`flex items-center justify-center aspect-square rounded-md border-2
                ${isSelected ? 'bg-black/10 dark:bg-black/30 border-gray-600 dark:border-gray-400' : isSelectable ? 'bg-black/5 dark:bg-white/5 border-transparent' : ' border-transparent bg-transparent dark:bg-transparent dark:bg-black/0'}
                ${isSelectable ? 'cursor-pointer' : ''}`}
        >
            <SymbolImage symbolID={symbolID} />
        </motion.div>
    );
};

export default SelectableSymbol;