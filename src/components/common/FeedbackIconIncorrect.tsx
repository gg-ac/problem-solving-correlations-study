import Cross from './images/icon_cross.svg'


const FeedbackIconIncorrect: React.FC = () => {
  return (
    <div className="flex items-center justify-center text-gray-400 dark:text-gray-600">
      <Cross className="w-full h-full max-w-[92px] max-h-[92px] object-contain"/>
    </div>
  );
};

export default FeedbackIconIncorrect