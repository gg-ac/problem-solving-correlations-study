import Placeholder from './images/stimulus_placeholder.svg'


const StimulusPlaceholder: React.FC = () => {
  return (
    <div className="h-full text-gray-400 dark:text-gray-600">
      <Placeholder className="h-full w-auto max-w-[128px] max-h-[128px] object-contain"/>
    </div>
  );
};

export default StimulusPlaceholder