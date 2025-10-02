import Distractor from './images/stimulus_5.svg'


const StimulusDistractor: React.FC = () => {
  return (
    <div className="h-full text-gray-400 dark:text-gray-300">
      <Distractor className="h-full w-auto max-w-[128px] max-h-[128px] object-contain"/>
    </div>
  );
};

export default StimulusDistractor