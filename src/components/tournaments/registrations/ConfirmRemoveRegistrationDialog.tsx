import { Button, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { Typography } from "@/components/ui/text/Typography/Typography";

type ConfirmRemoveRegistrationDialogProps = {
  open: boolean;
  name: string;
  categoryName: string;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmRemoveRegistrationDialog = ({
  open,
  name,
  categoryName,
  isPending = false,
  onClose,
  onConfirm,
}: ConfirmRemoveRegistrationDialogProps) => {
  const { t } = useTranslation();

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>{t("shared.delete")}</DialogTitle>
      <DialogContent>
        <Typography size="body-paragraph-m">
          {t("registrations.staff.removeConfirm", {
            name,
            category: categoryName,
          })}
        </Typography>
      </DialogContent>
      <DialogActions className="gap-2 px-6 pb-4">
        <Button variant="outlined" onClick={onClose} disabled={isPending}>
          {t("shared.cancel")}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={isPending}
        >
          {t("shared.delete")}
        </Button>
      </DialogActions>
    </CustomDialog>
  );
};
