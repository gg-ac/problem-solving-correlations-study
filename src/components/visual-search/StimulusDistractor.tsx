import Distractor from './images/stimulus_5.svg'


const StimulusDistractor: React.FC<{className?:string}> = ({className}) => {
  return (
    <Distractor className={className + " text-gray-400 dark:text-gray-300 h-full p-2 w-auto object-contain inline"}/>
  );
};

export default StimulusDistractor