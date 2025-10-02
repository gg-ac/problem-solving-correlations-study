import { TSymbol } from "../logic/StringTransformation";

export enum SymbolEnum {
    S1 = 'a',
    S2 = 'b',
    S3 = 'c',
    S4 = 'd',
    S5 = 'e',
    G1 = 'x',
    G2 = 'y',
    G3 = 'z',
    PLACEHOLDER = "",
    ARROW = "arrow"
}

export const SYMBOL_ENUMS_GENERIC = [ SymbolEnum.G1, SymbolEnum.G2, SymbolEnum.G3 ]
export const SYMBOL_ENUMS_NON_GENERIC = [ SymbolEnum.S1, SymbolEnum.S2, SymbolEnum.S3, SymbolEnum.S4, SymbolEnum.S5 ]

export const mapEnumsToTSymbols = (symbols: SymbolEnum[]): TSymbol[] => {
    return symbols.map(symbol => {
        const isGeneric = SYMBOL_ENUMS_GENERIC.includes(symbol);
        return new TSymbol(symbol, isGeneric);
    });
};