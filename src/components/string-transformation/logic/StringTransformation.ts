import { mapEnumsToTSymbols, SymbolEnum } from "../enums/SymbolEnum";

function mapArrayToIndexedObject<T>(array: T[]): { [key: number]: T } {
    return array.reduce((acc, curr, index) => {
        acc[index] = curr;
        return acc;
    }, {} as { [key: number]: T });
}

export function symbolStringsMatch(str1:TSymbol[], str2:TSymbol[]){
    if (str1.length != str2.length){
        return false
    }
    for (let i = 0; i < str1.length; i++){
        if (!str1[i].matches(str2[i])){
            return false
        }
    }
    return true
}

export class TSymbol {
    constructor(public id: string, public isGeneric: boolean = false) { }

    matches(s: TSymbol) {
        if (this.isGeneric || s.isGeneric) {
            return true
        }
        return s.id === this.id
    }

    toObject(){
        return {
            "TSymbolID":this.id,
            "isGeneric":this.isGeneric
        }
    }
}

export class TransformationRule {
    private _input: TSymbol[]
    private _output: TSymbol[]
    constructor(input: TSymbol[], output: TSymbol[]) {

        this._input = input
        this._output = output
        const outputUsesPredefinedGenerics = this._output.every(s => {
            if (s.isGeneric) {
                return this._input.includes(s)
            } else {
                return true
            }
        });

        if (!outputUsesPredefinedGenerics) {
            throw new Error(`Output cannot contain generic TSymbols which do not also exist in the input`)
        }

    }

    static fromSymbolIdStrings(input:string, output:string){
        let inputSymbols = mapEnumsToTSymbols(input.split("") as SymbolEnum[])
        let outputSymbols = mapEnumsToTSymbols(output.split("") as SymbolEnum[])
        return new TransformationRule(inputSymbols, outputSymbols)
    }

    toObject(){
        return {
            "input":mapArrayToIndexedObject(this.input.map((i) => i.toObject())),            
            "output":mapArrayToIndexedObject(this.output.map((i) => i.toObject()))
        }
    }

    get input(): TSymbol[] {
        return this._input
    }

    get output(): TSymbol[] {
        return this._output
    }

    apply(target: TSymbol[], index: number): TSymbol[] | null {
        // Check if the position is valid
        if (index < 0 || index > target.length - this._input.length) {
            return null
            //throw new Error(`Rule of length ${this._input.length} cannot be applied at index ${index} of target list of length ${target.length}`);
        }

        // Check if the pattern occurs at the specified position
        const substring = target.slice(index, index + this._input.length);
        const isMatch = this._input.every((TSymbol, i) => TSymbol.matches(substring[i]));


        // A given generic can't be applied to two or more different non-generic TSymbols
        let genericApplicationHistory = new Map<TSymbol, TSymbol[]>()
        const genericsNotOverloaded = this._input.every((s, i) => {
            if (genericApplicationHistory.has(s)) {
                if (genericApplicationHistory.get(s)![0] === substring[i]) {
                    return true
                } else {
                    genericApplicationHistory.set(s, [...genericApplicationHistory.get(s)!, substring[i]])
                }
            } else {
                genericApplicationHistory.set(s, [substring[i]])
                return true
            }
        })
        if (!genericsNotOverloaded) {
            // let message = ""
            // genericApplicationHistory.forEach((match, generic) => {
            //     if (match.length > 1) {
            //         message += `Generic TSymbol with ID ${generic.id} cannot be matched to multiple TSymbols: ${match.map((s) => { return s.id })}\n`
            //     }
            // })
            // throw new Error(message);
            return null
        }


        // Check if the pattern occurs at the specified position
        if (isMatch) {
            let newString = [
                ...target.slice(0, index), // Elements before the match
                ...this._output, // Replacement TSymbols
                ...target.slice(index + this._input.length) // Elements after the match
            ]

            // Replace the generics in the output with their corresponding TSymbols from the target string
            newString.forEach((s, io) => {
                if (s.isGeneric) {
                    const ii = this._input.indexOf(s)
                    newString[io] = target[index + ii]
                }
            })
            return newString
        }

        return null;
    }
}