import type { TFunction } from "i18next";

import { CommonModels } from "@/data/common/common.models";
import { TournamentsModels } from "@/data/tournaments/tournaments.models";

type TournamentStatus = CommonModels.TournamentsFindAllStatusEnum;
type PublicLiteStatus = TournamentsModels.TournamentPublicLiteStatusEnum;

type TournamentWithStatus = {
  status?: TournamentStatus | PublicLiteStatus | null;
};

export const isTournamentApproved = (tournament: TournamentWithStatus) =>
  (tournament.status ?? "approved") === "approved";

export const isTournamentPending = (tournament: TournamentWithStatus) =>
  tournament.status === "pending";

export const isTournamentDeclined = (tournament: TournamentWithStatus) =>
  tournament.status === "declined";

export const isTournamentInProgress = (tournament: TournamentWithStatus) =>
  tournament.status === "in_progress";

export const isTournamentEnded = (tournament: TournamentWithStatus) =>
  tournament.status === "ended";

export type RegistrationWindowState = "open" | "finished" | "deadlinePassed";

export const getRegistrationWindowState = (tournament: {
  startDate: string;
  registrationDeadline: string;
}): RegistrationWindowState => {
  const now = Date.now();
  const start = new Date(tournament.startDate).getTime();
  if (!Number.isNaN(start) && now >= start) {
    return "finished";
  }
  const deadline = new Date(tournament.registrationDeadline).getTime();
  if (!Number.isNaN(deadline) && now >= deadline) {
    return "deadlinePassed";
  }
  return "open";
};

export const isRegistrationWindowOpen = (tournament: {
  startDate: string;
  registrationDeadline: string;
}) => getRegistrationWindowState(tournament) === "open";

export const isTournamentRegistrationOpen = (
  tournament: TournamentWithStatus & {
    startDate: string;
    registrationDeadline: string;
  },
) => isTournamentApproved(tournament) && isRegistrationWindowOpen(tournament);

export type RegistrationClosedCopy = {
  title: string;
  body: string;
};

const getDateWindowClosedCopy = (
  state: Exclude<RegistrationWindowState, "open">,
  t: TFunction,
): RegistrationClosedCopy => {
  if (state === "finished") {
    return {
      title: t("tournaments.registration.finishedTitle"),
      body: t("tournaments.registration.finishedBody"),
    };
  }
  return {
    title: t("tournaments.registration.deadlineClosedTitle"),
    body: t("tournaments.registration.deadlineClosedBody"),
  };
};

export const getTournamentRegistrationClosedCopy = (
  tournament: TournamentWithStatus & {
    startDate: string;
    registrationDeadline: string;
  },
  t: TFunction,
): RegistrationClosedCopy | null => {
  if (isTournamentInProgress(tournament)) {
    return {
      title: t("tournaments.registration.inProgressTitle"),
      body: t("tournaments.registration.inProgressBody"),
    };
  }
  if (isTournamentEnded(tournament)) {
    return {
      title: t("tournaments.registration.endedTitle"),
      body: t("tournaments.registration.endedBody"),
    };
  }
  if (!isTournamentApproved(tournament)) {
    return null;
  }
  const windowState = getRegistrationWindowState(tournament);
  if (windowState === "open") {
    return null;
  }
  return getDateWindowClosedCopy(windowState, t);
};
