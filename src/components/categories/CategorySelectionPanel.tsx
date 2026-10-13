import { useCategoryFormatters } from "@/components/categories/category-formatters";
import { compareCategoryNames } from "@/components/categories/category-name-sort";
import { CreateCategoryForm } from "@/components/categories/CreateCategoryForm";
import { uiOutlineClass } from "@/components/ui/global/outline";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CategoriesQueries } from "@/data/categories/categories.queries";
import { CommonModels } from "@/data/common/common.models";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { faGripVertical, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  clubId?: string;
  selectedCategoryIds: string[];
  onSelectedCategoryIdsChange: (ids: string[]) => void;
  enabled?: boolean;
}

const listClassName =
  "h-80 overflow-y-auto rounded-m border border-secondary-300 bg-elevation-surface-1 p-1";

export const CategorySelectionPanel = ({
  clubId,
  selectedCategoryIds,
  onSelectedCategoryIdsChange,
  enabled = true,
}: IProps) => {
  const { t } = useTranslation();
  const { isAdmin } = useAuthRoles();
  const { formatSummaryLine } = useCategoryFormatters();
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [search, setSearch] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState("");

  const { data: categories, isLoading } = CategoriesQueries.useFindAll(
    clubId ? { clubId, includeGlobal: true } : {},
    { enabled: enabled && (isAdmin || !!clubId) },
  );

  const selectedIdSet = useMemo(
    () => new Set(selectedCategoryIds),
    [selectedCategoryIds],
  );

  const categoriesById = useMemo(() => {
    if (!categories) {
      return new Map<string, CommonModels.CategoryResponseDto>();
    }
    return new Map(categories.map((category) => [category.id, category]));
  }, [categories]);

  const selectedCategories = useMemo(
    () =>
      selectedCategoryIds.flatMap((categoryId) => {
        const category = categoriesById.get(categoryId);
        return category ? [category] : [];
      }),
    [categoriesById, selectedCategoryIds],
  );

  const availableCategories = useMemo(() => {
    if (!categories) {
      return [];
    }

    const query = search.trim().toLowerCase();

    return categories
      .filter((category) => !selectedIdSet.has(category.id))
      .filter((category) =>
        disciplineFilter ? category.discipline === disciplineFilter : true,
      )
      .filter((category) => {
        if (!query) {
          return true;
        }

        const haystack = [
          category.name,
          t(`discipline.${category.discipline}`),
          category.subDiscipline
            ? t(`subDiscipline.${category.subDiscipline}`)
            : "",
          category.gender ? t(`categories.create.${category.gender}`) : "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      })
      .sort((left, right) => compareCategoryNames(left.name, right.name));
  }, [categories, disciplineFilter, search, selectedIdSet, t]);

  const addCategory = useCallback(
    (categoryId: string) => {
      if (selectedIdSet.has(categoryId)) {
        return;
      }
      onSelectedCategoryIdsChange([...selectedCategoryIds, categoryId]);
    },
    [onSelectedCategoryIdsChange, selectedCategoryIds, selectedIdSet],
  );

  const onAddAllVisible = useCallback(() => {
    if (availableCategories.length === 0) {
      return;
    }
    onSelectedCategoryIdsChange([
      ...selectedCategoryIds,
      ...availableCategories.map((category) => category.id),
    ]);
  }, [availableCategories, onSelectedCategoryIdsChange, selectedCategoryIds]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;

      if (!destination || destination.index === source.index) {
        return;
      }

      const reorderedCategoryIds = [...selectedCategoryIds];
      const [movedCategoryId] = reorderedCategoryIds.splice(source.index, 1);

      if (!movedCategoryId) {
        return;
      }

      reorderedCategoryIds.splice(destination.index, 0, movedCategoryId);
      onSelectedCategoryIdsChange(reorderedCategoryIds);
    },
    [onSelectedCategoryIdsChange, selectedCategoryIds],
  );

  const onAutoOrderCategories = useCallback(() => {
    onSelectedCategoryIdsChange(
      [...selectedCategoryIds].sort((leftId, rightId) => {
        const leftName = categoriesById.get(leftId)?.name ?? "";
        const rightName = categoriesById.get(rightId)?.name ?? "";
        return compareCategoryNames(leftName, rightName);
      }),
    );
  }, [categoriesById, onSelectedCategoryIdsChange, selectedCategoryIds]);

  const availableEmptyMessage = (() => {
    if (isLoading) {
      return t("shared.loadingState.text");
    }
    if (!categories || categories.length === 0) {
      return t("categories.noCategories");
    }
    if (selectedCategoryIds.length === categories.length && !search && !disciplineFilter) {
      return t("categories.addCategoryModal.emptyAvailableAllSelected");
    }
    return t("categories.addCategoryModal.emptyAvailable");
  })();

  return (
    <>
      <div className="mt-2 flex flex-col gap-3">
        <div className="flex flex-col gap-2 t:flex-row">
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            label={t("categories.addCategoryModal.search")}
            size="small"
            fullWidth
          />
          <FormControl size="small" className="min-w-44">
            <InputLabel>{t("shared.discipline")}</InputLabel>
            <Select
              value={disciplineFilter}
              label={t("shared.discipline")}
              onChange={(event) => setDisciplineFilter(event.target.value)}
            >
              <MenuItem value="">
                {t("categories.addCategoryModal.allDisciplines")}
              </MenuItem>
              {Object.values(CommonModels.DisciplineEnum).map((discipline) => (
                <MenuItem key={discipline} value={discipline}>
                  {t(`discipline.${discipline}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="flex flex-col gap-3 t:flex-row t:items-stretch">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Typography size="body-paragraph-s">
              {t("categories.addCategoryModal.availableCount", {
                count: availableCategories.length,
              })}
            </Typography>
            <Button
              type="button"
              variant="outlined"
              size="small"
              onClick={onAddAllVisible}
              disabled={availableCategories.length === 0}
            >
              {t("categories.addCategoryModal.addAllVisible")}
            </Button>
          </div>
          <div className={listClassName}>
            {availableCategories.length === 0 ? (
              <div className="flex h-full items-center justify-center p-3 text-center">
                <Typography size="body-paragraph-xs" className="text-neutral-200">
                  {availableEmptyMessage}
                </Typography>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {availableCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => addCategory(category.id)}
                    className={`flex w-full cursor-pointer flex-row items-center gap-2 rounded-m p-2 text-left hover:bg-secondary-75 ${uiOutlineClass} focus-visible:outline-secondary-300`}
                  >
                    <div
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-m text-primary-300"
                    >
                      <FontAwesomeIcon icon={faPlus} size="xs" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Typography size="body-paragraph-xs">{category.name}</Typography>
                      <Typography
                        size="body-paragraph-xs"
                        className="truncate text-neutral-200"
                      >
                        {formatSummaryLine(category)}
                      </Typography>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Typography size="body-paragraph-s">
              {t("categories.addCategoryModal.selectedCount", {
                count: selectedCategories.length,
              })}
            </Typography>
            <Button
              type="button"
              variant="outlined"
              size="small"
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
                  className={listClassName}
                >
                  {selectedCategories.length === 0 ? (
                    <div className="flex h-full items-center justify-center p-3 text-center">
                      <Typography
                        size="body-paragraph-xs"
                        className="text-neutral-200"
                      >
                        {t("categories.addCategoryModal.emptySelected")}
                      </Typography>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {selectedCategories.map((category, index) => (
                        <Draggable
                          key={category.id}
                          draggableId={category.id}
                          index={index}
                        >
                          {(draggableProvided, draggableSnapshot) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              style={draggableProvided.draggableProps.style}
                              className={`flex cursor-grab flex-row items-center justify-between gap-2 rounded-m p-2 active:cursor-grabbing ${uiOutlineClass} focus-visible:outline-secondary-300 ${draggableSnapshot.isDragging ? "bg-secondary-100 shadow-sm" : "hover:bg-secondary-75"}`}
                            >
                              <div className="flex min-w-0 flex-1 flex-row items-center gap-2">
                                <div
                                  aria-hidden="true"
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-m text-primary-300"
                                >
                                  <FontAwesomeIcon icon={faGripVertical} size="xs" />
                                </div>
                                <div className="flex min-w-0 flex-col">
                                  <Typography size="body-paragraph-xs">
                                    {category.name}
                                  </Typography>
                                  <Typography
                                    size="body-paragraph-xs"
                                    className="truncate text-neutral-200"
                                  >
                                    {formatSummaryLine(category)}
                                  </Typography>
                                </div>
                              </div>
                              <IconButton
                                type="button"
                                className="h-8 w-8"
                                onMouseDown={(event) => event.stopPropagation()}
                                onTouchStart={(event) => event.stopPropagation()}
                                onClick={() => {
                                  onSelectedCategoryIdsChange(
                                    selectedCategoryIds.filter(
                                      (id) => id !== category.id,
                                    ),
                                  );
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="text-primary-300"
                                  size="2xs"
                                />
                              </IconButton>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-start">
        <Button
          type="button"
          variant="outlined"
          onClick={() => setShowNewCategoryForm(true)}
        >
          {t("shared.createNew")}
        </Button>
      </div>
      <CreateCategoryForm
        open={showNewCategoryForm}
        onClose={(newCategory) => {
          setShowNewCategoryForm(false);
          if (newCategory) {
            onSelectedCategoryIdsChange([...selectedCategoryIds, newCategory.id]);
          }
        }}
      />
    </>
  );
};
