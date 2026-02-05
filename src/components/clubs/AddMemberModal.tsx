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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { CommonModels } from "@/data/common/common.models";
import { ClubsModels } from "@/data/clubs/clubs.models";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { Typography } from "@/components/ui/text/Typography/Typography";

interface IProps {
  open: boolean;
  onClose: (newMember?: CommonModels.UserResponseDto) => void;
  clubId: string;
}

const formatRoleLabel = (role: string) =>
  role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

/**
 * Form schema: same as API but (1) email accepts "" and becomes undefined,
 * (2) firstName/lastName require at least 1 character so empty fields show errors.
 */
const AddMemberFormSchema = ClubsModels.AddMemberDtoSchema.omit({
  email: true,
}).extend({
  email: z
    .union([z.string().max(255).email(), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),

});

export const AddMemberModal = ({ open, onClose, clubId }: IProps) => {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();

  const addMemberMutation = ClubsQueries.useAddMember({
    onSuccess: (data) => {
      successToast({ text: t("members.create.success") });
      reset();
      onClose(data);
    },
    onError: (error) => {
      errorToast({ text: error?.message || t("members.create.error") });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ClubsModels.AddMemberDto>({
    resolver: zodResolver(AddMemberFormSchema),
    defaultValues: {
      role: "club_member",
    },

  });

  const role = watch("role");
  const gender = watch("gender");
  const beltLevel = watch("beltLevel");

  const onSubmit = (data: ClubsModels.AddMemberDto) => {
    const payload: ClubsModels.AddMemberDto = {
      ...data
    };
    addMemberMutation.mutate({ id: clubId, data: payload });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomDialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t("members.create.title")}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2!">
          <FormControl fullWidth required error={!!errors.role}>
            <InputLabel>{t("members.create.role")}</InputLabel>
            <Select
              value={role || ""}
              onChange={(e) =>
                setValue("role", e.target.value as ClubsModels.RoleEnum)
              }
              label={t("members.create.role")}
            >
              {Object.values(ClubsModels.RoleEnum).map((r) => (
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
            required={false}
          />

          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>{t("shared.gender")}</InputLabel>
            <Select
              value={gender ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setValue(
                  "gender",
                  v as CommonModels.GenderEnum,
                );
              }}
              label={t("shared.gender")}
            >
              <MenuItem value="">
                <em>{t("shared.none")}</em>
              </MenuItem>
              {Object.values(CommonModels.GenderEnum).map((g) => (
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
            {...register("birthDate")}
            error={!!errors.birthDate}
            helperText={errors.birthDate?.message}
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

          <FormControl fullWidth error={!!errors.beltLevel}>
            <InputLabel>{t("shared.belt")}</InputLabel>
            <Select
              value={beltLevel ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setValue(
                  "beltLevel",
                  (v as CommonModels.BeltEnum),
                );
              }}
              label={t("shared.belt")}
            >
              <MenuItem value="">
                <em>{t("shared.none")}</em>
              </MenuItem>
              {Object.values(CommonModels.BeltEnum).map((belt) => (
                <MenuItem key={belt} value={belt}>
                  {t(`belt.${belt}`) || formatRoleLabel(belt)}
                </MenuItem>
              ))}
            </Select>
            {errors.beltLevel && (
              <Typography size="body-paragraph-xs" className="text-danger mt-1">
                {errors.beltLevel.message}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={addMemberMutation.isPending}>
            {t("shared.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={addMemberMutation.isPending}
          >
            {addMemberMutation.isPending ? t("shared.creating") : t("shared.create")}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
