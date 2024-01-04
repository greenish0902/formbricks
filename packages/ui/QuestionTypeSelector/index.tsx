import {
  ChatBubbleBottomCenterTextIcon,
  EnvelopeIcon,
  HashtagIcon,
  LinkIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import React from "react";

interface TOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface QuestionTypeSelectorProps {
  options: TOption[];
  currentOption: string | undefined;
  handleTypeChange: (value: string) => void;
}

interface TSurveyQuestionType {
  value: string;
  label: string;
}

interface QuestionMultipleTypeSelectorProps {
  currentIdx: number;
  questionTypes: TSurveyQuestionType[];
  currentType: string | undefined;
  handleTypeChange: (changeIdx: number, value: string) => void;
}

export function OptionsSwitcher({
  options: questionTypes,
  currentOption,
  handleTypeChange,
}: QuestionTypeSelectorProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-md border p-1">
      {questionTypes.map((type) => (
        <div
          key={type.value}
          onClick={() => handleTypeChange(type.value)}
          className={`flex-grow cursor-pointer rounded-md bg-${
            (currentOption === undefined && type.value === "text") || currentOption === type.value
              ? "slate-100"
              : "white"
          } p-2 text-center`}>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-slate-900">{type.label}</span>
            {type.icon ? (
              <div className="h-4 w-4 text-slate-600 hover:text-slate-800">{type.icon}</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

const typeIcons: { [key: string]: React.ReactNode } = {
  text: <ChatBubbleBottomCenterTextIcon />,
  email: <EnvelopeIcon />,
  url: <LinkIcon />,
  number: <HashtagIcon />,
  phone: <PhoneIcon />,
};

//for OpenMultipleText
export function QuestionTypeSelectorForMultiple({
  currentIdx,
  questionTypes,
  currentType,
  handleTypeChange,
}: QuestionMultipleTypeSelectorProps): JSX.Element {
  return (
    <div className="flex w-full items-center justify-between rounded-md border p-1">
      {questionTypes.map((type) => (
        <div
          key={type.value}
          onClick={() => handleTypeChange(currentIdx, type.value)}
          className={`flex-grow cursor-pointer rounded-md bg-${
            (currentType === undefined && type.value === "text") || currentType === type.value
              ? "slate-100"
              : "white"
          } p-2 text-center`}>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-slate-900">{type.label}</span>
            <div className="h-4 w-4 text-slate-600 hover:text-slate-800">
              {typeIcons[type.value] ?? typeIcons["number"]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
