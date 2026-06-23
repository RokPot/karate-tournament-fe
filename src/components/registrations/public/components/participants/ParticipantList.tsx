import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";

import type { DraftParticipant } from "../../types";
import { ParticipantListItem } from "./ParticipantListItem";

interface ParticipantListProps {
  participants: DraftParticipant[];
  onEdit: (clientId: string) => void;
  onRemove: (clientId: string) => void;
}

export function ParticipantList({
  participants,
  onEdit,
  onRemove,
}: ParticipantListProps) {
  const { t } = useTranslation();

  if (participants.length === 0) {
    return (
      <Typography size="body-paragraph-m" className="text-secondary-200 py-4">
        {t("registrations.public.noParticipants")}
      </Typography>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {participants.map((participant, index) => (
        <ParticipantListItem
          key={participant.clientId}
          participant={participant}
          index={index}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
