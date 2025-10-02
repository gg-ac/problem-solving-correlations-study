"use client"
import React from 'react';
import SelectableSymbol from './SelectableSymbol';
import { SymbolEnum } from './enums/SymbolEnum';
import { useGameContext } from './GameContext';

interface SymbolRowProps {
    id:string;
    symbols: SymbolEnum[];
    maxSymbols: number;
    interactive: boolean;
    selectedIndex: number | null;
    onSelect: (index: number) => void;
}

const SymbolRow: React.FC<SymbolRowProps> = ({ id, symbols, maxSymbols, interactive, selectedIndex, onSelect }) => {
    const totalSymbols = Math.max(symbols.length, maxSymbols);

    const { state } = useGameContext();

    return (
        <div id={id} className="flex justify-center space-x-[1px] sm:space-x-1">
            {Array.from({ length: totalSymbols }, (_, index) => {
                const symbolID = symbols[index];
                return (
                    <div id={`${id}-${index}`} key={index}>
                        <SelectableSymbol
                            key={index}
                            symbolID={index < symbols.length ? symbolID : SymbolEnum.PLACEHOLDER}
                            isSelectable={interactive && (index < symbols.length)}
                            isSelected={interactive && (index === selectedIndex)}
                            animateOnInvalidRuleUse={interactive && state.currentLevelState.invalidSymbolUseIndices?.includes(index)}
                            animateOnValidRuleUse={interactive && state.currentLevelState.transformedSymbolIndices?.includes(index)}
                            animateOnSuccess={state.currentLevelState.goalAchieved}
                            onSelect={() => { index < symbols.length ? onSelect(index) : null }}
                            index={state.currentLevelState.transformedSymbolIndices ? index - Math.min(...state.currentLevelState.transformedSymbolIndices) : index}
                        />                       
                    </div>

                );
            })}
        </div>
    );
};

export default SymbolRow;
