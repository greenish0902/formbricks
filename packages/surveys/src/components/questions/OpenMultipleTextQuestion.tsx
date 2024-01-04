import { BackButton } from "@/components/buttons/BackButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import Headline from "@/components/general/Headline";
import Subheader from "@/components/general/Subheader";
import { useCallback } from "react";

import { TResponseData, TResponseTtc } from "@formbricks/types/responses";
import type { TSurveyOpenMultipleTextQuestion } from "@formbricks/types/surveys";

interface OpenMultipleTextQuestionProps {
  question: TSurveyOpenMultipleTextQuestion;
  value: string[];
  onChange: (responseData: TResponseData) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  onBack: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  // brandColor: string;
  autoFocus?: boolean;
}

export default function OpenMultipleTextQuestion({
  question,
  value,
  onChange,
  onSubmit,
  onBack,
  isFirstQuestion,
  isLastQuestion,
  // brandColor,
  autoFocus = true,
}: OpenMultipleTextQuestionProps) {
  // const handleInputChange = (inputValue: string) => {
  //   // const isValidInput = validateInput(inputValue, question.inputType, question.required);
  //   // setIsValid(isValidInput);
  //   onChange({ [question.id]: inputValue });
  // };
  const openTextRef = useCallback(
    (currentElement: HTMLInputElement | HTMLTextAreaElement | null) => {
      if (currentElement && autoFocus) {
        currentElement.focus();
      }
    },
    [autoFocus]
  );
  value = new Array(question.inputSets.length);

  const handleInputChange = (inputValue: string, index: number) => {
    console.log("inputValue, index :>> ", inputValue, index);
    // value = [...value];
    // value[index] = inputValue;
    onChange({ [question.id]: value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        //  if ( validateInput(value as string, question.inputType, question.required)) {
        //TODO: onSubmit 방법 고민
        onSubmit({ [question.id]: value }, { "": 0 });
        // }
      }}
      className="w-full">
      {question.imageUrl && (
        <div className="my-4 rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={question.imageUrl} alt="question-image" className={"my-4 rounded-md"} />
        </div>
      )}
      <Headline headline={question.headline} questionId={question.id} required={question.required} />

      {question.inputSets.length > 1 &&
        question.inputSets.map((inputSet, inputSetIdx) => (
          <>
            <div className="mt-3"></div>
            <Subheader subheader={inputSet.subheader} questionId={inputSet.id} />
            <div className="mt-4">
              {inputSet.longAnswer === false ? (
                <input
                  ref={openTextRef}
                  tabIndex={1}
                  placeholder={inputSet.placeholder}
                  required={question.required}
                  type={inputSet.inputType}
                  value={value[inputSetIdx]}
                  onInput={(e) => handleInputChange(e.currentTarget.value, inputSetIdx)}
                  autoFocus={autoFocus}
                  pattern={inputSet.inputType === "phone" ? "[+][0-9 ]+" : ".*"}
                  title={inputSet.inputType === "phone" ? "Enter a valid phone number" : undefined}
                  className={`block w-full rounded-md border
         border-slate-100
         bg-slate-50 p-2 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-0 sm:text-sm`}
                />
              ) : (
                <textarea
                  ref={openTextRef}
                  rows={3}
                  tabIndex={1}
                  placeholder={inputSet.placeholder}
                  required={question.required}
                  type={inputSet.inputType}
                  value={value[inputSetIdx]}
                  onInput={(e) => handleInputChange(e.currentTarget.value, inputSetIdx)}
                  autoFocus={autoFocus}
                  pattern={inputSet.inputType === "phone" ? "[+][0-9 ]+" : ".*"}
                  title={inputSet.inputType === "phone" ? "Please enter a valid phone number" : undefined}
                  className={`block w-full rounded-md border
        border-slate-100
        bg-slate-50 p-2 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-0 sm:text-sm`}></textarea>
              )}
            </div>
          </>
        ))}

      <div className="mt-4 flex w-full justify-between">
        {!isFirstQuestion && (
          <BackButton
            backButtonLabel={question.backButtonLabel}
            onClick={() => {
              onBack();
            }}
          />
        )}
        <div></div>
        <SubmitButton
          buttonLabel={question.buttonLabel}
          isLastQuestion={isLastQuestion}
          // brandColor={brandColor}
          onClick={() => {}}
        />
      </div>
    </form>
  );
}
