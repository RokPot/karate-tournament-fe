import { CreateCategoryForm } from "@/components/categories/CreateCategoryForm";
import { uiOutlineClass } from "@/components/ui/global/outline";
import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CategoriesQueries } from "@/data/categories/categories.queries";
import { QueryModule } from "@/data/invalidateQueries";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { faGripVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
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

const getLeadingNumber = (value: string) => {
    const match = value.trim().match(/^(\d+)/);
    return match ? Number(match[1]) : null;
};

const compareCategoryNames = (leftName: string, rightName: string) => {
    const leftLeadingNumber = getLeadingNumber(leftName);
    const rightLeadingNumber = getLeadingNumber(rightName);
    const leftStartsWithNumber = leftLeadingNumber !== null;
    const rightStartsWithNumber = rightLeadingNumber !== null;

    if (leftStartsWithNumber !== rightStartsWithNumber) {
        return leftStartsWithNumber ? -1 : 1;
    }

    if (leftLeadingNumber !== null && rightLeadingNumber !== null && leftLeadingNumber !== rightLeadingNumber) {
        return leftLeadingNumber - rightLeadingNumber;
    }

    return leftName.localeCompare(rightName, undefined, { numeric: true, sensitivity: "base" });
};

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
        if (!categories) {
            return [];
        }

        const categoriesById = new Map(categories.map((category) => [category.id, category]));
        return selectedCategoriesIds.flatMap((categoryId) => {
            const category = categoriesById.get(categoryId);
            return category ? [category] : [];
        });
    }, [categories, selectedCategoriesIds])

    const onSaveCategories = useCallback(() => {
        assignCategoriesToTournament({ id: tournamentId, data: { categoryIds: selectedCategoriesIds } });
        onClose();
    }, [assignCategoriesToTournament, onClose, selectedCategoriesIds, tournamentId])

    const onDragEnd = useCallback((result: DropResult) => {
        const { destination, source } = result;

        if (!destination || destination.index === source.index) {
            return;
        }

        setSelectedCategoriesIds((prev) => {
            const reorderedCategoryIds = [...prev];
            const [movedCategoryId] = reorderedCategoryIds.splice(source.index, 1);

            if (!movedCategoryId) {
                return prev;
            }

            reorderedCategoryIds.splice(destination.index, 0, movedCategoryId);
            return reorderedCategoryIds;
        });
    }, [])

    const onAutoOrderCategories = useCallback(() => {
        if (!categories) {
            return;
        }

        const categoriesById = new Map(categories.map((category) => [category.id, category]));

        setSelectedCategoriesIds((prev) => (
            [...prev].sort((leftId, rightId) => {
                const leftName = categoriesById.get(leftId)?.name ?? "";
                const rightName = categoriesById.get(rightId)?.name ?? "";
                return compareCategoryNames(leftName, rightName);
            })
        ));
    }, [categories])

    useEffect(() => {
        setSelectedCategoriesIds(currentCategoryNames);
    }, [currentCategoryNames])

    return (
        <CustomDialog open={open} onClose={() => { }} >
            <DialogTitle >{t("categories.addCategory")}</DialogTitle>

            <DialogContent >
                <Autocomplete
                    multiple
                    disableCloseOnSelect
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
                <div className="mt-2 flex justify-end">
                    <Button
                        variant="outlined"
                        onClick={onAutoOrderCategories}
                        disabled={selectedCategories.length < 2}
                    >
                        {t("categories.addCategoryModal.sortByName")}
                    </Button>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="selected-categories">
                        {(droppableProvided) => (
                            <div
                                ref={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                                className="mt-2 flex flex-col gap-2"
                            >
                                {selectedCategories.map((category, index) => (
                                    <Draggable key={category.id} draggableId={category.id} index={index}>
                                        {(draggableProvided, draggableSnapshot) => (
                                            <div
                                                ref={draggableProvided.innerRef}
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                                style={draggableProvided.draggableProps.style}
                                                className={`flex cursor-grab flex-row items-center justify-between gap-2 rounded-md border border-primary-300 p-2 active:cursor-grabbing ${uiOutlineClass} focus-visible:outline-primary-300 ${draggableSnapshot.isDragging ? "bg-primary-100 shadow-sm" : "bg-elevation-surface-1 hover:bg-primary-75"}`}
                                            >
                                                <div className="flex min-w-0 flex-1 flex-row items-start gap-2">
                                                    <div
                                                        aria-hidden="true"
                                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-tertiary-300"
                                                    >
                                                        <FontAwesomeIcon icon={faGripVertical} size="xs" />
                                                    </div>
                                                    <div className="flex min-w-0 flex-col">
                                                        <Typography size="body-paragraph-xs">{category.name}</Typography>
                                                        <div className="flex flex-row flex-wrap gap-1">
                                                            <Typography size="body-paragraph-xs">
                                                                {t("shared.discipline")}: {t(`discipline.${category.discipline}`)}
                                                            </Typography>
                                                            {category.subDiscipline && (
                                                                <Typography size="body-paragraph-xs">
                                                                    {t("shared.subDiscipline")}: {t(`subDiscipline.${category.subDiscipline}`)}
                                                                </Typography>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-row flex-wrap gap-1">
                                                            {(category.ageMin != null || category.ageMax != null) && (
                                                                <Typography size="body-paragraph-xs">
                                                                    {t("shared.age")}: {category.ageMin ?? "—"} - {category.ageMax ?? "—"}
                                                                </Typography>
                                                            )}
                                                            {(category.weightMin != null || category.weightMax != null) && (
                                                                <Typography size="body-paragraph-xs">
                                                                    {t("shared.weight")}: {category.weightMin ?? "—"} - {category.weightMax ?? "—"} kg
                                                                </Typography>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-row flex-wrap gap-1">
                                                            {(category.beltMin || category.beltMax) && (
                                                                <Typography size="body-paragraph-xs">
                                                                    {t("shared.belt")}: {category.beltMin ? t(`belt.${category.beltMin}`) : "—"}
                                                                    {category.beltMax && category.beltMax !== category.beltMin
                                                                        ? ` - ${t(`belt.${category.beltMax}`)}`
                                                                        : ""}
                                                                </Typography>
                                                            )}
                                                            {category.gender && (
                                                                <Typography size="body-paragraph-xs">
                                                                    {t("shared.gender")}: {t(`categories.create.${category.gender}`)}
                                                                </Typography>
                                                            )}
                                                            {category.teamSize != null && (
                                                                <Typography size="body-paragraph-xs">
                                                                    {t("categories.create.teamSize")}: {category.teamSize}
                                                                    {category.teamReservesSize != null
                                                                        ? `, ${t("categories.create.teamReservesSize")}: ${category.teamReservesSize}`
                                                                        : ""}
                                                                </Typography>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <IconButton
                                                    className="h-8 w-8"
                                                    onMouseDown={(event) => event.stopPropagation()}
                                                    onTouchStart={(event) => event.stopPropagation()}
                                                    onClick={() => {
                                                        setSelectedCategoriesIds((prev) => prev.filter((id) => id !== category.id));
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className="text-tertiary-300" size="2xs" />
                                                </IconButton>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {droppableProvided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
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
                            setSelectedCategoriesIds((prev) => [...prev, newCategory.id]);
                        }
                    }}
                />
            </DialogContent>
        </CustomDialog>
    )
}

export default AddOrCreateCategoryModal;