import type { FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { BeltLevelSelect } from "@/components/karate/BeltLevelSelect";
import { CategoriesModels } from "@/data/categories/categories.models";

interface CategoryBeltFieldsProps {
  watch: UseFormWatch<CategoriesModels.CreateCategoryDto>;
  setValue: UseFormSetValue<CategoriesModels.CreateCategoryDto>;
  errors: FieldErrors<CategoriesModels.CreateCategoryDto>;
  required?: boolean;
}

export function CategoryBeltFields({
  watch,
  setValue,
  errors,
  required = false,
}: CategoryBeltFieldsProps) {
  const { t } = useTranslation();
  const beltMin = watch("beltMin");
  const beltMax = watch("beltMax");

  return (
    <div className="grid grid-cols-2 gap-4">
      <BeltLevelSelect
        label={t("categories.create.beltMin")}
        value={beltMin}
        onChange={(value) => setValue("beltMin", value)}
        error={!!errors.beltMin}
        helperText={errors.beltMin?.message}
        required={required}
        allowEmpty={!required}
      />
      <BeltLevelSelect
        label={t("categories.create.beltMax")}
        value={beltMax}
        onChange={(value) => setValue("beltMax", value)}
        error={!!errors.beltMax}
        helperText={errors.beltMax?.message}
        required={required}
        allowEmpty={!required}
      />
    </div>
  );
}
