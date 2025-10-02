import Tick from './images/icon_tick.svg'


const FeedbackIconCorrect: React.FC = () => {
  return (
    <div className="flex items-center justify-center text-gray-400 dark:text-gray-300">
      <Tick className="w-full h-full max-w-[92px] max-h-[92px] object-contain"/>
    </div>
  );
};

export default FeedbackIconCorrect