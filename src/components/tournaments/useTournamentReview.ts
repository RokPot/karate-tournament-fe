import { useToast } from "@/components/ui/status/Toast/useToast";
import { QueryModule } from "@/data/invalidateQueries";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { useTranslation } from "react-i18next";

export const useTournamentReview = () => {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();

  const approve = TournamentsQueries.useApprove({
    invalidateCurrentModule: true,
    invalidateModules: [QueryModule.Clubs],
    onSuccess: () => {
      successToast({ text: t("tournaments.review.approveSuccess") });
    },
    onError: (error) => {
      errorToast({ text: error?.message || t("tournaments.review.approveError") });
    },
  });

  const decline = TournamentsQueries.useDecline({
    invalidateCurrentModule: true,
    invalidateModules: [QueryModule.Clubs],
    onSuccess: () => {
      successToast({ text: t("tournaments.review.declineSuccess") });
    },
    onError: (error) => {
      errorToast({ text: error?.message || t("tournaments.review.declineError") });
    },
  });

  const resubmit = TournamentsQueries.useResubmit({
    invalidateCurrentModule: true,
    invalidateModules: [QueryModule.Clubs],
    onSuccess: () => {
      successToast({ text: t("tournaments.review.resubmitSuccess") });
    },
    onError: (error) => {
      errorToast({ text: error?.message || t("tournaments.review.resubmitError") });
    },
  });

  return {
    approve,
    decline,
    resubmit,
    isReviewPending: approve.isPending || decline.isPending || resubmit.isPending,
  };
};
