import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { TournamentsModels } from "@/data/tournaments/tournaments.models";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { getTournamentDetailRoute } from "@/config/route.config";
import { useRouter } from "next/router";
import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { CommonModels } from "@/data/common/common.models";

interface IProps {
  open: boolean;
  onClose: (newTournament?: CommonModels.TournamentResponseDto) => void;
  clubId?: string;
}

export const CreateTournamentModal = ({ open, onClose, clubId }: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { successToast, errorToast } = useToast();

  const createMutation = TournamentsQueries.useCreate({
    invalidateCurrentModule: true,
    onSuccess: (data) => {
      successToast({ text: t("tournaments.create.success") });
      onClose(data);
      router.push(getTournamentDetailRoute(data.id));
    },
    onError: (error) => {
      errorToast({ text: error?.message || t("tournaments.create.error") });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TournamentsModels.CreateTournamentDto>({
    resolver: zodResolver(TournamentsModels.CreateTournamentDtoSchema),
  });

  const onSubmit = (data: TournamentsModels.CreateTournamentDto) => {
    // Convert date and datetime-local inputs to proper formats
    const formattedData: TournamentsModels.CreateTournamentDto = {
      ...data,
      registrationDeadline: data.registrationDeadline
        ? new Date(data.registrationDeadline).toISOString()
        : data.registrationDeadline,
      startDate: data.startDate ? new Date(data.startDate).toISOString()
        : data.startDate,
      clubId,
    };
    createMutation.mutate({ data: formattedData });
  };

  const handleClose = () => {
    reset();
    onClose();
  };


  return (
    <CustomDialog open={open} onClose={handleClose} >
      <form onSubmit={handleSubmit(onSubmit)} >
        <DialogTitle>{t("tournaments.create.title")}</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={createMutation.isPending}>
            {t("shared.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={createMutation.isPending}>
            {createMutation.isPending ? t("shared.creating") : t("shared.create")}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
