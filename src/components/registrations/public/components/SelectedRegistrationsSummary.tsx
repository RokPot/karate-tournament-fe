import Pill from "@/components/ui/Pill";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { useTranslation } from "react-i18next";

import {
  getParticipantLabel,
  getParticipantsWithSelections,
  getRegistrationsGroupedByCategory,
} from "../utils/registrationValidation";
import { isTeamCategory } from "../utils/teamOverlap";
import type { DraftParticipant, DraftTeam } from "../types";

interface SelectedRegistrationsSummaryProps {
  participants: DraftParticipant[];
  tournamentCategories: CommonModels.CategoryResponseDto[];
  teams?: DraftTeam[];
  compact?: boolean;
  groupBy?: "participant" | "category";
  emptyLabel?: string;
}

export function SelectedRegistrationsSummary({
  participants,
  tournamentCategories,
  teams = [],
  compact = false,
  groupBy = "participant",
  emptyLabel,
}: SelectedRegistrationsSummaryProps) {
  const { t } = useTranslation();
  const withSelections = getParticipantsWithSelections(participants);
  const categoryGroups = getRegistrationsGroupedByCategory(
    participants,
    tournamentCategories,
  );
  const isEmpty =
    groupBy === "category"
      ? categoryGroups.length === 0
      : withSelections.length === 0;

  if (isEmpty) {
    if (!emptyLabel) {
      return null;
    }
    return (
      <Typography size="body-paragraph-s" className="text-secondary-200">
        {emptyLabel}
      </Typography>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-primary-300 bg-primary-75 p-4">
      <Typography size="body-paragraph-m" variant="prominent-2">
        {t("registrations.public.selectedRegistrations.title")}
      </Typography>
      {!compact && (
        <Typography size="body-paragraph-s" className="text-secondary-200">
          {t("registrations.public.selectedRegistrations.hint")}
        </Typography>
      )}
      {groupBy === "category" ? (
        <div className="flex flex-col gap-3">
          {categoryGroups.map((group) => {
            const category = tournamentCategories.find(
              (item) => item.id === group.categoryId,
            );
            const categoryTeams = teams.filter(
              (team) => team.categoryId === group.categoryId,
            );
            const showTeams =
              !!category &&
              isTeamCategory(category) &&
              categoryTeams.length > 0;

            return (
              <div key={group.categoryId} className="flex flex-col gap-1.5">
                <Typography size="body-paragraph-s" variant="prominent-2">
                  {group.categoryName}
                </Typography>
                {showTeams ? (
                  <div className="flex flex-col gap-2">
                    {categoryTeams.map((team, index) => (
                      <div
                        key={team.clientId}
                        className="flex flex-col gap-1"
                      >
                        <Typography size="body-paragraph-xs" variant="prominent-2">
                          {t("registrations.public.teams.teamN", {
                            n: index + 1,
                          })}
                        </Typography>
                        <div className="flex flex-row flex-wrap gap-1">
                          {team.starterIds.map((id) => (
                            <MemberPill
                              key={`${team.clientId}-s-${id}`}
                              participantId={id}
                              participants={participants}
                              suffix={t("registrations.public.teams.starterRole")}
                            />
                          ))}
                          {team.reserveIds.map((id) => (
                            <MemberPill
                              key={`${team.clientId}-r-${id}`}
                              participantId={id}
                              participants={participants}
                              suffix={t("registrations.public.teams.reserveRole")}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-row flex-wrap gap-1">
                    {group.participants.map((participant) => (
                      <Pill key={`${group.categoryId}-${participant.clientId}`}>
                        <Typography size="body-paragraph-xs">
                          {getParticipantLabel(
                            participant,
                            participants.indexOf(participant),
                          )}
                        </Typography>
                      </Pill>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {withSelections.map((participant) => {
            const labels = participant.categoryIds.map(
              (id) =>
                tournamentCategories.find((category) => category.id === id)
                  ?.name ?? id,
            );

            return (
              <div key={participant.clientId} className="flex flex-col gap-1.5">
                <Typography size="body-paragraph-s" variant="prominent-2">
                  {getParticipantLabel(
                    participant,
                    participants.indexOf(participant),
                  )}
                </Typography>
                <div className="flex flex-row flex-wrap gap-1">
                  {labels.map((label) => (
                    <Pill key={`${participant.clientId}-${label}`}>
                      <Typography size="body-paragraph-xs">{label}</Typography>
                    </Pill>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MemberPill({
  participantId,
  participants,
  suffix,
}: {
  participantId: string;
  participants: DraftParticipant[];
  suffix: string;
}) {
  const participant = participants.find(
    (item) => item.clientId === participantId,
  );
  const name = participant
    ? `${participant.firstName} ${participant.lastName}`.trim()
    : participantId;

  return (
    <Pill>
      <Typography size="body-paragraph-xs">
        {name} ({suffix})
      </Typography>
    </Pill>
  );
}
