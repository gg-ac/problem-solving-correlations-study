import Tick from './images/icon_tick.svg'


const KeyboardIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="px-3 py-2 mx-3 text-sm font-mono font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-[0px_4px_0px_0px_#aaaaaa]">
      {children}
    </div>
  );
};

export default KeyboardIcon