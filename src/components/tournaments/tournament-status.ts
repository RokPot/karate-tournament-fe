import { CommonModels } from "@/data/common/common.models";
import { TournamentsModels } from "@/data/tournaments/tournaments.models";

type TournamentStatus = CommonModels.TournamentsFindAllStatusEnum;
type PublicLiteStatus = TournamentsModels.TournamentPublicLiteStatusEnum;

type TournamentWithStatus = {
  status?: TournamentStatus | PublicLiteStatus | null;
};

export const TOURNAMENT_STATUS_I18N_KEYS: Record<
  TournamentStatus,
  | "tournaments.status.pending"
  | "tournaments.status.approved"
  | "tournaments.status.declined"
  | "tournaments.status.in_progress"
  | "tournaments.status.ended"
> = {
  pending: "tournaments.status.pending",
  approved: "tournaments.status.approved",
  declined: "tournaments.status.declined",
  in_progress: "tournaments.status.in_progress",
  ended: "tournaments.status.ended",
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

export type RegistrationClosedI18nKeys = {
  title:
    | "tournaments.registration.closedTitle"
    | "tournaments.registration.finishedTitle"
    | "tournaments.registration.deadlineClosedTitle"
    | "tournaments.registration.inProgressTitle"
    | "tournaments.registration.endedTitle";
  body:
    | "tournaments.registration.closedBody"
    | "tournaments.registration.finishedBody"
    | "tournaments.registration.deadlineClosedBody"
    | "tournaments.registration.inProgressBody"
    | "tournaments.registration.endedBody";
};

export const getRegistrationClosedI18nKeys = (
  state: Exclude<RegistrationWindowState, "open">,
): RegistrationClosedI18nKeys => {
  if (state === "finished") {
    return {
      title: "tournaments.registration.finishedTitle",
      body: "tournaments.registration.finishedBody",
    };
  }
  return {
    title: "tournaments.registration.deadlineClosedTitle",
    body: "tournaments.registration.deadlineClosedBody",
  };
};

export const getTournamentRegistrationClosedCopy = (
  tournament: TournamentWithStatus & {
    startDate: string;
    registrationDeadline: string;
  },
): RegistrationClosedI18nKeys | null => {
  if (isTournamentInProgress(tournament)) {
    return {
      title: "tournaments.registration.inProgressTitle",
      body: "tournaments.registration.inProgressBody",
    };
  }
  if (isTournamentEnded(tournament)) {
    return {
      title: "tournaments.registration.endedTitle",
      body: "tournaments.registration.endedBody",
    };
  }
  if (!isTournamentApproved(tournament)) {
    return null;
  }
  const windowState = getRegistrationWindowState(tournament);
  if (windowState === "open") {
    return null;
  }
  return getRegistrationClosedI18nKeys(windowState);
};
