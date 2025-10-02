import Target from './images/stimulus_2.svg'


const StimulusTarget: React.FC = () => {
  return (
    <div className="h-full text-gray-400 dark:text-gray-300">
      <Target className="h-full w-auto max-w-[128px] max-h-[128px] object-contain"/>
    </div>
  );
};

export default StimulusTarget