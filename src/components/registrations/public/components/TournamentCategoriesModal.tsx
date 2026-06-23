import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { HeaderCell, TextCell } from "@/components/categories/CategoryList";
import CustomDialog from "@/components/ui/overlays/CustomDialog";
import { Table } from "@/components/ui/table/Table";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";

interface TournamentCategoriesModalProps {
  open: boolean;
  onClose: () => void;
  categories: CommonModels.CategoryResponseDto[];
}

export function TournamentCategoriesModal({
  open,
  onClose,
  categories,
}: TournamentCategoriesModalProps) {
  const { t } = useTranslation();

  const columns = useMemo<
    ColumnDef<CommonModels.CategoryResponseDto>[]
  >(
    () => [
      {
        header: ({ header }) =>
          HeaderCell(header, t("categories.create.name")),
        accessorKey: "name",
        cell: ({ row }) => TextCell(row.original.name),
        size: 200,
      },
      {
        header: ({ header }) =>
          HeaderCell(header, t("shared.discipline")),
        accessorKey: "discipline",
        cell: ({ row }) => TextCell(t(`discipline.${row.original.discipline}`)),
        size: 160,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.subDiscipline")),
        accessorKey: "subDiscipline",
        cell: ({ row }) =>
          TextCell(
            row.original.subDiscipline
              ? t(`subDiscipline.${row.original.subDiscipline}`)
              : "—",
          ),
        size: 160,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.gender")),
        accessorKey: "gender",
        cell: ({ row }) =>
          TextCell(
            row.original.gender
              ? t(`categories.create.${row.original.gender}`)
              : "—",
          ),
        size: 140,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.age")),
        accessorKey: "ageMin",
        cell: ({ row }) =>
          TextCell(`${row.original.ageMin ?? "–"} - ${row.original.ageMax ?? "–"}`),
        size: 120,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.weight")),
        accessorKey: "weightMin",
        cell: ({ row }) =>
          TextCell(
            `${row.original.weightMin ?? "–"} - ${row.original.weightMax ?? "–"}`,
          ),
        size: 120,
      },
      {
        header: ({ header }) =>
          HeaderCell(header, t("shared.belt")),
        accessorKey: "beltMin",
        cell: ({ row }) => {
          const { beltMin, beltMax } = row.original;
          if (!beltMin && !beltMax) {
            return TextCell("—");
          }
          if (beltMin && beltMax && beltMin !== beltMax) {
            return TextCell(`${t(`belt.${beltMin}`)} - ${t(`belt.${beltMax}`)}`);
          }
          return TextCell(beltMin ? t(`belt.${beltMin}`) : t(`belt.${beltMax!}`));
        },
        size: 170,
      },

    ],
    [t],
  );

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>{t("registrations.public.tournamentCategoriesTitle")}</DialogTitle>
      <DialogContent className="pt-2!">
        {categories?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <Typography size="body-paragraph-lg">
              {t("registrations.public.noCategories")}
            </Typography>
          </div>
        ) : (
          <div className="flex max-h-[60vh] min-h-[120px] w-full flex-[1_1_0]">
            <Table
              data={categories}
              columns={columns}
              sorting={[]}
              onSortingChange={() => { }}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("ui.modal.closeBtn")}</Button>
      </DialogActions>
    </CustomDialog>
  );
}
