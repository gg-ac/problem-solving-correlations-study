import Triangle from './images/triangle.svg'


const SignalGo: React.FC = () => {
  return (
    <div className="h-full text-gray-400 dark:text-gray-300">
      <Triangle className="h-full w-auto max-w-[128px] max-h-[128px] object-contain"/>
    </div>
  );
};

export default SignalGo