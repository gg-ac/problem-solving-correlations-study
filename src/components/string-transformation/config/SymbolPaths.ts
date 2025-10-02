import { SymbolEnum } from '../enums/SymbolEnum';

import Symbol1 from '../symbols/sym1.svg'
import Symbol2 from '../symbols/sym2.svg'
import Symbol3 from '../symbols/sym3.svg'
import Symbol4 from '../symbols/sym4.svg'
import Symbol5 from '../symbols/sym5.svg'
import GenericSymbol1 from '../symbols/gen1.svg'
import GenericSymbol2 from '../symbols/gen2.svg'
import GenericSymbol3 from '../symbols/gen3.svg'
import Placeholder from '../symbols/placeholder.svg'
import Arrow from '../symbols/arrow.svg'

const SymbolPaths: Record<SymbolEnum, React.FC<React.SVGProps<SVGSVGElement>>> = {
    [SymbolEnum.S1]: Symbol1,
    [SymbolEnum.S2]: Symbol2,
    [SymbolEnum.S3]: Symbol3,
    [SymbolEnum.S4]: Symbol4,
    [SymbolEnum.S5]: Symbol5,
    [SymbolEnum.G1]: GenericSymbol1,
    [SymbolEnum.G2]: GenericSymbol2,
    [SymbolEnum.G3]: GenericSymbol3,
    [SymbolEnum.PLACEHOLDER]: Placeholder,
    [SymbolEnum.ARROW]: Arrow,
};

export default SymbolPaths;
