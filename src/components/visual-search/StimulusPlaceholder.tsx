import Placeholder from './images/stimulus_placeholder.svg'


const StimulusPlaceholder: React.FC<{className?:string}> = ({className}) => {
  return (
      <Placeholder className={className + " text-gray-400 dark:text-gray-300 h-full p-2 w-auto object-contain inline"}/>
  );
};

export default StimulusPlaceholder