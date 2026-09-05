import { useToast } from "@/components/ui/status/Toast/useToast";
import { QueryModule } from "@/data/invalidateQueries";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { useTranslation } from "react-i18next";

export const useTournamentLifecycle = () => {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();

  const start = TournamentsQueries.useStart({
    invalidateCurrentModule: true,
    invalidateModules: [QueryModule.Clubs],
    onSuccess: () => {
      successToast({ text: t("tournaments.lifecycle.startSuccess") });
    },
    onError: (error) => {
      errorToast({
        text: error?.message || t("tournaments.lifecycle.startError"),
      });
    },
  });

  const end = TournamentsQueries.useEnd({
    invalidateCurrentModule: true,
    invalidateModules: [QueryModule.Clubs],
    onSuccess: () => {
      successToast({ text: t("tournaments.lifecycle.endSuccess") });
    },
    onError: (error) => {
      errorToast({
        text: error?.message || t("tournaments.lifecycle.endError"),
      });
    },
  });

  return {
    start,
    end,
    isLifecyclePending: start.isPending || end.isPending,
  };
};
