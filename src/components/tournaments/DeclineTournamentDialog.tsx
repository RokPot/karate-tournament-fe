import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import CustomDialog from "@/components/ui/overlays/CustomDialog";

interface DeclineTournamentDialogProps {
  open: boolean;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
}

export const DeclineTournamentDialog = ({
  open,
  isPending = false,
  onClose,
  onConfirm,
}: DeclineTournamentDialogProps) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(reason.trim() ? reason.trim() : undefined);
  };

  return (
    <CustomDialog open={open} onClose={handleClose}>
      <DialogTitle>{t("tournaments.review.declineTitle")}</DialogTitle>
      <DialogContent className="flex flex-col gap-4 pt-2!">
        <TextField
          label={t("tournaments.review.reason")}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          fullWidth
          multiline
          minRows={3}
          inputProps={{ maxLength: 1000 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          {t("shared.cancel")}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={isPending}
        >
          {t("tournaments.review.decline")}
        </Button>
      </DialogActions>
    </CustomDialog>
  );
};
