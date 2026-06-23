import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CategoriesModels } from "@/data/categories/categories.models";
import { CommonModels } from "@/data/common/common.models";

interface CategoryGenderRadioProps {
  control: Control<CategoriesModels.CreateCategoryDto>;
  errors: FieldErrors<CategoriesModels.CreateCategoryDto>;
}

export function CategoryGenderRadio({ control, errors }: CategoryGenderRadioProps) {
  const { t } = useTranslation();

  return (
    <FormControl component="fieldset" error={!!errors.gender}>
      <FormLabel component="legend">{t("shared.gender")}</FormLabel>
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <RadioGroup
            row
            value={field.value ?? ""}
            onChange={(e) => {
              const { value } = e.target;
              field.onChange(
                value === ""
                  ? null
                  : (value as CommonModels.CategoryGenderEnum),
              );
            }}
          >
            <FormControlLabel
              value=""
              control={<Radio />}
              label={t("categories.create.noRestriction")}
            />
            <FormControlLabel
              value="male"
              control={<Radio />}
              label={t("categories.create.male")}
            />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label={t("categories.create.female")}
            />
          </RadioGroup>
        )}
      />
      {errors.gender?.message && (
        <FormHelperText>{errors.gender.message}</FormHelperText>
      )}
    </FormControl>
  );
}
