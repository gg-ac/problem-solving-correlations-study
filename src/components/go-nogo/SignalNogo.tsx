import Square from './images/square.svg'


const SignalNogo: React.FC<{className?:string}> = ({className}) => {
  return (
      <Square className={className + " text-gray-400 dark:text-gray-300 h-full p-2 w-auto object-contain inline"}/>
  );
};

export default SignalNogo