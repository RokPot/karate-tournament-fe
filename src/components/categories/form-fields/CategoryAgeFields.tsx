import { TextField } from "@mui/material";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CategoriesModels } from "@/data/categories/categories.models";

interface CategoryAgeFieldsProps {
  register: UseFormRegister<CategoriesModels.CreateCategoryDto>;
  errors: FieldErrors<CategoriesModels.CreateCategoryDto>;
  required?: boolean;
}

export function CategoryAgeFields({
  register,
  errors,
  required = false,
}: CategoryAgeFieldsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-4">
      <TextField
        label={t("categories.create.ageMin")}
        type="number"
        {...register("ageMin", {
          setValueAs: (value) =>
            value === "" || value == null ? undefined : Number(value),
        })}
        error={!!errors.ageMin}
        helperText={errors.ageMin?.message}
        fullWidth
        required={required}
      />
      <TextField
        label={t("categories.create.ageMax")}
        type="number"
        {...register("ageMax", {
          setValueAs: (value) =>
            value === "" || value == null ? undefined : Number(value),
        })}
        error={!!errors.ageMax}
        helperText={errors.ageMax?.message}
        fullWidth
        required={required}
      />
    </div>
  );
}
