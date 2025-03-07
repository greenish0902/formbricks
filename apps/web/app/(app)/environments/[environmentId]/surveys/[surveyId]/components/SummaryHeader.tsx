"use client";

import LinkSurveyShareButton from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/components/LinkModalButton";
import SuccessMessage from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/components/SuccessMessage";
import SurveyStatusDropdown from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/components/SurveyStatusDropdown";
import { updateSurveyAction } from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/edit/actions";
import { EllipsisHorizontalIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getAccessFlags } from "@formbricks/lib/membership/utils";
import { TEnvironment } from "@formbricks/types/environment";
import { TMembershipRole } from "@formbricks/types/memberships";
import { TProduct } from "@formbricks/types/product";
import { TSurvey } from "@formbricks/types/surveys";
import { TUser } from "@formbricks/types/user";
import { Button } from "@formbricks/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@formbricks/ui/DropdownMenu";
import { SurveyStatusIndicator } from "@formbricks/ui/SurveyStatusIndicator";

interface SummaryHeaderProps {
  surveyId: string;
  environment: TEnvironment;
  survey: TSurvey;
  webAppUrl: string;
  product: TProduct;
  user: TUser;
  membershipRole?: TMembershipRole;
}
const SummaryHeader = ({
  surveyId,
  environment,
  survey,
  webAppUrl,
  product,
  user,
  membershipRole,
}: SummaryHeaderProps) => {
  const router = useRouter();

  const isCloseOnDateEnabled = survey.closeOnDate !== null;
  const closeOnDate = survey.closeOnDate ? new Date(survey.closeOnDate) : null;
  const isStatusChangeDisabled = (isCloseOnDateEnabled && closeOnDate && closeOnDate < new Date()) ?? false;
  const { isViewer } = getAccessFlags(membershipRole);
  return (
    <div className="mb-11 mt-6 flex flex-wrap items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-slate-800">{survey.name}</p>
        <span className="text-base font-extralight text-slate-600">{product.name}</span>
      </div>
      <div className="hidden justify-end gap-x-1.5 sm:flex">
        {survey.type === "link" && (
          <LinkSurveyShareButton survey={survey} webAppUrl={webAppUrl} product={product} user={user} />
        )}
        {!isViewer &&
        (environment?.widgetSetupCompleted || survey.type === "link") &&
        survey?.status !== "draft" ? (
          <SurveyStatusDropdown environment={environment} survey={survey} />
        ) : null}
        {!isViewer && (
          <Button
            variant="darkCTA"
            className="h-full w-full px-3 lg:px-6"
            href={`/environments/${environment.id}/surveys/${surveyId}/edit`}>
            Edit
            <PencilSquareIcon className="ml-1 h-4" />
          </Button>
        )}
      </div>
      <div className="block sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary" className="h-full w-full rounded-md p-2">
              <EllipsisHorizontalIcon className="h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2">
            {survey.type === "link" && (
              <>
                <LinkSurveyShareButton
                  className="flex w-full justify-center p-1"
                  survey={survey}
                  webAppUrl={webAppUrl}
                  product={product}
                  user={user}
                />
                <DropdownMenuSeparator />
              </>
            )}
            {(environment?.widgetSetupCompleted || survey.type === "link") && survey?.status !== "draft" ? (
              <>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    disabled={isStatusChangeDisabled}
                    style={isStatusChangeDisabled ? { pointerEvents: "none", opacity: 0.5 } : {}}>
                    <div className="flex items-center">
                      {(survey.type === "link" || environment.widgetSetupCompleted) && (
                        <SurveyStatusIndicator status={survey.status} />
                      )}
                      <span className="ml-1 text-sm text-slate-700">
                        {survey.status === "inProgress" && "In-progress"}
                        {survey.status === "paused" && "Paused"}
                        {survey.status === "completed" && "Completed"}
                      </span>
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={survey.status}
                        onValueChange={(value) => {
                          const castedValue = value as "draft" | "inProgress" | "paused" | "completed";
                          updateSurveyAction({ ...survey, status: castedValue })
                            .then(() => {
                              toast.success(
                                value === "inProgress"
                                  ? "Survey live"
                                  : value === "paused"
                                    ? "Survey paused"
                                    : value === "completed"
                                      ? "Survey completed"
                                      : ""
                              );
                              router.refresh();
                            })
                            .catch((error) => {
                              toast.error(`Error: ${error.message}`);
                            });
                        }}>
                        <DropdownMenuRadioItem
                          value="inProgress"
                          className="cursor-pointer break-all text-slate-600">
                          In-progress
                        </DropdownMenuRadioItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioItem
                          value="paused"
                          className="cursor-pointer break-all text-slate-600">
                          Paused
                        </DropdownMenuRadioItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioItem
                          value="completed"
                          className="cursor-pointer break-all text-slate-600">
                          Completed
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
              </>
            ) : null}
            <Button
              variant="darkCTA"
              size="sm"
              className="flex h-full w-full justify-center px-3 lg:px-6"
              href={`/environments/${environment.id}/surveys/${surveyId}/edit`}>
              Edit
              <PencilSquareIcon className="ml-1 h-4" />
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <SuccessMessage
        environment={environment}
        survey={survey}
        webAppUrl={webAppUrl}
        product={product}
        user={user}
      />
    </div>
  );
};

export default SummaryHeader;
