import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { ClubCreatedWithInviteView } from "@/components/clubs/ClubCreatedWithInviteView";
import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { ClubsModels } from "@/data/clubs/clubs.models";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { CommonModels } from "@/data/common/common.models";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export const CreateClubModal = ({ open, onClose }: IProps) => {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const createMutation = ClubsQueries.useCreate({
    invalidateCurrentModule: true,
    onSuccess: (response: CommonModels.ClubResponseDto) => {
      if (response.inviteUrl) {
        setInviteUrl(response.inviteUrl);
      } else {
        successToast({ text: t("clubs.createSuccess") });
        reset();
        onClose();
      }
    },
    onError: (error) => {
      errorToast({ text: error?.message || t("clubs.createError") });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClubsModels.CreateClubDto>({
    resolver: zodResolver(ClubsModels.CreateClubDtoSchema),
  });

  const onSubmit = (data: ClubsModels.CreateClubDto) => {
    createMutation.mutate({ data });
  };

  const handleClose = () => {
    setInviteUrl(null);
    reset();
    onClose();
  };

  const handleDoneWithInvite = () => {
    successToast({ text: t("clubs.createSuccess") });
    setInviteUrl(null);
    reset();
    onClose();
  };

  if (inviteUrl != null) {
    return (
      <CustomDialog open={open} onClose={handleClose}>
        <ClubCreatedWithInviteView inviteUrl={inviteUrl} onDone={handleDoneWithInvite} />
      </CustomDialog>
    );
  }

  return (
    <CustomDialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t("clubs.createTitle")}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2!">
          <TextField
            label={t("shared.name")}
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            required
          />
          <TextField
            label={t("shared.address")}
            {...register("address")}
            error={!!errors.address}
            helperText={errors.address?.message}
            fullWidth
          />
          <TextField
            label={t("shared.country")}
            {...register("country")}
            error={!!errors.country}
            helperText={errors.country?.message}
            fullWidth
          />
          <TextField
            label={t("clubs.ownerFirstName")}
            {...register("ownerFirstName")}
            error={!!errors.ownerFirstName}
            helperText={errors.ownerFirstName?.message}
            fullWidth
          />
          <TextField
            label={t("clubs.ownerLastName")}
            {...register("ownerLastName")}
            error={!!errors.ownerLastName}
            helperText={errors.ownerLastName?.message}
            fullWidth
          />
          <TextField
            label={t("clubs.initialAdminEmail")}
            type="email"
            {...register("ownerEmail")}
            error={!!errors.ownerEmail}
            helperText={errors.ownerEmail?.message}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={createMutation.isPending}>
            {t("shared.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={createMutation.isPending}>
            {createMutation.isPending ? t("shared.creating") : t("shared.create")}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
