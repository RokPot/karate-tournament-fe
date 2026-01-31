import { Button, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, FormGroup, FormLabel } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CategoriesModels } from "@/data/categories/categories.models";
import { CategoriesQueries } from "@/data/categories/categories.queries";
import { CommonModels } from "@/data/common/common.models";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { QueryModule } from "@/data/invalidateQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@/components/ui/text/Typography/Typography";
import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { useTranslation } from "react-i18next";

interface IProps {
  open: boolean;
  onClose: (category?: CategoriesModels.CategoryResponseDto) => void;

}

export const CreateCategoryForm = ({ open, onClose }: IProps) => {
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

  const [genderSelection, setGenderSelection] = useState<CategoriesModels.CategoryEnum[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoriesModels.CreateCategoryDto>({
    resolver: zodResolver(CategoriesModels.CreateCategoryDtoSchema),
    defaultValues: {
      gender: [],
    },
  });

  const discipline = watch("discipline");
  const beltMin = watch("beltMin");
  const beltMax = watch("beltMax");

  const onSubmit = (data: CategoriesModels.CreateCategoryDto) => {
    createCategoryMutation.mutate({ data: { ...data, gender: genderSelection } });
  };

  const handleClose = () => {
    reset();
    setGenderSelection([]);
    onClose();
  };

  const handleGenderChange = (gender: CategoriesModels.CategoryEnum) => {
    setGenderSelection((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    );
  };

  return (
    <CustomDialog open={open} onClose={handleClose} maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t("categories.create.title")}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4!">
          <TextField
            label={t("categories.create.name")}
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            required
          />

          <FormControl fullWidth required error={!!errors.discipline}>
            <InputLabel>{t("shared.discipline")}</InputLabel>
            <Select
              value={discipline || ""}
              onChange={(e) => setValue("discipline", e.target.value as CategoriesModels.DisciplineEnum)}
              label={t("shared.discipline")}
            >
              <MenuItem value="kata">{t("shared.kata")}</MenuItem>
              <MenuItem value="kumite">{t("shared.kumite")}</MenuItem>
              <MenuItem value="yako-soku">{t("shared.yako-soku")}</MenuItem>
            </Select>
            {errors.discipline && (
              <Typography size="body-paragraph-xs" className="text-danger mt-1">
                {errors.discipline.message}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth required error={!!errors.gender} component="fieldset">
            <FormLabel component="legend" required>
              {t("shared.gender")}
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={genderSelection.includes("male")}
                    onChange={() => handleGenderChange("male")}
                  />
                }
                label={t("categories.create.male")}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={genderSelection.includes("female")}
                    onChange={() => handleGenderChange("female")}
                  />
                }
                label={t("categories.create.female")}
              />
            </FormGroup>
            {errors.gender && (
              <Typography size="body-paragraph-xs" className="text-danger mt-1">
                {errors.gender.message}
              </Typography>
            )}
          </FormControl>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label={t("categories.create.ageMin")}
              type="number"
              {...register("ageMin", { valueAsNumber: true })}
              error={!!errors.ageMin}
              helperText={errors.ageMin?.message}
              fullWidth
            />
            <TextField
              label={t("categories.create.ageMax")}
              type="number"
              {...register("ageMax", { valueAsNumber: true })}
              error={!!errors.ageMax}
              helperText={errors.ageMax?.message}
              fullWidth
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label={t("categories.create.weightMin")}
              type="number"
              {...register("weightMin", { valueAsNumber: true })}
              error={!!errors.weightMin}
              helperText={errors.weightMin?.message}
              fullWidth
            />
            <TextField
              label={t("categories.create.weightMax")}
              type="number"
              {...register("weightMax", { valueAsNumber: true })}
              error={!!errors.weightMax}
              helperText={errors.weightMax?.message}
              fullWidth
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth required error={!!errors.beltMin}>
              <InputLabel>{t("categories.create.beltMin")}</InputLabel>
              <Select
                value={beltMin || ""}
                onChange={(e) => setValue("beltMin", e.target.value as CommonModels.BeltEnum)}
                label={t("categories.create.beltMin")}
              >
                {Object.values(CommonModels.BeltEnum).map((belt) => (
                  <MenuItem key={belt} value={belt}>
                    {belt.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
              {errors.beltMin && (
                <Typography size="body-paragraph-xs" className="text-danger mt-1">
                  {errors.beltMin.message}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth required error={!!errors.beltMax}>
              <InputLabel>{t("categories.create.beltMax")}</InputLabel>
              <Select
                value={beltMax || ""}
                onChange={(e) => setValue("beltMax", e.target.value as CommonModels.BeltEnum)}
                label={t("categories.create.beltMax")}
              >
                {Object.values(CommonModels.BeltEnum).map((belt) => (
                  <MenuItem key={belt} value={belt}>
                    {belt.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
              {errors.beltMax && (
                <Typography size="body-paragraph-xs" className="text-danger mt-1">
                  {errors.beltMax.message}
                </Typography>
              )}
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={createCategoryMutation.isPending}>
            {t("shared.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createCategoryMutation.isPending || genderSelection.length === 0}
          >
            {createCategoryMutation.isPending ? t("shared.creating") : t("shared.create")}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
