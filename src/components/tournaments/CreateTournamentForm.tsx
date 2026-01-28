import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TournamentsModels } from "@/data/tournaments/tournaments.models";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { getTournamentDetailRoute, RouteConfig } from "@/config/route.config";
import { useRouter } from "next/router";
import CustomDialog from "@/components/ui/overlays/CustomDialog";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export const CreateTournamentForm = ({ open, onClose }: IProps) => {
  const router = useRouter();
  const { successToast, errorToast } = useToast();
  const createMutation = TournamentsQueries.useCreate({
    invalidateCurrentModule: true,
    onSuccess: (data) => {
      successToast({ text: "Tournament created successfully" });
      onClose();
      router.push(getTournamentDetailRoute(data.id));
    },
    onError: (error) => {
      errorToast({ text: error?.message || "Failed to create tournament" });
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
      // date is already in YYYY-MM-DD format from date input
      // registrationDeadline needs to be converted from datetime-local (YYYY-MM-DDTHH:mm) to ISO string
      registrationDeadline: data.registrationDeadline
        ? new Date(data.registrationDeadline).toISOString()
        : data.registrationDeadline,
      startDate: data.startDate,
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
        <DialogTitle>Create Tournament</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2!">
          <TextField
            label="Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            required
          />
          <TextField
            label="Location"
            {...register("location")}
            error={!!errors.location}
            helperText={errors.location?.message}
            fullWidth
            required
          />
          <TextField
            label="Start Time"
            type="datetime-local"
            {...register("startDate")}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Registration Deadline"
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
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
