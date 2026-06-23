import { IconButton } from "@mui/material";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";

import { getParticipantLabel } from "../../utils/registrationValidation";
import type { DraftParticipant } from "../../types";

interface ParticipantListItemProps {
  participant: DraftParticipant;
  index: number;
  onEdit: (clientId: string) => void;
  onRemove: (clientId: string) => void;
}

export function ParticipantListItem({
  participant,
  index,
  onEdit,
  onRemove,
}: ParticipantListItemProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center justify-between gap-4 rounded-lg border border-primary-200 bg-white px-4 py-3">
      <Typography size="body-paragraph-m">
        {getParticipantLabel(participant, index)}
      </Typography>
      <div className="flex flex-row gap-1">
        <IconButton
          size="small"
          onClick={() => onEdit(participant.clientId)}
          aria-label={t("shared.edit")}
        >
          <FontAwesomeIcon icon={faPencil} size="xs" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onRemove(participant.clientId)}
          aria-label={t("shared.remove")}
        >
          <FontAwesomeIcon icon={faTrash} size="xs" />
        </IconButton>
      </div>
    </div>
  );
}
