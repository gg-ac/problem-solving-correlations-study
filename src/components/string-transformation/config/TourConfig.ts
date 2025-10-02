import { StepType } from "@reactour/tour";

export interface CustomStepType extends StepType {
  id?: string;
}


export const stringTransformationInstructionSteps: CustomStepType[] = [
  {
    selector: '#level',
    content: 'In this task, you will use rules to change a sequence of symbols so that it matches another sequence of symbols',

  },
  {
    selector: '#state-string',
    content: 'This is the sequence of symbols you will change',
  },
  {
    selector: '#goal-string',
    content: 'And this is the goal sequence you will try to match',
  },
  {
    selector: '#rules',
    content: 'You can change the symbols using the "transformation rules" shown here',
  },
  {
    selector: '#rules-0-lhs',
    content: 'Each rule has an input pattern, on the left side of the arrow...',
  },
  {
    selector: '#rules-0-rhs',
    content: '...and an output pattern, on the right of the arrow',
  },
  {
    selector: '#level',
    content: 'Let\'s try using a rule',
  },
  {
    id: "rule-select",
    selector: '#rules-0',
    content: 'Click this rule to select it',
    disableActions: true,
  },
  {
    selector: '#state-string-1',
    highlightedSelectors: ['#state-string-1', '#state-string-2'],
    content: 'These symbols match the input to the selected rule...',
    disableActions: true,
    position: 'right'
  },
  {
    id: "symbol-select",
    selector: '#state-string-1',
    highlightedSelectors: ['#state-string-1'],
    content: '...so select the start of the matching symbol pair to apply the rule here',
    disableActions: true,
    position: 'right'
  },
  {
    selector: '#state-string',
    content: 'The symbol sequence changed and got a little closer to the goal',
    disableActions: false,
  },
  {
    selector: '#level',
    content: 'You can keep using rules to change the symbol sequence to match the goal sequence',
    disableActions: false,
  },
  {
    id: "try-undo",
    selector: '#button-undo',
    content: 'If you want to undo the last transformation, press the undo button',
    disableActions: false,
  },
  {
    id: "try-reset",
    selector: '#button-reset',
    content: 'If you want to reset the puzzle and try again, press the reset button',
    disableActions: false,
  },
  {
    selector: '#level',
    content: 'Keep using the rules to solve this practice puzzle.',
    disableActions: false,
  },
  {
    selector: '#level',
    content: 'After you solve this practice puzzle, you will progress to the real puzzles. Try to solve them quickly and in the smallest number of steps possible. Your time will be limited. Good luck!',
    disableActions: false,
  },
];
