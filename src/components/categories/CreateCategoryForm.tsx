import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  clearHiddenCategoryFields,
  getCategoryFormProfile,
  mapCategoryToFormValues,
  toCreateCategoryPayload,
  toUpdateCategoryPayload,
  validateCategoryForm,
} from "@/components/categories/category-form-profiles";
import { CategoryFieldsByDiscipline } from "@/components/categories/form-fields/CategoryFieldsByDiscipline";
import { CategoryGenderRadio } from "@/components/categories/form-fields/CategoryGenderRadio";
import { DisciplineSelect } from "@/components/karate/DisciplineSelect";
import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { CategoriesModels } from "@/data/categories/categories.models";
import { CategoriesQueries } from "@/data/categories/categories.queries";
import { CommonModels } from "@/data/common/common.models";
import { QueryModule } from "@/data/invalidateQueries";

interface IProps {
  open: boolean;
  mode?: "create" | "edit";
  initialCategory?: CommonModels.CategoryResponseDto | null;
  onClose: (category?: CommonModels.CategoryResponseDto) => void;
}

export const CreateCategoryForm = ({
  open,
  mode = "create",
  initialCategory,
  onClose,
}: IProps) => {
  const { successToast, errorToast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const createCategoryMutation = CategoriesQueries.useCreate({
    invalidateCurrentModule: true,
    onSuccess: async (data) => {
      successToast({ text: t("categories.create.success") });
      await queryClient.invalidateQueries({ queryKey: [QueryModule.Categories] });
      reset();
      onClose(data);
    },
    onError: (error) => {
      errorToast({ text: error?.message || t("categories.create.error") });
    },
  });
  const updateCategoryMutation = CategoriesQueries.useUpdate({
    invalidateCurrentModule: true,
    onSuccess: async (data) => {
      successToast({ text: t("categories.edit.success") });
      await queryClient.invalidateQueries({ queryKey: [QueryModule.Categories] });
      reset();
      onClose(data);
    },
    onError: (error) => {
      errorToast({ text: error?.message || t("categories.edit.error") });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
    setError,
  } = useForm<CategoriesModels.CreateCategoryDto>({
    resolver: zodResolver(CategoriesModels.CreateCategoryDtoSchema),
    defaultValues: {},
  });

  const discipline = watch("discipline");
  const profile = getCategoryFormProfile(discipline);
  const isEditMode = mode === "edit" && !!initialCategory;
  const isSubmitting =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      isEditMode && initialCategory
        ? mapCategoryToFormValues(initialCategory)
        : {},
    );
  }, [initialCategory, isEditMode, open, reset]);

  useEffect(() => {
    if (discipline) {
      clearHiddenCategoryFields(discipline, setValue);
    }
  }, [discipline, setValue]);

  const onSubmit = (data: CategoriesModels.CreateCategoryDto) => {
    const profileErrors = validateCategoryForm(data);
    if (profileErrors.length > 0) {
      for (const error of profileErrors) {
        setError(error.path, { message: error.message });
      }
      return;
    }

    if (isEditMode && initialCategory) {
      updateCategoryMutation.mutate({
        id: initialCategory.id,
        data: toUpdateCategoryPayload(data),
      });
      return;
    }

    createCategoryMutation.mutate({ data: toCreateCategoryPayload(data) });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitLabel = useMemo(() => {
    if (isEditMode) {
      return isSubmitting ? t("categories.edit.saving") : t("shared.save");
    }
    if (createCategoryMutation.isPending) {
      return t("shared.creating");
    }
    return t("shared.create");
  }, [isEditMode, isSubmitting, createCategoryMutation.isPending, t]);

  return (
    <CustomDialog open={open} onClose={handleClose} maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditMode ? t("categories.edit.title") : t("categories.create.title")}
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4!">
          <TextField
            label={t("categories.create.name")}
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            required
          />

          <DisciplineSelect
            label={t("shared.discipline")}
            value={discipline}
            onChange={(value) => setValue("discipline", value)}
            error={!!errors.discipline}
            helperText={errors.discipline?.message}
            required
          />

          <CategoryGenderRadio control={control} errors={errors} />

          {profile && (
            <CategoryFieldsByDiscipline
              profile={profile}
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            {t("shared.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !profile}
          >
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
