import { Button, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useToast } from "@/components/ui/status/Toast/useToast";

interface IProps {
  inviteUrl: string;
  onDone: () => void;
  title?: string;
  message?: string;
}

/**
 * Shown after club creation or inviting someone to an existing club.
 * Displays the link and a copy-to-clipboard action.
 */
export const ClubCreatedWithInviteView = ({
  inviteUrl,
  onDone,
  title,
  message,
}: IProps) => {
  const { t } = useTranslation();
  const { successToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl).then(
      () => successToast({ text: t("clubs.inviteLinkCopied") }),
      () => undefined,
    );
  };

  return (
    <>
      <DialogTitle>{title ?? t("clubs.createTitle")}</DialogTitle>
      <DialogContent className="flex flex-col gap-4 pt-2!">
        <p className="text-body-paragraph-m">
          {message ?? t("clubs.inviteSuccessMessage")}
        </p>
        <TextField
          label={t("clubs.inviteLinkLabel")}
          value={inviteUrl}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <Button size="small" onClick={handleCopy}>
                  {t("clubs.copyInviteLink")}
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onDone}>{t("shared.save")}</Button>
      </DialogActions>
    </>
  );
};
