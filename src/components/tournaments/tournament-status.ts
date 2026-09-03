import { CommonModels } from "@/data/common/common.models";

export const TOURNAMENT_STATUS_I18N_KEYS: Record<
  CommonModels.TournamentsFindAllStatusEnum,
  "tournaments.status.pending" | "tournaments.status.approved" | "tournaments.status.declined"
> = {
  pending: "tournaments.status.pending",
  approved: "tournaments.status.approved",
  declined: "tournaments.status.declined",
};

export const isTournamentApproved = (
  tournament: Pick<CommonModels.TournamentResponseDto, "status">,
) => (tournament.status ?? "approved") === "approved";

export const isTournamentPending = (
  tournament: Pick<CommonModels.TournamentResponseDto, "status">,
) => tournament.status === "pending";

export const isTournamentDeclined = (
  tournament: Pick<CommonModels.TournamentResponseDto, "status">,
) => tournament.status === "declined";

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

export const getRegistrationClosedI18nKeys = (
  state: Exclude<RegistrationWindowState, "open">,
) => {
  if (state === "finished") {
    return {
      title: "tournaments.registration.finishedTitle",
      body: "tournaments.registration.finishedBody",
    } as const;
  }
  return {
    title: "tournaments.registration.deadlineClosedTitle",
    body: "tournaments.registration.deadlineClosedBody",
  } as const;
};
