import Triangle from './images/triangle.svg'


const SignalGo: React.FC<{className?:string}> = ({className}) => {
  return (
    <Triangle className={className + " text-gray-400 dark:text-gray-300 h-full p-2 w-auto object-contain inline"}/>
  );
};

export default SignalGo