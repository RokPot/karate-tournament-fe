import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
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
import { clearPendingProfileSetup } from "@/data/auth/auth-onboarding";
import { CommonModels } from "@/data/common/common.models";
import { QueryModule } from "@/data/invalidateQueries";
import { UsersModels } from "@/data/users/users.models";
import { UsersQueries } from "@/data/users/users.queries";
import { DateUtils } from "@/util/date.utils";

const CompleteProfileFormSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().max(255).email(),
  gender: z.union([CommonModels.ParticipantGenderEnumSchema, z.literal("")]),
  dateOfBirth: z.string(),
  weight: z.union([z.number().gte(0).lte(999.99), z.nan()]).optional(),
  beltLevel: z.union([CommonModels.BeltEnumSchema, z.literal("")]),
});

type CompleteProfileFormValues = z.infer<typeof CompleteProfileFormSchema>;

interface IProps {
  open: boolean;
  user: CommonModels.UserResponseDto;
  onClose: () => void;
  disableDismiss?: boolean;
}

const isoToDateInput = (iso?: string | null) => {
  const parsed = DateUtils.parseDate(iso ?? undefined);
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toISOString().slice(0, 10);
};

const dateInputToIso = (value: string) => {
  if (!value) {
    return undefined;
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  return parsed.toISOString();
};

const valuesFromUser = (
  user: CommonModels.UserResponseDto,
): CompleteProfileFormValues => ({
  firstName: user.firstName ?? "",
  lastName: user.lastName ?? "",
  email: user.email ?? "",
  gender: user.gender ?? "",
  dateOfBirth: isoToDateInput(user.dateOfBirth),
  weight: user.weight ?? Number.NaN,
  beltLevel: user.beltLevel ?? "",
});

export const CompleteProfileModal = ({
  open,
  user,
  onClose,
  disableDismiss = false,
}: IProps) => {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = UsersQueries.useUpdateProfile({
    invalidateCurrentModule: true,
    invalidateModules: [QueryModule.Users],
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(UsersQueries.keys.getProfile(), updatedUser);
      clearPendingProfileSetup();
      successToast({ text: t("profile.complete.success") });
      onClose();
    },
    onError: (error) => {
      errorToast({
        text: error?.message || t("profile.complete.error"),
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(CompleteProfileFormSchema),
    defaultValues: valuesFromUser(user),
  });

  const gender = watch("gender");
  const beltLevel = watch("beltLevel");

  useEffect(() => {
    if (open) {
      reset(valuesFromUser(user));
    }
  }, [open, user, reset]);

  const onSubmit = (data: CompleteProfileFormValues) => {
    const payload: UsersModels.UpdateUserDto = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };

    if (data.gender) {
      payload.gender = data.gender;
    }
    const dateOfBirth = dateInputToIso(data.dateOfBirth);
    if (dateOfBirth) {
      payload.dateOfBirth = dateOfBirth;
    }
    if (typeof data.weight === "number" && !Number.isNaN(data.weight)) {
      payload.weight = data.weight;
    }
    if (data.beltLevel) {
      payload.beltLevel = data.beltLevel;
    }

    updateMutation.mutate({ data: payload });
  };

  return (
    <CustomDialog
      open={open}
      onClose={disableDismiss ? () => undefined : onClose}
      disableDismiss={disableDismiss}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t("profile.complete.title")}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2!">
          <Typography size="body-paragraph-m">
            {t("profile.complete.subtitle")}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label={t("profile.complete.firstName")}
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              fullWidth
              required
            />
            <TextField
              label={t("profile.complete.lastName")}
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              fullWidth
              required
            />
          </div>
          <TextField
            label={t("profile.complete.email")}
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            required
          />
          <Typography size="body-paragraph-s" className="text-secondary-200">
            {t("profile.complete.optionalHint")}
          </Typography>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>{t("shared.gender")}</InputLabel>
            <Select
              value={gender || ""}
              onChange={(event) =>
                setValue(
                  "gender",
                  event.target.value as CompleteProfileFormValues["gender"],
                )
              }
              label={t("shared.gender")}
            >
              <MenuItem value="">
                <em>{t("shared.none")}</em>
              </MenuItem>
              {Object.values(CommonModels.ParticipantGenderEnum).map(
                (value) => (
                  <MenuItem key={value} value={value}>
                    {t(`profile.gender.${value}`)}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
          <div className="grid grid-cols-2 gap-4">
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
                setValueAs: (value) =>
                  value === "" || value === undefined
                    ? Number.NaN
                    : Number(value),
              })}
              error={!!errors.weight}
              helperText={errors.weight?.message}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              inputProps={{ min: 0, max: 999.99, step: 0.1 }}
            />
          </div>
          <BeltLevelSelect
            label={t("shared.belt")}
            value={beltLevel || ""}
            allowEmpty
            emptyLabel={t("shared.none")}
            onChange={(value) => setValue("beltLevel", value ?? "")}
            error={!!errors.beltLevel}
            helperText={errors.beltLevel?.message}
          />
        </DialogContent>
        <DialogActions>
          {!disableDismiss && (
            <Button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
            >
              {t("shared.cancel")}
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending
              ? t("profile.complete.saving")
              : t("profile.complete.save")}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
