import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CategoriesModels } from "@/data/categories/categories.models";
import { CommonModels } from "@/data/common/common.models";

interface CategoryTeamFieldsProps {
  register: UseFormRegister<CategoriesModels.CreateCategoryDto>;
  errors: FieldErrors<CategoriesModels.CreateCategoryDto>;
  setValue: UseFormSetValue<CategoriesModels.CreateCategoryDto>;
  watch: UseFormWatch<CategoriesModels.CreateCategoryDto>;
  otherCategoryOptions: CommonModels.CategoryResponseDto[];
  excludeCategoryId?: string;
  allowOtherCategories: boolean;
  onAllowOtherCategoriesChange: (allowed: boolean) => void;
  required?: boolean;
}

export function CategoryTeamFields({
  register,
  errors,
  setValue,
  watch,
  otherCategoryOptions,
  excludeCategoryId,
  allowOtherCategories,
  onAllowOtherCategoriesChange,
  required = false,
}: CategoryTeamFieldsProps) {
  const { t } = useTranslation();
  const teamSize = watch("teamSize");
  const feederCategoryIds = watch("feederCategoryIds") ?? [];
  const teamSizeIsSet = typeof teamSize === "number" && teamSize > 0;
  const options = otherCategoryOptions.filter(
    (category) => category.id !== excludeCategoryId,
  );
  const selectedCategories = feederCategoryIds.flatMap((id) => {
    const match = options.find((category) => category.id === id);
    return match ? [match] : [];
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label={t("categories.create.teamSize")}
          type="number"
          {...register("teamSize", {
            setValueAs: (value) =>
              value === "" || value == null ? undefined : Number(value),
          })}
          error={!!errors.teamSize}
          helperText={errors.teamSize?.message}
          fullWidth
          required={required}
        />
        <TextField
          label={t("categories.create.teamReservesSize")}
          type="number"
          {...register("teamReservesSize", {
            setValueAs: (value) =>
              value === "" || value == null ? undefined : Number(value),
          })}
          error={!!errors.teamReservesSize}
          helperText={errors.teamReservesSize?.message}
          fullWidth
          required={required}
        />
      </div>

      {teamSizeIsSet && (
        <div className="flex flex-col gap-4">
          <FormControlLabel
            control={
              <Checkbox
                checked={allowOtherCategories}
                onChange={(event) => {
                  const allowed = event.target.checked;
                  onAllowOtherCategoriesChange(allowed);
                  if (!allowed) {
                    setValue("feederCategoryIds", []);
                    setValue("feederParticipantLimit", null);
                  }
                }}
              />
            }
            label={t("categories.create.allowOtherCategories")}
          />

          {allowOtherCategories && (
            <>
              <Autocomplete
                multiple
                options={options}
                value={selectedCategories}
                onChange={(_event, value) =>
                  setValue(
                    "feederCategoryIds",
                    value.map((category) => category.id),
                    { shouldValidate: true },
                  )
                }
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("categories.create.otherCategories")}
                    error={!!errors.feederCategoryIds}
                    helperText={errors.feederCategoryIds?.message}
                  />
                )}
              />
              <TextField
                label={t("categories.create.otherCategorySeats")}
                type="number"
                {...register("feederParticipantLimit", {
                  setValueAs: (value) =>
                    value === "" || value == null ? null : Number(value),
                })}
                error={!!errors.feederParticipantLimit}
                helperText={errors.feederParticipantLimit?.message}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
