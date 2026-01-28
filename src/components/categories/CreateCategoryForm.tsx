import { Button, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, FormGroup, FormLabel } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CategoriesModels } from "@/data/categories/categories.models";
import { CategoriesQueries } from "@/data/categories/categories.queries";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { CommonModels } from "@/data/common/common.models";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { QueryModule } from "@/data/invalidateQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@/components/ui/text/Typography/Typography";
import CustomDialog from "@/components/ui/overlays/CustomDialog";

interface IProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  currentCategoryIds: string[];
}

export const CreateCategoryForm = ({ open, onClose, tournamentId, }: IProps) => {
  const { successToast, errorToast } = useToast();
  const queryClient = useQueryClient();

  const createCategoryMutation = CategoriesQueries.useCreateAndAssign({
    invalidateCurrentModule: true,
    onSuccess: async () => {

      successToast({ text: "Category created successfully" });
      await queryClient.invalidateQueries({ queryKey: [QueryModule.Categories] });
      await queryClient.invalidateQueries({ queryKey: [QueryModule.Tournaments] });
      await queryClient.invalidateQueries({ queryKey: [TournamentsQueries.keys.findOne(tournamentId)] });
      reset();
      onClose();
    },
    onError: (error) => {
      errorToast({ text: error?.message || "Failed to create category" });
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
    createCategoryMutation.mutate({ data: { ...data, gender: genderSelection, tournamentId } });
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
        <DialogTitle>Create Category</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4!">
          <TextField
            label="Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            required
          />

          <FormControl fullWidth required error={!!errors.discipline}>
            <InputLabel>Discipline</InputLabel>
            <Select
              value={discipline || ""}
              onChange={(e) => setValue("discipline", e.target.value as CategoriesModels.DisciplineEnum)}
              label="Discipline"
            >
              <MenuItem value="kata">Kata</MenuItem>
              <MenuItem value="kumite">Kumite</MenuItem>
              <MenuItem value="yako-soku">Yako-soku</MenuItem>
            </Select>
            {errors.discipline && (
              <Typography size="body-paragraph-xs" className="text-danger mt-1">
                {errors.discipline.message}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth required error={!!errors.gender} component="fieldset">
            <FormLabel component="legend" required>
              Gender
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={genderSelection.includes("male")}
                    onChange={() => handleGenderChange("male")}
                  />
                }
                label="Male"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={genderSelection.includes("female")}
                    onChange={() => handleGenderChange("female")}
                  />
                }
                label="Female"
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
              label="Min Age"
              type="number"
              {...register("ageMin", { valueAsNumber: true })}
              error={!!errors.ageMin}
              helperText={errors.ageMin?.message}
              fullWidth
              required
            />
            <TextField
              label="Max Age"
              type="number"
              {...register("ageMax", { valueAsNumber: true })}
              error={!!errors.ageMax}
              helperText={errors.ageMax?.message}
              fullWidth
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Min Weight (kg)"
              type="number"
              {...register("weightMin", { valueAsNumber: true })}
              error={!!errors.weightMin}
              helperText={errors.weightMin?.message}
              fullWidth
            />
            <TextField
              label="Max Weight (kg)"
              type="number"
              {...register("weightMax", { valueAsNumber: true })}
              error={!!errors.weightMax}
              helperText={errors.weightMax?.message}
              fullWidth
            />
          </div>

          <FormControl fullWidth required error={!!errors.beltMin}>
            <InputLabel>Min Belt</InputLabel>
            <Select
              value={beltMin || ""}
              onChange={(e) => setValue("beltMin", e.target.value as CommonModels.BeltEnum)}
              label="Min Belt"
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
            <InputLabel>Max Belt</InputLabel>
            <Select
              value={beltMax || ""}
              onChange={(e) => setValue("beltMax", e.target.value as CommonModels.BeltEnum)}
              label="Max Belt"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={createCategoryMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createCategoryMutation.isPending || genderSelection.length === 0}
          >
            {createCategoryMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
