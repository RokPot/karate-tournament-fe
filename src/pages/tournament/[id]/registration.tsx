import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  PublicRegistrationWizard,
  RegistrationIntro,
  RegistrationPageHeader,
} from "@/components/registrations/public";
import { useRegistrationDraft } from "@/components/registrations/public/hooks/useRegistrationDraft";
import type { RegistrantMode } from "@/components/registrations/public/types";
import { loadRegistrationDraft } from "@/components/registrations/public/utils/registrationDraftStorage";
import {
  clearRegistrationUrl,
  parseRegistrationUrlQuery,
  pushRegistrationStep,
  replaceRegistrationStep,
} from "@/components/registrations/public/utils/registrationUrl";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import {
  getTournamentRegistrationClosedCopy,
  isTournamentRegistrationOpen,
  RegistrationClosedCopy,
} from "@/components/tournaments/tournament-status";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { ApplicationException } from "@/util/vendor/error-handling";

const isRetryableError = (error: unknown) =>
  error instanceof ApplicationException &&
  (error.code === "NETWORK_ERROR" ||
    error.code === "INTERNAL_ERROR" ||
    error.code === "CANCELED_ERROR");

const RegistrationClosedMessage = ({
  copy,
}: {
  copy: RegistrationClosedCopy;
}) => (
  <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 p-10 text-center">
    <Typography size="h3">{copy.title}</Typography>
    <Typography size="body-paragraph-m" className="text-neutral-200">
      {copy.body}
    </Typography>
  </div>
);

const RegistrationPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const tournamentId =
    typeof router.query.id === "string" ? router.query.id : "";
  const urlState = parseRegistrationUrlQuery(router.query);
  const draftBag = useRegistrationDraft(tournamentId);

  const {
    data: tournament,
    isLoading,
    error,
    refetch,
  } = TournamentsQueries.useFindOnePublic(
    { id: tournamentId },
    { enabled: !!tournamentId },
  );

  // Normalize: step without mode → intro; mode without step → contact
  useEffect(() => {
    if (!router.isReady || !tournamentId) {
      return;
    }
    const stepRaw = router.query.step;
    if (stepRaw && !urlState.mode) {
      clearRegistrationUrl(router, tournamentId);
      return;
    }
    if (urlState.mode && !stepRaw) {
      replaceRegistrationStep(
        router,
        tournamentId,
        urlState.mode,
        "contact",
      );
    }
    // Persist mode when in an active wizard step (not results)
    if (urlState.mode && urlState.step && urlState.step !== "results") {
      draftBag.persistMode(urlState.mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync to query only
  }, [
    router.isReady,
    tournamentId,
    router.query.mode,
    router.query.step,
    urlState.mode,
    urlState.step,
  ]);

  if (!tournamentId || isLoading || !router.isReady || !draftBag.hydrated) {
    return <LoadingState />;
  }

  const notOpenCopy = {
    title: t("tournaments.registration.closedTitle"),
    body: t("tournaments.registration.closedBody"),
  };

  if (error || !tournament) {
    if (isRetryableError(error)) {
      return <ErrorState error={error} onRetry={() => refetch()} />;
    }

    return <RegistrationClosedMessage copy={notOpenCopy} />;
  }

  const canRegister = isTournamentRegistrationOpen(tournament);
  const closedCopy =
    getTournamentRegistrationClosedCopy(tournament, t) ?? notOpenCopy;

  const handleStartRegistration = (mode: RegistrantMode) => {
    const stored = loadRegistrationDraft(tournamentId);
    if (stored?.mode && stored.mode !== mode) {
      // Switching path: keep contact/participants if any; update mode
    }
    draftBag.persistMode(mode);
    pushRegistrationStep(router, tournamentId, mode, "contact");
  };

  if (!urlState.mode || !urlState.step) {
    return (
      <RegistrationIntro
        tournament={tournament}
        canRegister={canRegister}
        closedCopy={canRegister ? null : closedCopy}
        onStartRegistration={handleStartRegistration}
      />
    );
  }

  if (!canRegister) {
    return <RegistrationClosedMessage copy={closedCopy} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <RegistrationPageHeader tournament={tournament} />
      <PublicRegistrationWizard
        tournamentId={tournamentId}
        registrantMode={urlState.mode}
        step={urlState.step}
        draftBag={draftBag}
      />
    </div>
  );
};

export default RegistrationPage;
