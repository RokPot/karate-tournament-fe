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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { BeltLevelSelect } from "@/components/karate/BeltLevelSelect";
import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { ClubsModels } from "@/data/clubs/clubs.models";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { CommonModels } from "@/data/common/common.models";

interface IProps {
  open: boolean;
  onClose: (updated?: CommonModels.UserResponseDto) => void;
  clubId: string;
  member: CommonModels.UserResponseDto | null;
}

const formatRoleLabel = (role: string) =>
  role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const MEMBER_ROLES = Object.values(ClubsModels.MemberRoleEnum);

const resolveMemberRole = (
  roles: CommonModels.UserEnum[],
): ClubsModels.MemberRoleEnum => {
  const found = MEMBER_ROLES.find((role) =>
    roles.includes(role as CommonModels.UserEnum),
  );
  return found ?? ClubsModels.MemberRoleEnum.club_member;
};

const toDateInputValue = (dateOfBirth?: string | null): string => {
  if (!dateOfBirth) return "";
  return dateOfBirth.slice(0, 10);
};

const EditMemberFormSchema = ClubsModels.UpdateMemberDtoSchema.omit({
  email: true,
  dateOfBirth: true,
}).extend({
  email: z
    .union([z.string().max(255).email(), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  dateOfBirth: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? null : v)),
});

type EditMemberFormValues = z.input<typeof EditMemberFormSchema>;

export const EditMemberModal = ({ open, onClose, clubId, member }: IProps) => {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EditMemberFormValues>({
    resolver: zodResolver(EditMemberFormSchema),
  });

  useEffect(() => {
    if (!open || !member) return;
    reset({
      role: resolveMemberRole(member.roles),
      firstName: member.firstName ?? "",
      lastName: member.lastName ?? "",
      email: member.email ?? "",
      gender: member.gender ?? undefined,
      dateOfBirth: toDateInputValue(member.dateOfBirth),
      weight: member.weight ?? undefined,
      beltLevel: member.beltLevel ?? undefined,
    });
  }, [open, member, reset]);

  const updateMemberMutation = ClubsQueries.useUpdateMember({
    onSuccess: (data) => {
      successToast({ text: t("members.edit.success") });
      onClose(data);
    },
    onError: (error) => {
      errorToast({ text: error?.message || t("members.edit.error") });
    },
  });

  const role = watch("role");
  const gender = watch("gender");
  const beltLevel = watch("beltLevel");

  const onSubmit = (data: EditMemberFormValues) => {
    if (!member) return;
    const parsed = EditMemberFormSchema.parse(data);
    updateMemberMutation.mutate({
      id: clubId,
      userId: member.id,
      data: parsed,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomDialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t("members.edit.title")}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2!">
          <FormControl fullWidth error={!!errors.role}>
            <InputLabel>{t("members.create.role")}</InputLabel>
            <Select
              value={role || ""}
              onChange={(e) =>
                setValue("role", e.target.value as ClubsModels.MemberRoleEnum)
              }
              label={t("members.create.role")}
            >
              {MEMBER_ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  {formatRoleLabel(r)}
                </MenuItem>
              ))}
            </Select>
            {errors.role && (
              <Typography size="body-paragraph-xs" className="text-danger mt-1">
                {errors.role.message}
              </Typography>
            )}
          </FormControl>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label={t("members.create.firstName")}
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              fullWidth
            />
            <TextField
              label={t("members.create.lastName")}
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              fullWidth
            />
          </div>

          <TextField
            label={t("members.create.email")}
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />

          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>{t("shared.gender")}</InputLabel>
            <Select
              value={gender ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setValue(
                  "gender",
                  v
                    ? (v as CommonModels.ParticipantGenderEnum)
                    : undefined,
                );
              }}
              label={t("shared.gender")}
            >
              <MenuItem value="">
                <em>{t("shared.none")}</em>
              </MenuItem>
              {Object.values(CommonModels.ParticipantGenderEnum).map((g) => (
                <MenuItem key={g} value={g}>
                  {formatRoleLabel(g)}
                </MenuItem>
              ))}
            </Select>
            {errors.gender && (
              <Typography size="body-paragraph-xs" className="text-danger mt-1">
                {errors.gender.message}
              </Typography>
            )}
          </FormControl>

          <TextField
            label={t("shared.birthday")}
            type="date"
            {...register("dateOfBirth")}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label={t("shared.weight")}
            type="number"
            {...register("weight", {
              setValueAs: (v) =>
                v === "" || v === undefined ? undefined : Number(v),
            })}
            error={!!errors.weight}
            helperText={errors.weight?.message}
            fullWidth
            inputProps={{ min: 0, max: 300, step: 1 }}
          />

          <BeltLevelSelect
            label={t("shared.belt")}
            value={beltLevel}
            onChange={(value) => {
              if (value) {
                setValue("beltLevel", value);
              }
            }}
            error={!!errors.beltLevel}
            helperText={errors.beltLevel?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={updateMemberMutation.isPending}>
            {t("shared.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateMemberMutation.isPending}
          >
            {updateMemberMutation.isPending
              ? t("members.edit.saving")
              : t("shared.save")}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
