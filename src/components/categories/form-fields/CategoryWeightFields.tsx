import { TextField } from "@mui/material";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CategoriesModels } from "@/data/categories/categories.models";

interface CategoryWeightFieldsProps {
  register: UseFormRegister<CategoriesModels.CreateCategoryDto>;
  errors: FieldErrors<CategoriesModels.CreateCategoryDto>;
  required?: boolean;
}

export function CategoryWeightFields({
  register,
  errors,
  required = false,
}: CategoryWeightFieldsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-4">
      <TextField
        label={t("categories.create.weightMin")}
        type="number"
        {...register("weightMin", {
          setValueAs: (value) =>
            value === "" || value == null ? undefined : Number(value),
        })}
        error={!!errors.weightMin}
        helperText={errors.weightMin?.message}
        fullWidth
        required={required}
      />
      <TextField
        label={t("categories.create.weightMax")}
        type="number"
        {...register("weightMax", {
          setValueAs: (value) =>
            value === "" || value == null ? undefined : Number(value),
        })}
        error={!!errors.weightMax}
        helperText={errors.weightMax?.message}
        fullWidth
        required={required}
      />
    </div>
  );
}
