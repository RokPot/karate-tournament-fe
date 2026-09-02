import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { CommonModels } from "@/data/common/common.models";

import type { DraftParticipant, DraftTeam } from "../../types";
import { SelectedRegistrationsSummary } from "../SelectedRegistrationsSummary";

interface CategoryRegistrationsModalProps {
  open: boolean;
  onClose: () => void;
  participants: DraftParticipant[];
  tournamentCategories: CommonModels.CategoryResponseDto[];
  teams?: DraftTeam[];
}

export function CategoryRegistrationsModal({
  open,
  onClose,
  participants,
  tournamentCategories,
  teams,
}: CategoryRegistrationsModalProps) {
  const { t } = useTranslation();

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>
        {t("registrations.public.stepper.viewRegistrations")}
      </DialogTitle>
      <DialogContent className="pt-2!">
        <SelectedRegistrationsSummary
          participants={participants}
          tournamentCategories={tournamentCategories}
          teams={teams}
          groupBy="category"
          compact
          emptyLabel={t("registrations.public.stepper.emptyCategory")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("ui.modal.closeBtn")}</Button>
      </DialogActions>
    </CustomDialog>
  );
}
