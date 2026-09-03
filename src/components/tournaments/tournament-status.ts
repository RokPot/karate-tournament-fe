import { CommonModels } from "@/data/common/common.models";

export const TOURNAMENT_STATUS_I18N_KEYS: Record<
  CommonModels.TournamentStatusEnum,
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
