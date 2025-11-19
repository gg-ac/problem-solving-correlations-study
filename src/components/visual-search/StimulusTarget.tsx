import Target from './images/stimulus_2.svg'


const StimulusTarget: React.FC<{className?:string}> = ({className}) => {
  return (
      <Target className={className + " text-gray-400 dark:text-gray-300 h-full p-2 w-auto object-contain inline"}/>
  );
};

export default StimulusTarget