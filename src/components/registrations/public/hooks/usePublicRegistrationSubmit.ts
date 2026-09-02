import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/components/ui/status/Toast/useToast";
import { CommonModels } from "@/data/common/common.models";
import { RegistrationsQueries } from "@/data/registrations/registrations.queries";

import { mapToBulkDto } from "../utils/mapToBulkDto";
import type {
  BulkRegistrationResponse,
  CoachDetails,
  DraftParticipant,
  DraftTeam,
} from "../types";

interface UsePublicRegistrationSubmitOptions {
  onSuccess?: (data: BulkRegistrationResponse) => void;
}

export function usePublicRegistrationSubmit(
  tournamentId: string,
  options?: UsePublicRegistrationSubmitOptions,
) {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();
  const [results, setResults] = useState<BulkRegistrationResponse | null>(null);

  const mutation = RegistrationsQueries.useBulkCreateWithCoach({
    onSuccess: (data) => {
      setResults(data);
      const failedCount = data.results.filter((item) => !item.success).length;
      if (failedCount === 0) {
        successToast({ text: t("registrations.public.submitSuccess") });
      } else {
        successToast({ text: t("registrations.public.submitPartial") });
      }
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      errorToast({
        text: error?.message ?? t("registrations.public.submitError"),
      });
    },
  });

  const submit = useCallback(
    (
      coach: CoachDetails,
      participants: DraftParticipant[],
      teams: DraftTeam[] = [],
      tournamentCategories: CommonModels.CategoryResponseDto[] = [],
    ) => {
      const payload = mapToBulkDto(
        tournamentId,
        coach,
        participants,
        teams,
        tournamentCategories,
      );
      mutation.mutate({ data: payload });
    },
    [mutation, tournamentId],
  );

  const resetResults = useCallback(() => {
    setResults(null);
  }, []);

  return {
    submit,
    results,
    resetResults,
    isSubmitting: mutation.isPending,
  };
}
