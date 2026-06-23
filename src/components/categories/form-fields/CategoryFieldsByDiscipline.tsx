import { useTranslation } from "react-i18next";

import type { CategoryFormProfile } from "@/components/categories/category-form-profiles";
import { CategoriesModels } from "@/data/categories/categories.models";
import { SubDisciplineSelect } from "@/components/karate/SubDisciplineSelect";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CategoryAgeFields } from "./CategoryAgeFields";
import { CategoryBeltFields } from "./CategoryBeltFields";
import { CategoryTeamFields } from "./CategoryTeamFields";
import { CategoryWeightFields } from "./CategoryWeightFields";

interface CategoryFieldsByDisciplineProps {
  profile: CategoryFormProfile;
  register: UseFormRegister<CategoriesModels.CreateCategoryDto>;
  errors: FieldErrors<CategoriesModels.CreateCategoryDto>;
  setValue: UseFormSetValue<CategoriesModels.CreateCategoryDto>;
  watch: UseFormWatch<CategoriesModels.CreateCategoryDto>;
}

export function CategoryFieldsByDiscipline({
  profile,
  register,
  errors,
  setValue,
  watch,
}: CategoryFieldsByDisciplineProps) {
  const { t } = useTranslation();
  const subDiscipline = watch("subDiscipline");

  return (
    <>
      {profile.show.subDiscipline && (
        <SubDisciplineSelect
          label={t("categories.create.subDiscipline")}
          value={subDiscipline}
          onChange={(value) => setValue("subDiscipline", value)}
          error={!!errors.subDiscipline}
          helperText={errors.subDiscipline?.message}
          required={profile.require.subDiscipline}
        />
      )}

      {profile.show.age && (
        <CategoryAgeFields
          register={register}
          errors={errors}
          required={profile.require.age}
        />
      )}

      {profile.show.weight && (
        <CategoryWeightFields
          register={register}
          errors={errors}
          required={profile.require.weight}
        />
      )}

      {profile.show.belt && (
        <CategoryBeltFields
          watch={watch}
          setValue={setValue}
          errors={errors}
          required={profile.require.belt}
        />
      )}

      {profile.show.team && (
        <CategoryTeamFields
          register={register}
          errors={errors}
          required={profile.require.team}
        />
      )}
    </>
  );
}
