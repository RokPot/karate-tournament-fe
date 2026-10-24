import { zodResolver } from "@hookform/resolvers/zod";
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
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { BeltLevelSelect } from "@/components/karate/BeltLevelSelect";
import { isTeamCategory } from "@/components/registrations/public/utils/teamOverlap";
import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { DateUtils } from "@/util/date.utils";

/** Participant fields collected by the staff form. */
export type StaffParticipantPayload = {
  firstName: string;
  lastName: string;
  gender: CommonModels.ParticipantGenderEnum;
  dateOfBirth: string;
  weight: number;
  beltLevel: CommonModels.BeltEnum;
};

const currentYear = new Date().getFullYear();
const minBirthYear = 1920;

const StaffParticipantFormSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  gender: CommonModels.ParticipantGenderEnumSchema,
  birthYear: z.coerce
    .number()
    .int()
    .min(minBirthYear)
    .max(currentYear),
  weight: z.coerce.number().gte(0),
  beltLevel: CommonModels.BeltEnumSchema,
  categoryId: z.string().optional(),
});

type StaffParticipantFormValues = z.infer<typeof StaffParticipantFormSchema>;

export type StaffRegistrationModalMode = "create" | "edit";

export type StaffRegistrationInitialValues = Partial<StaffParticipantPayload> & {
  categoryId?: string;
};

type StaffRegistrationModalProps = {
  open: boolean;
  mode: StaffRegistrationModalMode;
  categories?: CommonModels.CategoryResponseDto[];
  /** When set, category is fixed (category accordion add). */
  fixedCategoryId?: string;
  /** When true and fixedCategoryId is unset, show category picker. */
  requireCategorySelect?: boolean;
  initialValues?: StaffRegistrationInitialValues;
  isPending?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    participant: StaffParticipantPayload;
    categoryId?: string;
  }) => void;
};

const formatLabel = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const defaultValues: StaffParticipantFormValues = {
  firstName: "",
  lastName: "",
  gender: CommonModels.ParticipantGenderEnum.male,
  birthYear: currentYear - 18,
  weight: 0,
  beltLevel: CommonModels.BeltEnum["10-kyu"],
  categoryId: "",
};

export const StaffRegistrationModal = ({
  open,
  mode,
  categories = [],
  fixedCategoryId,
  requireCategorySelect = false,
  initialValues,
  isPending = false,
  onClose,
  onSubmit,
}: StaffRegistrationModalProps) => {
  const { t } = useTranslation();
  const showCategorySelect =
    mode === "create" && requireCategorySelect && !fixedCategoryId;

  const birthYearOptions = useMemo(
    () =>
      Array.from(
        { length: currentYear - minBirthYear + 1 },
        (_, index) => currentYear - index,
      ),
    [],
  );

  const selectableCategories = useMemo(
    () =>
      categories.filter((category) => !isTeamCategory(category)),
    [categories],
  );

  const formSchema = useMemo(
    () =>
      showCategorySelect
        ? StaffParticipantFormSchema.extend({
          categoryId: z.string().min(1),
        })
        : StaffParticipantFormSchema,
    [showCategorySelect],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<StaffParticipantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const gender = watch("gender");
  const birthYear = watch("birthYear");
  const beltLevel = watch("beltLevel");
  const categoryId = watch("categoryId");

  useEffect(() => {
    if (!open) {
      return;
    }
    reset({
      firstName: initialValues?.firstName ?? defaultValues.firstName,
      lastName: initialValues?.lastName ?? defaultValues.lastName,
      gender: initialValues?.gender ?? defaultValues.gender,
      birthYear: initialValues?.dateOfBirth
        ? (DateUtils.getBirthYearFromDateOfBirth(initialValues.dateOfBirth) ??
          defaultValues.birthYear)
        : defaultValues.birthYear,
      weight: initialValues?.weight ?? defaultValues.weight,
      beltLevel: initialValues?.beltLevel ?? defaultValues.beltLevel,
      categoryId:
        fixedCategoryId ??
        initialValues?.categoryId ??
        selectableCategories[0]?.id ??
        "",
    });
  }, [fixedCategoryId, initialValues, open, reset, selectableCategories]);

  const handleFormSubmit = (data: StaffParticipantFormValues) => {
    onSubmit({
      participant: {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: DateUtils.dateOfBirthFromBirthYear(data.birthYear),
        weight: data.weight,
        beltLevel: data.beltLevel,
      },
      categoryId: fixedCategoryId ?? data.categoryId,
    });
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>
        {mode === "edit"
          ? t("registrations.staff.editTitle")
          : t("registrations.staff.addTitle")}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          {showCategorySelect && (
            <FormControl fullWidth required error={!!errors.categoryId}>
              <InputLabel>{t("shared.categories")}</InputLabel>
              <Select
                value={categoryId || ""}
                label={t("shared.categories")}
                onChange={(event) =>
                  setValue("categoryId", String(event.target.value), {
                    shouldValidate: true,
                  })
                }
              >
                {selectableCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && (
                <Typography size="body-paragraph-xs" className="mt-1 text-danger">
                  {t("registrations.staff.categoryRequired")}
                </Typography>
              )}
            </FormControl>
          )}

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
              label={t("shared.gender")}
              onChange={(event) =>
                setValue(
                  "gender",
                  event.target.value as CommonModels.ParticipantGenderEnum,
                )
              }
            >
              {Object.values(CommonModels.ParticipantGenderEnum).map((value) => (
                <MenuItem key={value} value={value}>
                  {formatLabel(value)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth required error={!!errors.birthYear}>
              <InputLabel>{t("registrations.public.birthYear")}</InputLabel>
              <Select
                value={
                  birthYear === undefined || Number.isNaN(birthYear)
                    ? ""
                    : birthYear
                }
                label={t("registrations.public.birthYear")}
                onChange={(event) =>
                  setValue("birthYear", Number(event.target.value))
                }
              >
                {birthYearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
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
              // eslint-disable-next-line react/jsx-no-duplicate-props
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
        </DialogContent>
        <DialogActions className="gap-2 px-6 pb-4">
          <Button type="button" variant="outlined" onClick={onClose} disabled={isPending}>
            {t("shared.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {mode === "edit"
              ? t("registrations.public.updateParticipant")
              : t("registrations.public.addParticipant")}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
