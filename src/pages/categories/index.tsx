import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { CategoryCreateEditModal } from "@/components/categories/CategoryCreateEditModal";
import { CategoryList } from "@/components/categories/CategoryList";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";
import { CategoriesQueries } from "@/data/categories/categories.queries";
import { useAuthRoles } from "@/hooks/useAuthRoles";

const CategoriesPage = () => {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();
  const { isClubOwner, isAdmin } = useAuthRoles();
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const canManageCategories = isClubOwner || isAdmin;

  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = CategoriesQueries.useFindAll();

  const duplicateMutation = CategoriesQueries.useDuplicate({
    invalidateCurrentModule: true,
    onSuccess: () => {
      successToast({ text: t("categories.actions.duplicateSuccess") });
      setSelectedCategoryIds([]);
    },
    onError: (mutationError) => {
      errorToast({
        text:
          mutationError instanceof Error
            ? mutationError.message
            : t("categories.actions.duplicateError"),
      });
    },
  });

  const deleteMutation = CategoriesQueries.useRemoveMany({
    invalidateCurrentModule: true,
    onSuccess: () => {
      successToast({ text: t("categories.actions.deleteSuccess") });
      setSelectedCategoryIds([]);
    },
    onError: (mutationError) => {
      errorToast({
        text:
          mutationError instanceof Error
            ? mutationError.message
            : t("categories.actions.deleteError"),
      });
    },
  });

  const isMutating = duplicateMutation.isPending || deleteMutation.isPending;
  const selectedCategory = useMemo(
    () =>
      categories?.find((category) => category.id === selectedCategoryIds[0]) ??
      null,
    [categories, selectedCategoryIds],
  );

  const handleDuplicate = () => {
    if (selectedCategoryIds.length === 0) {
      return;
    }

    duplicateMutation.mutate({
      data: {
        categoryIds: selectedCategoryIds,
      },
    });
  };

  const handleEdit = () => {
    if (!selectedCategory) {
      return;
    }

    setEditingCategoryId(selectedCategory.id);
  };

  const handleCloseCategoryModal = () => {
    setCreateCategoryDialogOpen(false);
    setEditingCategoryId(null);
  };

  const handleDelete = () => {
    if (selectedCategoryIds.length === 0) {
      return;
    }

    deleteMutation.mutate({
      data: {
        categoryIds: selectedCategoryIds,
      },
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Typography size="h2">
          {t("categories.title")} ({categories?.length ?? 0})
        </Typography>

        {canManageCategories && (
          <div className="flex items-center gap-2">
            <Button
              variant="contained"
              onClick={() => setCreateCategoryDialogOpen(true)}
            >
              <div className="flex flex-row items-center gap-0-5">
                <FontAwesomeIcon icon={faAdd} />
                {t("categories.addCategory")}
              </div>
            </Button>
            {selectedCategoryIds.length > 0 && (
              <>
                {selectedCategoryIds.length === 1 && (
                  <Button variant="outlined" onClick={handleEdit}>
                    {t("shared.edit")}
                  </Button>
                )}
                <Button
                  variant="outlined"
                  onClick={handleDuplicate}
                  disabled={isMutating}
                >
                  {t("shared.duplicate")}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  disabled={isMutating}
                >
                  {t("shared.delete")}
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <CategoryList
        categories={categories ?? []}
        mode="edit"
        selectedCategoryIds={selectedCategoryIds}
        onSelectedCategoryIdsChange={setSelectedCategoryIds}
      />

      <CategoryCreateEditModal
        open={createCategoryDialogOpen || !!editingCategoryId}
        category={
          categories?.find((category) => category.id === editingCategoryId)

        }
        onClose={handleCloseCategoryModal}
      />
    </div>
  );
};

export default function Component() {
  return (
    <AuthGuard type="private" redirectTo={RouteConfig.signin}>
      <CategoriesPage />
    </AuthGuard>
  );
}
