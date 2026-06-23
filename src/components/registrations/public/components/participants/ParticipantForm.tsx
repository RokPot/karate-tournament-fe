import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { BeltLevelSelect } from "@/components/karate/BeltLevelSelect";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { DateUtils } from "@/util/date.utils";

import { PARTICIPANT_FORM_DEFAULTS } from "../../constants";
import type { DraftParticipant, ParticipantAttributes } from "../../types";

const currentYear = new Date().getFullYear();
const minBirthYear = 1920;

const ParticipantFormSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  gender: CommonModels.ParticipantGenderEnumSchema,
  birthYear: z.coerce
    .number()
    .int()
    .min(minBirthYear, `Year must be ${minBirthYear} or later`)
    .max(currentYear, `Year cannot be after ${currentYear}`),
  weight: z.coerce.number().gte(0),
  beltLevel: CommonModels.BeltEnumSchema,
});

type ParticipantFormValues = z.infer<typeof ParticipantFormSchema>;

interface ParticipantFormProps {
  editingParticipant?: DraftParticipant;
  onSubmit: (attributes: ParticipantAttributes) => void;
  onCancelEdit?: () => void;
}

const formatLabel = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export function ParticipantForm({
  editingParticipant,
  onSubmit,
  onCancelEdit,
}: ParticipantFormProps) {
  const { t } = useTranslation();
  const isEditing = !!editingParticipant;

  const birthYearOptions = useMemo(
    () =>
      Array.from(
        { length: currentYear - minBirthYear + 1 },
        (_, index) => currentYear - index,
      ),
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setFocus,
    watch,
  } = useForm<ParticipantFormValues>({
    resolver: zodResolver(ParticipantFormSchema),
    defaultValues: PARTICIPANT_FORM_DEFAULTS as unknown as ParticipantFormValues,
  });

  const gender = watch("gender");
  const birthYear = watch("birthYear");
  const beltLevel = watch("beltLevel");

  useEffect(() => {
    if (editingParticipant) {
      reset({
        firstName: editingParticipant.firstName,
        lastName: editingParticipant.lastName,
        gender: editingParticipant.gender,
        birthYear: DateUtils.getBirthYearFromDateOfBirth(
          editingParticipant.dateOfBirth,
        ),
        weight: editingParticipant.weight,
        beltLevel: editingParticipant.beltLevel,
      });
    } else {
      reset(PARTICIPANT_FORM_DEFAULTS as unknown as ParticipantFormValues);
    }
  }, [editingParticipant, reset]);

  const handleFormSubmit = (data: ParticipantFormValues) => {
    onSubmit({
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      dateOfBirth: DateUtils.dateOfBirthFromBirthYear(data.birthYear),
      weight: data.weight,
      beltLevel: data.beltLevel,
    });
    if (!isEditing) {
      reset(PARTICIPANT_FORM_DEFAULTS as unknown as ParticipantFormValues);
      queueMicrotask(() => setFocus("firstName"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 rounded-lg border border-primary-300 bg-primary-50 p-4"
    >
      <Typography size="h3">
        {isEditing
          ? t("registrations.public.editParticipant")
          : t("registrations.public.addParticipant")}
      </Typography>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label={t("registrations.public.participantFirstName")}
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          fullWidth
          required
        />
        <TextField
          label={t("registrations.public.participantLastName")}
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          fullWidth
          required
        />
      </div>

      <FormControl fullWidth required error={!!errors.gender}>
        <InputLabel>{t("shared.gender")}</InputLabel>
        <Select
          value={gender || ""}
          onChange={(e) =>
            setValue("gender", e.target.value as CommonModels.ParticipantGenderEnum)
          }
          label={t("shared.gender")}
        >
          {Object.values(CommonModels.ParticipantGenderEnum).map((g) => (
            <MenuItem key={g} value={g}>
              {formatLabel(g)}
            </MenuItem>
          ))}
        </Select>
        {errors.gender && (
          <Typography size="body-paragraph-xs" className="text-danger mt-1">
            {errors.gender.message}
          </Typography>
        )}
      </FormControl>

      <div className="grid grid-cols-2 gap-4">
        <FormControl fullWidth required error={!!errors.birthYear}>
          <InputLabel>{t("registrations.public.birthYear")}</InputLabel>
          <Select
            value={birthYear === undefined || Number.isNaN(birthYear) ? "" : birthYear}
            onChange={(e) => setValue("birthYear", Number(e.target.value))}
            label={t("registrations.public.birthYear")}
          >
            {birthYearOptions.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
          {errors.birthYear && (
            <Typography size="body-paragraph-xs" className="text-danger mt-1">
              {errors.birthYear.message}
            </Typography>
          )}
        </FormControl>
        <TextField
          label={t("shared.weight")}
          type="number"
          {...register("weight")}
          error={!!errors.weight}
          helperText={errors.weight?.message}
          fullWidth
          required
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          inputProps={{ min: 0, step: 0.1 }}
        />
      </div>

      <BeltLevelSelect
        label={t("shared.belt")}
        value={beltLevel}
        onChange={(value: CommonModels.BeltEnum | null) => {
          if (value) {
            setValue("beltLevel", value);
          }
        }}
        error={!!errors.beltLevel}
        helperText={errors.beltLevel?.message}
        required
      />

      <div className="flex flex-row justify-end gap-2">
        {isEditing && onCancelEdit && (
          <Button type="button" variant="outlined" onClick={onCancelEdit}>
            {t("shared.cancel")}
          </Button>
        )}
        <Button type="submit" variant="contained">
          {isEditing
            ? t("registrations.public.updateParticipant")
            : t("registrations.public.addParticipant")}
        </Button>
      </div>
    </form>
  );
}
