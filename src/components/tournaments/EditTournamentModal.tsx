import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { CommonModels } from "@/data/common/common.models";
import { QueryModule } from "@/data/invalidateQueries";
import { TournamentsModels } from "@/data/tournaments/tournaments.models";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";

import { TournamentFeeFields } from "./TournamentFeeFields";

interface IProps {
  open: boolean;
  tournament: CommonModels.TournamentResponseDto;
  onClose: () => void;
}

const EditTournamentFormSchema = z.object({
  name: z.string().max(255).min(1),
  location: z.string().max(255).min(1),
  startDate: z.string().min(1),
  registrationDeadline: z.string().min(1),
  fees: CommonModels.TournamentFeeScheduleDtoSchema,
});

type EditTournamentFormValues = z.infer<typeof EditTournamentFormSchema>;

const pad = (value: number) => String(value).padStart(2, "0");

const toDateTimeLocal = (iso?: string | null): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toFormValues = (
  tournament: CommonModels.TournamentResponseDto,
): EditTournamentFormValues => ({
  name: tournament.name,
  location: tournament.location,
  startDate: toDateTimeLocal(tournament.startDate),
  registrationDeadline: toDateTimeLocal(tournament.registrationDeadline),
  fees: {
    oneCategory: tournament.fees.oneCategory,
    twoCategories: tournament.fees.twoCategories,
    threeOrMoreCategories: tournament.fees.threeOrMoreCategories,
    team: tournament.fees.team,
  },
});

export const EditTournamentModal = ({ open, tournament, onClose }: IProps) => {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditTournamentFormValues>({
    resolver: zodResolver(EditTournamentFormSchema),
    defaultValues: toFormValues(tournament),
  });

  useEffect(() => {
    if (!open) return;
    reset(toFormValues(tournament));
  }, [open, tournament, reset]);

  const updateMutation = TournamentsQueries.useUpdate({
    invalidateCurrentModule: true,
    invalidateModules: [QueryModule.Clubs],
    onSuccess: () => {
      successToast({ text: t("tournaments.edit.success") });
      onClose();
    },
    onError: (error) => {
      errorToast({ text: error?.message || t("tournaments.edit.error") });
    },
  });

  const onSubmit = (data: EditTournamentFormValues) => {
    const payload: TournamentsModels.UpdateTournamentDto = {
      name: data.name,
      location: data.location,
      startDate: data.startDate
        ? new Date(data.startDate).toISOString()
        : data.startDate,
      registrationDeadline: data.registrationDeadline
        ? new Date(data.registrationDeadline).toISOString()
        : data.registrationDeadline,
      fees: data.fees,
    };
    updateMutation.mutate({ id: tournament.id, data: payload });
  };

  const handleClose = () => {
    reset(toFormValues(tournament));
    onClose();
  };

  return (
    <CustomDialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t("tournaments.edit.title")}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2!">
          <TextField
            label={t("shared.name")}
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            required
          />
          <TextField
            label={t("shared.location")}
            {...register("location")}
            error={!!errors.location}
            helperText={errors.location?.message}
            fullWidth
            required
          />
          <TextField
            label={t("tournaments.create.startTime")}
            type="datetime-local"
            {...register("startDate")}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t("shared.registrationDeadline")}
            type="datetime-local"
            {...register("registrationDeadline")}
            error={!!errors.registrationDeadline}
            helperText={errors.registrationDeadline?.message}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TournamentFeeFields register={register} errors={errors} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={updateMutation.isPending}>
            {t("shared.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending
              ? t("tournaments.edit.saving")
              : t("shared.save")}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
