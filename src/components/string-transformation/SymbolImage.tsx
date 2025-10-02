import SymbolPaths from "./config/SymbolPaths";
import { SymbolEnum } from "./enums/SymbolEnum";

interface SymbolProps {
  symbolID: SymbolEnum
}


const SymbolImage: React.FC<SymbolProps> = ({ symbolID }) => {
  const ImageComponent = SymbolPaths[symbolID];

  return (
    <div className="flex items-center justify-center text-gray-800 dark:text-gray-200">
      <ImageComponent className="w-full h-full max-w-[32px] max-h-[32px] object-contain"/>
    </div>
  );
};

export default SymbolImage;
