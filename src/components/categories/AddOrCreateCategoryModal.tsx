import { CategorySelectionPanel } from "@/components/categories/CategorySelectionPanel";
import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { QueryModule } from "@/data/invalidateQueries";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { Button, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  currentCategoryNames: string[];
}

const AddOrCreateCategoryModal = ({
  open,
  onClose,
  tournamentId,
  currentCategoryNames,
}: IProps) => {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();
  const queryClient = useQueryClient();

  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[]>([]);

  const { data: tournament } = TournamentsQueries.useFindOne(
    { id: tournamentId },
    { enabled: open && !!tournamentId },
  );

  const tournamentClubId = tournament?.clubId ?? undefined;

  const { mutate: assignCategoriesToTournament } = TournamentsQueries.useAssignCategories({
    onSuccess: async () => {
      successToast({ text: t("categories.addCategoryModal.success") });
      await queryClient.invalidateQueries({ queryKey: [QueryModule.Tournaments] });
      await queryClient.invalidateQueries({
        queryKey: [TournamentsQueries.keys.findOne(tournamentId)],
      });
      await queryClient.invalidateQueries({ queryKey: [QueryModule.Registrations] });
    },
    onError: (error) => {
      errorToast({ text: error?.message || t("categories.addCategoryModal.error") });
    },
  });

  const onSaveCategories = useCallback(() => {
    assignCategoriesToTournament({
      id: tournamentId,
      data: { categoryIds: selectedCategoriesIds },
    });
    onClose();
  }, [assignCategoriesToTournament, onClose, selectedCategoriesIds, tournamentId]);

  useEffect(() => {
    if (open) {
      setSelectedCategoriesIds(currentCategoryNames);
    }
  }, [currentCategoryNames, open]);

  return (
    <CustomDialog open={open} onClose={() => {}} maxWidth="lg">
      <DialogTitle>{t("categories.addCategory")}</DialogTitle>
      <DialogContent>
        <CategorySelectionPanel
          clubId={tournamentClubId}
          selectedCategoryIds={selectedCategoriesIds}
          onSelectedCategoryIdsChange={setSelectedCategoriesIds}
          enabled={open}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t("shared.cancel")}
        </Button>
        <Button variant="contained" onClick={onSaveCategories}>
          {t("shared.save")}
        </Button>
      </DialogActions>
    </CustomDialog>
  );
};

export default AddOrCreateCategoryModal;
