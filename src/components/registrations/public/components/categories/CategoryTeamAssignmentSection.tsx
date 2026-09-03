import { Button } from "@mui/material";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { RegistrationsModels } from "@/data/registrations/registrations.models";

import type { DraftParticipant, DraftTeam } from "../../types";
import { getParticipantLabel } from "../../utils/registrationValidation";
import { classifyTeamMember, isDuplicateTeam } from "../../utils/teamOverlap";

interface EditorTeam {
  localId: string;
  draftClientId?: string;
  starterIds: string[];
  reserveIds: string[];
}

interface CategoryTeamAssignmentSectionProps {
  item: RegistrationsModels.CategorySuitableParticipantsItemDto;
  draftParticipants: DraftParticipant[];
  teams: DraftTeam[];
  onAddTeam: (starterIds: string[], reserveIds: string[]) => string;
  onUpdateTeam: (teamId: string, starterIds: string[], reserveIds: string[]) => void;
  onRemoveTeam: (teamId: string) => void;
}

function createEmptyTeam(): EditorTeam {
  return { localId: crypto.randomUUID(), starterIds: [], reserveIds: [] };
}

function editorTeamsFromDraft(
  teams: DraftTeam[],
  categoryId: string,
): EditorTeam[] {
  const existing = teams
    .filter((team) => team.categoryId === categoryId)
    .map((team) => ({
      localId: team.clientId,
      draftClientId: team.clientId,
      starterIds: team.starterIds,
      reserveIds: team.reserveIds,
    }));
  return existing.length > 0 ? existing : [createEmptyTeam()];
}

function toDraftTeam(team: EditorTeam, categoryId: string): DraftTeam {
  return {
    clientId: team.draftClientId ?? team.localId,
    categoryId,
    starterIds: team.starterIds,
    reserveIds: team.reserveIds,
  };
}

export function CategoryTeamAssignmentSection({
  item,
  draftParticipants,
  teams,
  onAddTeam,
  onUpdateTeam,
  onRemoveTeam,
}: CategoryTeamAssignmentSectionProps) {
  const { t } = useTranslation();
  const { category } = item;
  const teamSize = category.teamSize ?? 0;
  const reserveCap = category.teamReservesSize ?? 0;

  const [editorTeams, setEditorTeams] = useState<EditorTeam[]>(() =>
    editorTeamsFromDraft(teams, category.id),
  );
  const [activeTeamId, setActiveTeamId] = useState(
    () => editorTeams[0]?.localId ?? "",
  );

  const eligibleParticipants = useMemo(() => {
    return item.participants.flatMap((suitable) => {
      const draft = draftParticipants[suitable.participantIndex];
      return draft ? [draft] : [];
    });
  }, [draftParticipants, item.participants]);

  const activeTeam =
    editorTeams.find((team) => team.localId === activeTeamId) ?? editorTeams[0];

  const otherTeamsAsDraft = (localId: string) =>
    editorTeams
      .filter((team) => team.localId !== localId)
      .map((team) => toDraftTeam(team, category.id));

  const applyRoster = (
    localId: string,
    starterIds: string[],
    reserveIds: string[],
  ) => {
    const current = editorTeams.find((team) => team.localId === localId);
    if (!current) {
      return;
    }
    const others = otherTeamsAsDraft(localId);
    const members = [...starterIds, ...reserveIds];
    const duplicate =
      starterIds.length === teamSize && isDuplicateTeam(members, others);
    const complete = starterIds.length === teamSize && !duplicate;

    if (complete && current.draftClientId) {
      onUpdateTeam(current.draftClientId, starterIds, reserveIds);
      setEditorTeams((prev) =>
        prev.map((team) =>
          team.localId === localId ? { ...team, starterIds, reserveIds } : team,
        ),
      );
      return;
    }

    if (complete && !current.draftClientId) {
      const draftClientId = onAddTeam(starterIds, reserveIds);
      setEditorTeams((prev) =>
        prev.map((team) =>
          team.localId === localId
            ? { ...team, starterIds, reserveIds, draftClientId }
            : team,
        ),
      );
      return;
    }

    if (!complete && current.draftClientId) {
      onRemoveTeam(current.draftClientId);
    }

    setEditorTeams((prev) =>
      prev.map((team) =>
        team.localId === localId
          ? { ...team, starterIds, reserveIds, draftClientId: undefined }
          : team,
      ),
    );
  };

  const handleSelect = (clientId: string) => {
    if (!activeTeam) {
      return;
    }
    const currentMembers = [...activeTeam.starterIds, ...activeTeam.reserveIds];
    if (currentMembers.includes(clientId)) {
      return;
    }
    if (
      classifyTeamMember(
        clientId,
        currentMembers,
        otherTeamsAsDraft(activeTeam.localId),
      ) === "blocked"
    ) {
      return;
    }
    if (activeTeam.starterIds.length < teamSize) {
      applyRoster(
        activeTeam.localId,
        [...activeTeam.starterIds, clientId],
        activeTeam.reserveIds,
      );
      return;
    }
    if (activeTeam.reserveIds.length < reserveCap) {
      applyRoster(activeTeam.localId, activeTeam.starterIds, [
        ...activeTeam.reserveIds,
        clientId,
      ]);
    }
  };

  const handleRemoveMember = (localId: string, clientId: string) => {
    const team = editorTeams.find((item) => item.localId === localId);
    if (!team) {
      return;
    }
    applyRoster(
      localId,
      team.starterIds.filter((id) => id !== clientId),
      team.reserveIds.filter((id) => id !== clientId),
    );
  };

  const handleAddTeam = () => {
    const team = createEmptyTeam();
    setEditorTeams((prev) => [...prev, team]);
    setActiveTeamId(team.localId);
  };

  const handleDeleteTeam = (localId: string) => {
    const team = editorTeams.find((item) => item.localId === localId);
    if (team?.draftClientId) {
      onRemoveTeam(team.draftClientId);
    }
    const remaining = editorTeams.filter((item) => item.localId !== localId);
    const next = remaining.length > 0 ? remaining : [createEmptyTeam()];
    setEditorTeams(next);
    if (activeTeamId === localId) {
      setActiveTeamId(next[0]!.localId);
    }
  };

  const genderLabel = category.gender
    ? t(`categories.create.${category.gender}`)
    : t("registrations.public.teams.anyGender");

  const activeMembers = activeTeam
    ? [...activeTeam.starterIds, ...activeTeam.reserveIds]
    : [];
  const activeOthers = activeTeam ? otherTeamsAsDraft(activeTeam.localId) : [];
  const isDuplicateRoster =
    !!activeTeam &&
    activeTeam.starterIds.length === teamSize &&
    isDuplicateTeam(activeMembers, activeOthers);
  const activeSlotsFull =
    !!activeTeam &&
    activeTeam.starterIds.length >= teamSize &&
    activeTeam.reserveIds.length >= reserveCap;

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
          {reserveCap > 0
            ? t("registrations.public.teams.rosterHintWithReserves", {
              teamSize,
              reserves: reserveCap,
            })
            : t("registrations.public.teams.rosterHint", { teamSize })}
        </Typography>
      </div>

      <div className="relative flex gap-6">
        <div className="flex flex-col gap-3 flex-1">
          {editorTeams.map((team, index) => (
            <TeamCard
              key={team.localId}
              team={team}
              index={index}
              teamSize={teamSize}
              reserveCap={reserveCap}
              isActive={team.localId === activeTeam?.localId}
              participants={draftParticipants}
              isDuplicate={
                team.starterIds.length === teamSize &&
                isDuplicateTeam(
                  [...team.starterIds, ...team.reserveIds],
                  otherTeamsAsDraft(team.localId),
                )
              }
              onActivate={() => setActiveTeamId(team.localId)}
              onRemoveMember={(clientId) =>
                handleRemoveMember(team.localId, clientId)
              }
              onDelete={() => handleDeleteTeam(team.localId)}
            />
          ))}
          <Button variant="contained" onClick={handleAddTeam}>
            {t("registrations.public.teams.addTeam")}
          </Button>
        </div>

        <div className="flex max-h-[min(80vh,640px)] h-fit flex-col gap-2 lg:sticky lg:top-4 flex-1 bg-primary-100/80 p-4 rounded-s">
          <Typography size="body-paragraph-s" variant="prominent-2">
            {t("registrations.public.teams.eligible")}
          </Typography>
          {eligibleParticipants.length === 0 ? (
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {t("registrations.public.noEligibleParticipantsForCategory")}
            </Typography>
          ) : (
            <div className="flex min-h-0 flex-col gap-1 overflow-y-auto">
              {eligibleParticipants.map((participant) => {
                const availability = classifyTeamMember(
                  participant.clientId,
                  activeMembers,
                  activeOthers,
                );
                const disabled = availability === "blocked" || activeSlotsFull;
                return (
                  <button
                    key={participant.clientId}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelect(participant.clientId)}
                    className="flex cursor-pointer flex-row items-center justify-between rounded-md px-2 py-1 text-left hover:bg-primary-75 disabled:cursor-not-allowed disabled:opacity-40"
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

      {isDuplicateRoster && (
        <Typography size="body-paragraph-s" className="text-secondary-200">
          {t("registrations.public.teams.duplicateTeam")}
        </Typography>
      )}
    </div>
  );
}

function TeamCard({
  team,
  index,
  teamSize,
  reserveCap,
  isActive,
  participants,
  isDuplicate,
  onActivate,
  onRemoveMember,
  onDelete,
}: {
  team: EditorTeam;
  index: number;
  teamSize: number;
  reserveCap: number;
  isActive: boolean;
  participants: DraftParticipant[];
  isDuplicate: boolean;
  onActivate: () => void;
  onRemoveMember: (clientId: string) => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onActivate}
      className={clsx(
        "flex cursor-pointer flex-col gap-2 rounded-md border p-3 text-left rounded-s transition ease-in-out duration-200",
        isActive
          ? "border-tertiary-100  shadow-4 scale-105"
          : "border-primary-200",
      )}
    >
      <div className="flex flex-row items-start justify-between gap-3">
        <Typography size="body-paragraph-s" variant="prominent-2">
          {t("registrations.public.teams.teamN", { n: index + 1 })}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          {t("shared.delete")}
        </Button>
      </div>
      <SlotPlaceholders
        label={t("registrations.public.teams.starters")}
        ids={team.starterIds}
        requiredCount={teamSize}
        participants={participants}
        onRemove={onRemoveMember}
      />
      {reserveCap > 0 && (
        <SlotPlaceholders
          label={t("registrations.public.teams.reserves")}
          ids={team.reserveIds}
          requiredCount={reserveCap}
          optional
          participants={participants}
          onRemove={onRemoveMember}
        />
      )}
      {isDuplicate && (
        <Typography size="body-paragraph-xs" className="text-secondary-200">
          {t("registrations.public.teams.duplicateTeam")}
        </Typography>
      )}
    </div>
  );
}

function SlotPlaceholders({
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
  const emptyCount = Math.max(requiredCount - ids.length, 0);

  return (
    <div className="flex flex-col gap-1">
      <Typography size="body-paragraph-xs" className="text-secondary-200">
        {label} ({ids.length}/{requiredCount}
        {optional ? ` ${t("registrations.public.teams.optional")}` : ""})
      </Typography>
      <div className="flex flex-col gap-1">
        {ids.map((id) => {
          const participant = participants.find((item) => item.clientId === id);
          const name = participant
            ? `${participant.firstName} ${participant.lastName}`.trim()
            : id;
          return (
            <button
              key={id}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(id);
              }}
              className="flex h-10 cursor-pointer flex-row items-center justify-between rounded-md border border-primary-200 bg-white px-2 text-left"
            >
              <Typography size="body-paragraph-s">{name}</Typography>
              <Typography size="body-paragraph-s" className="text-secondary-200">
                ×
              </Typography>
            </button>
          );
        })}
        {Array.from({ length: emptyCount }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="flex h-10 items-center justify-center rounded-md border border-dashed border-primary-300 bg-primary-50 px-2"
          >
            <Typography size="body-paragraph-xs" className="text-secondary-200">
              {t("registrations.public.teams.emptySlot")}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
