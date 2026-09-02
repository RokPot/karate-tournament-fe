import { Button } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { RegistrationsModels } from "@/data/registrations/registrations.models";

import type { DraftParticipant, DraftTeam } from "../../types";
import { getParticipantLabel } from "../../utils/registrationValidation";
import { classifyTeamMember, isDuplicateTeam } from "../../utils/teamOverlap";

interface CategoryTeamAssignmentSectionProps {
  item: RegistrationsModels.CategorySuitableParticipantsItemDto;
  draftParticipants: DraftParticipant[];
  teams: DraftTeam[];
  onAddTeam: (starterIds: string[], reserveIds: string[]) => void;
  onRemoveTeam: (teamId: string) => void;
}

export function CategoryTeamAssignmentSection({
  item,
  draftParticipants,
  teams,
  onAddTeam,
  onRemoveTeam,
}: CategoryTeamAssignmentSectionProps) {
  const { t } = useTranslation();
  const { category } = item;
  const teamSize = category.teamSize ?? 0;
  const reserveCap = category.teamReservesSize ?? 0;

  const [starterIds, setStarterIds] = useState<string[]>([]);
  const [reserveIds, setReserveIds] = useState<string[]>([]);

  const eligibleParticipants = useMemo(() => {
    return item.participants.flatMap((suitable) => {
      const draft = draftParticipants[suitable.participantIndex];
      return draft ? [draft] : [];
    });
  }, [draftParticipants, item.participants]);

  const currentMembers = [...starterIds, ...reserveIds];
  const categoryTeams = teams.filter((team) => team.categoryId === category.id);

  const handleSelect = (clientId: string) => {
    if (classifyTeamMember(clientId, currentMembers, categoryTeams) === "blocked") {
      return;
    }
    if (starterIds.length < teamSize) {
      setStarterIds((prev) => [...prev, clientId]);
      return;
    }
    if (reserveIds.length < reserveCap) {
      setReserveIds((prev) => [...prev, clientId]);
    }
  };

  const handleRemoveFromDraft = (clientId: string) => {
    setStarterIds((prev) => prev.filter((id) => id !== clientId));
    setReserveIds((prev) => prev.filter((id) => id !== clientId));
  };

  const isDuplicateRoster = isDuplicateTeam(currentMembers, categoryTeams);
  const canSubmitTeam =
    starterIds.length === teamSize && !isDuplicateRoster;

  const handleAddTeam = () => {
    if (!canSubmitTeam) {
      return;
    }
    onAddTeam(starterIds, reserveIds);
    setStarterIds([]);
    setReserveIds([]);
  };

  const genderLabel = category.gender
    ? t(`categories.create.${category.gender}`)
    : t("registrations.public.teams.anyGender");

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-primary-200 bg-white p-4">
      <div className="flex flex-col">
        <Typography size="body-paragraph-lg" variant="prominent-2">
          {category.name}
        </Typography>
        <Typography size="body-paragraph-xs" className="text-secondary-200">
          {t(`discipline.${category.discipline}`)}
          {" · "}
          {genderLabel}
          {" · "}
          {t("registrations.public.teams.rosterHint", {
            teamSize,
            reserves: reserveCap,
          })}
        </Typography>
      </div>

      {categoryTeams.length > 0 && (
        <div className="flex flex-col gap-2">
          <Typography size="body-paragraph-s" variant="prominent-2">
            {t("registrations.public.teams.formedTeams")}
          </Typography>
          {categoryTeams.map((team, index) => (
            <FormedTeamRow
              key={team.clientId}
              team={team}
              index={index}
              participants={draftParticipants}
              onRemove={() => onRemoveTeam(team.clientId)}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Typography size="body-paragraph-s" variant="prominent-2">
          {t("registrations.public.teams.currentTeam")}
        </Typography>
        <SlotRow
          label={t("registrations.public.teams.starters")}
          ids={starterIds}
          requiredCount={teamSize}
          participants={draftParticipants}
          onRemove={handleRemoveFromDraft}
        />
        {reserveCap > 0 && (
          <SlotRow
            label={t("registrations.public.teams.reserves")}
            ids={reserveIds}
            requiredCount={reserveCap}
            optional
            participants={draftParticipants}
            onRemove={handleRemoveFromDraft}
          />
        )}
        <Button
          variant="contained"
          onClick={handleAddTeam}
          disabled={!canSubmitTeam}
        >
          {t("registrations.public.teams.addTeam")}
        </Button>
        {isDuplicateRoster && starterIds.length === teamSize && (
          <Typography size="body-paragraph-s" className="text-secondary-200">
            {t("registrations.public.teams.duplicateTeam")}
          </Typography>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Typography size="body-paragraph-s" variant="prominent-2">
          {t("registrations.public.teams.eligible")}
        </Typography>
        {eligibleParticipants.length === 0 ? (
          <Typography size="body-paragraph-s" className="text-secondary-200">
            {t("registrations.public.noEligibleParticipantsForCategory")}
          </Typography>
        ) : (
          <div className="flex flex-col gap-1">
            {eligibleParticipants.map((participant) => {
              const availability = classifyTeamMember(
                participant.clientId,
                currentMembers,
                categoryTeams,
              );
              const slotsFull =
                starterIds.length >= teamSize &&
                reserveIds.length >= reserveCap;
              const disabled = availability === "blocked" || slotsFull;
              return (
                <button
                  key={participant.clientId}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(participant.clientId)}
                  className="flex flex-row items-center justify-between rounded-md px-2 py-1 text-left disabled:opacity-40"
                >
                  <Typography size="body-paragraph-m">
                    {getParticipantLabel(
                      participant,
                      draftParticipants.indexOf(participant),
                    )}
                  </Typography>
                  <Typography
                    size="body-paragraph-xs"
                    className="text-secondary-200"
                  >
                    {availability === "unused"
                      ? t("registrations.public.teams.available")
                      : availability === "reusable"
                        ? t("registrations.public.teams.reusable")
                        : t("registrations.public.teams.blocked")}
                  </Typography>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SlotRow({
  label,
  ids,
  requiredCount,
  optional = false,
  participants,
  onRemove,
}: {
  label: string;
  ids: string[];
  requiredCount: number;
  optional?: boolean;
  participants: DraftParticipant[];
  onRemove: (clientId: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1">
      <Typography size="body-paragraph-xs" className="text-secondary-200">
        {label} ({ids.length}/{requiredCount}
        {optional ? ` ${t("registrations.public.teams.optional")}` : ""})
      </Typography>
      <div className="flex flex-row flex-wrap gap-1">
        {ids.map((id) => {
          const participant = participants.find((item) => item.clientId === id);
          if (!participant) {
            return null;
          }
          return (
            <Button
              key={id}
              size="small"
              variant="outlined"
              onClick={() => onRemove(id)}
            >
              {participant.firstName} {participant.lastName} ×
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function FormedTeamRow({
  team,
  index,
  participants,
  onRemove,
}: {
  team: DraftTeam;
  index: number;
  participants: DraftParticipant[];
  onRemove: () => void;
}) {
  const { t } = useTranslation();
  const names = (ids: string[]) =>
    ids
      .map((id) => {
        const participant = participants.find((item) => item.clientId === id);
        return participant
          ? `${participant.firstName} ${participant.lastName}`.trim()
          : id;
      })
      .join(", ");

  return (
    <div className="flex flex-row items-start justify-between gap-3 rounded-md border border-primary-200 p-3">
      <div className="flex flex-col gap-0.5">
        <Typography size="body-paragraph-s" variant="prominent-2">
          {t("registrations.public.teams.teamN", { n: index + 1 })}
        </Typography>
        <Typography size="body-paragraph-xs">
          {t("registrations.public.teams.starters")}: {names(team.starterIds)}
        </Typography>
        {team.reserveIds.length > 0 && (
          <Typography size="body-paragraph-xs">
            {t("registrations.public.teams.reserves")}: {names(team.reserveIds)}
          </Typography>
        )}
      </div>
      <Button size="small" variant="outlined" color="error" onClick={onRemove}>
        {t("shared.delete")}
      </Button>
    </div>
  );
}
