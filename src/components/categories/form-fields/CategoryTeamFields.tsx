import { TextField } from "@mui/material";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CategoriesModels } from "@/data/categories/categories.models";

interface CategoryTeamFieldsProps {
  register: UseFormRegister<CategoriesModels.CreateCategoryDto>;
  errors: FieldErrors<CategoriesModels.CreateCategoryDto>;
  required?: boolean;
}

export function CategoryTeamFields({
  register,
  errors,
  required = false,
}: CategoryTeamFieldsProps) {
  const { t } = useTranslation();

  return (
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
  );
}
