import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import {
  PublicRegistrationWizard,
  RegistrationPageHeader,
} from "@/components/registrations/public";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import {
  getRegistrationClosedI18nKeys,
  getRegistrationWindowState,
} from "@/components/tournaments/tournament-status";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { ApplicationException } from "@/util/vendor/error-handling";

const isRetryableError = (error: unknown) =>
  error instanceof ApplicationException &&
  (error.code === "NETWORK_ERROR" ||
    error.code === "INTERNAL_ERROR" ||
    error.code === "CANCELED_ERROR");

type RegistrationClosedCopy = {
  title:
    | "tournaments.registration.closedTitle"
    | "tournaments.registration.finishedTitle"
    | "tournaments.registration.deadlineClosedTitle";
  body:
    | "tournaments.registration.closedBody"
    | "tournaments.registration.finishedBody"
    | "tournaments.registration.deadlineClosedBody";
};

const RegistrationClosedMessage = ({ copy }: { copy: RegistrationClosedCopy }) => {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 p-10 text-center">
      <Typography size="h3">{t(copy.title)}</Typography>
      <Typography size="body-paragraph-m" className="text-secondary-200">
        {t(copy.body)}
      </Typography>
    </div>
  );
};

const RegistrationPage = () => {
  const router = useRouter();
  const tournamentId = router.query.id as string;

  const {
    data: tournament,
    isLoading,
    error,
    refetch,
  } = TournamentsQueries.useFindOnePublic(
    { id: tournamentId },
    { enabled: !!tournamentId },
  );

  if (!tournamentId || isLoading) {
    return <LoadingState />;
  }

  if (error || !tournament) {
    if (isRetryableError(error)) {
      return <ErrorState error={error} onRetry={() => refetch()} />;
    }

    return (
      <RegistrationClosedMessage
        copy={{
          title: "tournaments.registration.closedTitle",
          body: "tournaments.registration.closedBody",
        }}
      />
    );
  }

  const windowState = getRegistrationWindowState(tournament);
  if (windowState !== "open") {
    return (
      <RegistrationClosedMessage
        copy={getRegistrationClosedI18nKeys(windowState)}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col ">
      <RegistrationPageHeader tournament={tournament} />
      <PublicRegistrationWizard tournamentId={tournamentId} />
    </div>
  );
};

export default RegistrationPage;
