import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CategorySelectionPanel } from "@/components/categories/CategorySelectionPanel";
import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { getTournamentDetailRoute } from "@/config/route.config";
import { CommonModels } from "@/data/common/common.models";
import { QueryModule } from "@/data/invalidateQueries";
import { TournamentsModels } from "@/data/tournaments/tournaments.models";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { useAuthUser } from "@/hooks/useAuthUser";

import { TournamentFeeFields } from "./TournamentFeeFields";

interface IProps {
  open: boolean;
  onClose: (newTournament?: CommonModels.TournamentResponseDto) => void;
  clubId?: string;
}

type CreateStep = "details" | "categories";

export const CreateTournamentModal = ({ open, onClose, clubId }: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAdmin } = useAuthRoles();
  const authUser = useAuthUser();
  const { successToast, errorToast } = useToast();
  const isRequest = !isAdmin;
  const resolvedClubId =
    clubId ?? (!isAdmin ? authUser?.clubId ?? undefined : undefined);

  const [step, setStep] = useState<CreateStep>("details");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const createMutation = TournamentsQueries.useCreate({
    invalidateCurrentModule: true,
    invalidateModules: [QueryModule.Clubs],
  });
  const assignMutation = TournamentsQueries.useAssignCategories();
  const isSubmitting = createMutation.isPending || assignMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TournamentsModels.CreateTournamentDto>({
    resolver: zodResolver(TournamentsModels.CreateTournamentDtoSchema),
    defaultValues: {
      fees: {
        oneCategory: 0,
        twoCategories: 0,
        threeOrMoreCategories: 0,
        team: 0,
      },
    },
  });

  const resetWizard = () => {
    reset();
    setStep("details");
    setSelectedCategoryIds([]);
  };

  const goToCategoriesStep = () => {
    setStep("categories");
  };

  const createTournament = async (data: TournamentsModels.CreateTournamentDto) => {
    const formattedData: TournamentsModels.CreateTournamentDto = {
      ...data,
      registrationDeadline: data.registrationDeadline
        ? new Date(data.registrationDeadline).toISOString()
        : data.registrationDeadline,
      startDate: data.startDate
        ? new Date(data.startDate).toISOString()
        : data.startDate,
      clubId: resolvedClubId,
    };

    try {
      const tournament = await createMutation.mutateAsync({ data: formattedData });

      if (selectedCategoryIds.length > 0) {
        try {
          await assignMutation.mutateAsync({
            id: tournament.id,
            data: { categoryIds: selectedCategoryIds },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : undefined;
          errorToast({
            text: message || t("categories.addCategoryModal.error"),
          });
        }
      }

      successToast({
        text: isRequest
          ? t("tournaments.create.requestSuccess")
          : t("tournaments.create.success"),
      });
      resetWizard();
      onClose(tournament);
      router.push(getTournamentDetailRoute(tournament.id));
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      errorToast({ text: message || t("tournaments.create.error") });
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    resetWizard();
    onClose();
  };

  let submitLabel = t("shared.next");
  if (step === "categories") {
    if (isSubmitting) {
      submitLabel = t("shared.creating");
    } else if (isRequest) {
      submitLabel = t("tournaments.create.submitRequest");
    } else {
      submitLabel = t("shared.create");
    }
  }

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      maxWidth={step === "categories" ? "lg" : "sm"}
      disableDismiss={isSubmitting}
    >
      <form
        onSubmit={
          step === "details"
            ? handleSubmit(goToCategoriesStep)
            : (event) => event.preventDefault()
        }
      >
        <DialogTitle>
          {isRequest
            ? t("tournaments.create.requestTitle")
            : t("tournaments.create.title")}
        </DialogTitle>
        <Stepper
          activeStep={step === "details" ? 0 : 1}
          alternativeLabel
          className="px-6"
        >
          <Step>
            <StepLabel>{t("tournaments.create.steps.details")}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t("tournaments.create.steps.categories")}</StepLabel>
          </Step>
        </Stepper>
        <DialogContent className="flex flex-col gap-4 pt-2!">
          <div
            className={
              step === "details" ? "flex flex-col gap-4" : "hidden"
            }
          >
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
          </div>
          <div className={step === "categories" ? "flex flex-col gap-2" : "hidden"}>
            <Typography size="body-paragraph-s" className="text-neutral-200">
              {t("tournaments.create.categoriesHint")}
            </Typography>
            <CategorySelectionPanel
              clubId={resolvedClubId}
              selectedCategoryIds={selectedCategoryIds}
              onSelectedCategoryIdsChange={setSelectedCategoryIds}
              enabled={open}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t("shared.cancel")}
          </Button>
          {step === "categories" && (
            <Button
              type="button"
              onClick={() => setStep("details")}
              disabled={isSubmitting}
            >
              {t("shared.back")}
            </Button>
          )}
          <Button
            type={step === "details" ? "submit" : "button"}
            variant="contained"
            disabled={isSubmitting}
            onClick={
              step === "categories" ? handleSubmit(createTournament) : undefined
            }
          >
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
