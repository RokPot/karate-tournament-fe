import { CreateCategoryForm } from "@/components/categories/CreateCategoryForm";
import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CategoriesQueries } from "@/data/categories/categories.queries";
import { QueryModule } from "@/data/invalidateQueries";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, Button, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
    open: boolean;
    onClose: () => void;
    tournamentId: string;
    currentCategoryNames: string[];
}

const AddOrCreateCategoryModal = ({ open, onClose, tournamentId, currentCategoryNames }: IProps) => {
    const { t } = useTranslation();
    const { successToast, errorToast } = useToast();
    const queryClient = useQueryClient();

    const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
    const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[]>([]);

    const { data: categories } = CategoriesQueries.useFindAll()

    const { mutate: assignCategoriesToTournament } = TournamentsQueries.useAssignCategories({
        onSuccess: async () => {
            successToast({ text: t("categories.addCategoryModal.success") });
            await queryClient.invalidateQueries({ queryKey: [QueryModule.Tournaments] });
            await queryClient.invalidateQueries({ queryKey: [TournamentsQueries.keys.findOne(tournamentId)] });
        },
        onError: (error) => {
            errorToast({ text: error?.message || t("categories.addCategoryModal.error") });

        }
    });

    const selectedCategories = useMemo(() => {
        return categories?.filter((category) => selectedCategoriesIds.includes(category.id)) || [];
    }, [categories, selectedCategoriesIds])

    const onSaveCategories = useCallback(() => {
        assignCategoriesToTournament({ id: tournamentId, data: { categoryIds: selectedCategoriesIds } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategoriesIds])

    useEffect(() => {
        setSelectedCategoriesIds(currentCategoryNames);
    }, [currentCategoryNames])

    return (
        <CustomDialog open={open} onClose={() => { }} >
            <DialogTitle >{t("categories.addCategory")}</DialogTitle>

            <DialogContent>
                <Autocomplete
                    multiple
                    renderInput={(params) => <TextField {...params} label={t("categories.create.name")} className="mt-2!" value="" />}
                    options={categories?.map((category) => ({ label: category.name, value: category.id })) || []}
                    value={selectedCategoriesIds.map((catId) => {
                        const category = categories?.find((cat) => cat.id === catId);
                        return { label: category?.name || "category not found", value: category?.id };
                    })}
                    isOptionEqualToValue={(option, val) => option.value === val.value}
                    onChange={(_, value) => {
                        const newIds = value.map((opt) => opt.value) as string[];
                        setSelectedCategoriesIds((prev) => {
                            const addedId = newIds.find((id) => prev.indexOf(id) === -1);
                            if (addedId !== undefined) {
                                return [...prev, addedId];
                            }
                            const removedId = prev.find((id) => newIds.indexOf(id) === -1);
                            if (removedId !== undefined) {
                                return prev.filter((id) => id !== removedId);
                            }
                            return prev;
                        });
                    }}
                />
                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                    {
                        selectedCategories.map((category) => (
                            <div key={category.id} className="flex flex-row gap-2 items-center justify-between hover:bg-secondary-200 p-2 rounded-md border-b border-secondary-100">
                                <div className="flex flex-col">
                                    <Typography size="body-paragraph-xs">{category.name}</Typography>
                                    <div className="flex flex-row gap-1">
                                        <Typography size="body-paragraph-xs">{t("shared.age")}: {category.ageMin} - {category.ageMax}</Typography>
                                        <Typography size="body-paragraph-xs">{t("shared.weight")}: {category.weightMin ? `${category.weightMin} - ${category.weightMax}` : "No weight limit"}</Typography>
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        <Typography size="body-paragraph-xs">{t("shared.belt")}: {t(`belt.${category.beltMin.toLowerCase()}` as any)} - {t(`belt.${category.beltMax.toLowerCase()}` as any)}</Typography>
                                        <Typography size="body-paragraph-xs">{t("shared.gender")}: {category.gender.join(", ")}</Typography>
                                    </div>
                                </div>
                                <IconButton className="h-8 w-8" onClick={() => {
                                    setSelectedCategoriesIds((prev) => prev.filter((id) => id !== category.id));
                                }}>
                                    <FontAwesomeIcon icon={faTrash} className="text-primary-300" size="2xs" />
                                </IconButton>
                            </div>
                        ))
                    }
                </div>
                <div className="flex flex-row gap-2 justify-end items-center mt-2">
                    <Button variant="outlined" onClick={onClose}>
                        {t("shared.cancel")}
                    </Button>
                    <Button variant="outlined" onClick={() => setShowNewCategoryForm(true)}>
                        {t("shared.createNew")}
                    </Button>
                    <Button variant="contained" onClick={onSaveCategories}>
                        {t("shared.save")}
                    </Button>
                </div>
                <CreateCategoryForm
                    open={showNewCategoryForm}
                    onClose={(newCategory) => {
                        setShowNewCategoryForm(false);
                        if (newCategory) {
                            currentCategoryNames.push(newCategory.id);
                        }
                    }}
                />
            </DialogContent>
        </CustomDialog>
    )
}

export default AddOrCreateCategoryModal;