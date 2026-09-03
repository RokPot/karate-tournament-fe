import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { ClubCreatedWithInviteView } from "@/components/clubs/ClubCreatedWithInviteView";
import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { getInviteRoute } from "@/config/route.config";
import { ClubsModels } from "@/data/clubs/clubs.models";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { QueryModule } from "@/data/invalidateQueries";

interface IProps {
  open: boolean;
  clubId: string;
  onClose: () => void;
}

const CreateInvitationFormSchema = z.object({
  email: z.string().max(255).email(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  role: ClubsModels.CreateClubInvitationRoleEnumSchema.optional(),
});

type CreateInvitationFormValues = z.infer<typeof CreateInvitationFormSchema>;

const resolveInviteUrl = (
  inviteUrl: string,
  token: string,
) => {
  if (inviteUrl.startsWith("http://") || inviteUrl.startsWith("https://")) {
    return inviteUrl;
  }
  const path = inviteUrl.startsWith("/") ? inviteUrl : getInviteRoute(token);
  return `${window.location.origin}${path}`;
};

export const CreateInvitationModal = ({ open, clubId, onClose }: IProps) => {
  const { t } = useTranslation();
  const { errorToast, successToast } = useToast();
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const createMutation = ClubsQueries.useCreateInvitation({
    invalidateCurrentModule: true,
    invalidateModules: [QueryModule.Invitations],
    onSuccess: (response) => {
      setInviteUrl(resolveInviteUrl(response.inviteUrl, response.token));
    },
    onError: (error) => {
      errorToast({ text: error?.message || t("invitations.create.error") });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateInvitationFormValues>({
    resolver: zodResolver(CreateInvitationFormSchema),
    defaultValues: {
      role: "club_member",
    },
  });

  const role = watch("role");

  const onSubmit = (data: CreateInvitationFormValues) => {
    const payload: ClubsModels.CreateClubInvitationDto = {
      email: data.email.trim(),
      role: data.role,
    };
    const firstName = data.firstName?.trim();
    const lastName = data.lastName?.trim();
    if (firstName) {
      payload.firstName = firstName;
    }
    if (lastName) {
      payload.lastName = lastName;
    }
    createMutation.mutate({ id: clubId, data: payload });
  };

  const handleClose = () => {
    setInviteUrl(null);
    reset();
    onClose();
  };

  const handleDoneWithInvite = () => {
    successToast({ text: t("invitations.create.success") });
    setInviteUrl(null);
    reset();
    onClose();
  };

  if (inviteUrl != null) {
    return (
      <CustomDialog open={open} onClose={handleClose}>
        <ClubCreatedWithInviteView
          inviteUrl={inviteUrl}
          onDone={handleDoneWithInvite}
          title={t("invitations.create.title")}
          message={t("invitations.create.inviteSuccessMessage")}
        />
      </CustomDialog>
    );
  }

  return (
    <CustomDialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t("invitations.create.title")}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2!">
          <TextField
            label={t("invitations.create.email")}
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label={t("invitations.create.firstName")}
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              fullWidth
            />
            <TextField
              label={t("invitations.create.lastName")}
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              fullWidth
            />
          </div>
          <FormControl fullWidth>
            <InputLabel>{t("invitations.create.role")}</InputLabel>
            <Select
              value={role || "club_member"}
              onChange={(event) =>
                setValue(
                  "role",
                  event.target.value as ClubsModels.CreateClubInvitationRoleEnum,
                )
              }
              label={t("invitations.create.role")}
            >
              {Object.values(ClubsModels.CreateClubInvitationRoleEnum).map(
                (value) => (
                  <MenuItem key={value} value={value}>
                    {t(`profile.roles.${value}`)}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={createMutation.isPending}>
            {t("shared.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending
              ? t("invitations.create.sending")
              : t("invitations.create.submit")}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
