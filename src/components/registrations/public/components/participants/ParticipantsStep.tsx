import { Typography } from "@/components/ui/text/Typography/Typography";
import { useTranslation } from "react-i18next";

import type { UseDraftParticipantsReturn } from "../../hooks/useDraftParticipants";
import { ParticipantForm } from "./ParticipantForm";
import { ParticipantList } from "./ParticipantList";

interface ParticipantsStepProps {
  draft: UseDraftParticipantsReturn;
  clubMembersLoadedCount?: number;
  maxParticipants?: number;
}

export function ParticipantsStep({
  draft,
  clubMembersLoadedCount = 0,
  maxParticipants,
}: ParticipantsStepProps) {
  const { t } = useTranslation();
  const {
    participants,
    editingParticipant,
    addParticipant,
    updateParticipant,
    removeParticipant,
    startEditing,
    cancelEditing,
  } = draft;

  const atMax =
    maxParticipants != null &&
    participants.length >= maxParticipants &&
    !editingParticipant;

  const handleSubmit = (attributes: Parameters<typeof addParticipant>[0]) => {
    if (editingParticipant) {
      updateParticipant(editingParticipant.clientId, attributes);
    } else {
      addParticipant(attributes, maxParticipants);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <Typography size="h3">
        {t("registrations.public.steps.participants")}
      </Typography>
      {maxParticipants === 1 && (
        <Typography size="body-paragraph-s" className="text-neutral-200">
          {t("registrations.public.singleAthleteHint")}
        </Typography>
      )}
      {clubMembersLoadedCount > 0 && (
        <Typography size="body-paragraph-s" className="text-neutral-200">
          {t("registrations.public.clubMembersLoaded", {
            count: clubMembersLoadedCount,
          })}
        </Typography>
      )}
      {!atMax && (
        <ParticipantForm
          editingParticipant={editingParticipant}
          onSubmit={handleSubmit}
          onCancelEdit={cancelEditing}
        />
      )}
      <ParticipantList
        participants={participants}
        onEdit={startEditing}
        onRemove={removeParticipant}
      />
    </div>
  );
}
