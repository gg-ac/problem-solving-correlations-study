import React from 'react';
import UndoIcon from './ui/undo_icon.svg'

interface ButtonProps {
  onClick: () => void;
}
const UndoButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
      <div
        onClick={onClick}
        className='flex m-1 items-center justify-center aspect-square button bg-teal-500 rounded-lg cursor-pointer select-none
      active:translate-y-2 active:[box-shadow:0_0rem_0_0_#0f766e,0_0_0_0.125rem_#00000055] sm:active:[box-shadow:0_0rem_0_0_#0f766e,0_0_0_0.25rem_#00000055]
      active:border-b-0 [box-shadow:0_0.35rem_0_0_#0f766e,0_0.35rem_0_0.125rem_#00000033] sm:[box-shadow:0_0.5rem_0_0_#0f766e,0_0.5rem_0_0.25rem_#00000033]
      border-b-2 border-teal-400
      grow shrink
      min-w-4 min-h-4 max-w-16 max-h-16'
      >
        <UndoIcon className="flex stretch grow shrink max-w-[75%] max-h-[75%]" />
      </div>
  );
};

export default UndoButton;
