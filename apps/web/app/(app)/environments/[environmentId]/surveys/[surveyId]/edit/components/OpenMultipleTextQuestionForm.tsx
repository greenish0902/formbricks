"use client";

import QuestionFormInput from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/edit/components/QuestionFormInput";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { createId } from "@paralleldrive/cuid2";

import {
  TSurvey,
  TSurveyOpenMultipleTextQuestion,
  TSurveyOpenTextQuestionInputType,
} from "@formbricks/types/surveys";
import { Input } from "@formbricks/ui/Input";
import { Label } from "@formbricks/ui/Label";
import { QuestionTypeSelectorForMultiple } from "@formbricks/ui/QuestionTypeSelector";

const questionTypes = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "url", label: "URL" },
  { value: "number", label: "Number" },
  { value: "phone", label: "Phone" },
  { value: "password", label: "비밀번호" },
];

interface OpenMultipleTextQuestionFormProps {
  localSurvey: TSurvey;
  question: TSurveyOpenMultipleTextQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
  lastQuestion: boolean;
  isInValid: boolean;
}

export default function OpenMultipleTextQuestionForm({
  question,
  questionIdx,
  updateQuestion,
  isInValid,
  localSurvey,
}: OpenMultipleTextQuestionFormProps): JSX.Element {
  const defaultPlaceholder = (index) => {
    getPlaceholderByInputType(question.inputSets[index].inputType ?? "text");
  };

  const environmentId = localSurvey.environmentId;

  const addInputSet = () => {
    const newInputSets = question.inputSets;
    const newInputSet = {
      id: createId(),
      subheader: "subheader",
      inputType: "text" as TSurveyOpenTextQuestionInputType,
      placeholder: "placeholder",
      longAnswer: false,
    };
    newInputSets.push(newInputSet);
    updateQuestion(questionIdx, { inputSets: newInputSets });
  };

  const deleteInputSet = (deleteIdx: number) => {
    const newInputSets = !question.inputSets ? [] : question.inputSets.filter((_, idx) => idx !== deleteIdx);

    updateQuestion(questionIdx, { inputSets: newInputSets });
  };

  const updateSubheader = (changeIdx: number, updatedAttributes: { subheader: string }) => {
    let newInputSets: any[] = [];
    if (question.inputSets) {
      newInputSets = question.inputSets.map((inputSet, idx) => {
        if (idx !== changeIdx) return inputSet;
        return { ...inputSet, ...updatedAttributes };
      });
    }
    updateQuestion(questionIdx, { inputSets: newInputSets });
  };

  const updatePlaceholder = (changeIdx: number, updatedAttributes: { placeholder: string }) => {
    let newInputSets: any[] = [];
    if (question.inputSets) {
      newInputSets = question.inputSets.map((inputSet, idx) => {
        if (idx !== changeIdx) return inputSet;
        return { ...inputSet, ...updatedAttributes };
      });
    }
    updateQuestion(questionIdx, { inputSets: newInputSets });
  };

  const handleInputChange = (changeIdx: number, inputType: TSurveyOpenTextQuestionInputType) => {
    const updatedAttributes = {
      subheader: "subheader",
      inputType: inputType,
      placeholder: getPlaceholderByInputType(inputType ?? "text"),
      longAnswer: false,
    };

    let newInputSets: any[] = [];
    if (question.inputSets) {
      newInputSets = question.inputSets.map((inputSet, idx) => {
        if (idx !== changeIdx) return inputSet;
        return { ...inputSet, ...updatedAttributes };
      });
    }

    updateQuestion(questionIdx, { inputSets: newInputSets });
  };

  return (
    <form>
      <QuestionFormInput
        environmentId={environmentId}
        isInValid={isInValid}
        question={question}
        questionIdx={questionIdx}
        updateQuestion={updateQuestion}
      />
      {/* TODO: showSubheader */}
      {question.inputSets &&
        question.inputSets.length >= 1 &&
        question.inputSets.map((inputSet, inputSetIdx) => (
          <>
            <div className="my-5 flex flex-row rounded-md border border-black p-4">
              <div className="my-3 w-full">
                <Label htmlFor="subheader">Description</Label>
                <div className="mb-4 mt-2 inline-flex w-full items-center">
                  <Input
                    id="subheader"
                    name="subheader"
                    value={inputSet.subheader}
                    onChange={(e) => updateSubheader(inputSetIdx, { subheader: e.target.value })}
                  />
                </div>
                <Label htmlFor="placeholder">Placeholder</Label>
                <div className="my-3">
                  <Input
                    id="placeholder"
                    name="placeholder"
                    value={inputSet.placeholder! ?? defaultPlaceholder}
                    onChange={(e) => updatePlaceholder(inputSetIdx, { placeholder: e.target.value })}
                  />
                </div>

                {/* TODO: Fix InputType Bar */}
                {/* Add a dropdown to select the question type */}
                <div className="my-3">
                  <Label htmlFor="questionType">Input Type</Label>
                  <div className="mt-2 flex items-center">
                    <QuestionTypeSelectorForMultiple
                      currentIdx={inputSetIdx}
                      questionTypes={questionTypes}
                      currentType={inputSet.inputType}
                      handleTypeChange={handleInputChange} // Use the merged function
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row">
                {question.inputSets.length > 2 && (
                  <div className="ml-2 mt-5 h-6 w-6">
                    <TrashIcon
                      className="ml-2 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
                      onClick={() => deleteInputSet(inputSetIdx)}
                    />
                  </div>
                )}
                <div className="ml-2 mt-4 h-6 w-6">
                  <PlusIcon
                    className="h-full w-full cursor-pointer text-slate-400 hover:text-slate-500"
                    onClick={() => addInputSet()}
                  />
                </div>
              </div>
            </div>
          </>
        ))}
    </form>
  );
}

function getPlaceholderByInputType(inputType: TSurveyOpenTextQuestionInputType) {
  switch (inputType) {
    case "email":
      return "example@email.com";
    case "url":
      return "http://...";
    case "number":
      return "42";
    case "phone":
      return "+1 123 456 789";
    default:
      return "Type your answer here...";
  }
}
