import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { HeaderCell, TextCell } from "@/components/categories/CategoryList";
import { Table } from "@/components/ui/table/Table";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { RegistrationsModels } from "@/data/registrations/registrations.models";
import { DateUtils } from "@/util/date.utils";

interface IProps {
  registrations: RegistrationsModels.RegistrationResponseDto[];
  compact?: boolean;
}

const RegistrationList = ({ registrations, compact = false }: IProps) => {
  const { t } = useTranslation();

  const columns = useMemo<
    ColumnDef<RegistrationsModels.RegistrationResponseDto>[]
  >(
    () => [
      {
        header: ({ header }) => HeaderCell(header, t("shared.name")),
        accessorKey: "user.firstName",
        cell: ({ row }) =>
          TextCell(
            `${row.original.user?.firstName} ${row.original.user?.lastName}`,
          ),
        size: 300,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.gender")),
        accessorKey: "user.gender",
        cell: ({ row }) =>
          TextCell(
            row.original.user?.gender
              ? t(`categories.create.${row.original.user?.gender}`)
              : "-",
          ),
        size: 100,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.age")),
        id: "user.age",
        cell: ({ row }) =>
          TextCell(
            `${DateUtils.parseAndFormatDateToLocaleShort(
              row.original.user?.dateOfBirth,
            )} (${DateUtils.formatAgeFromBirthDate(row.original.user?.dateOfBirth)})`,
          ),
        size: 150,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.weight")),
        accessorKey: "user.weight",
        cell: ({ row }) =>
          TextCell(
            row.original.user?.weight ? `${row.original.user?.weight} kg` : "-",
          ),
        size: 100,
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.belt")),
        accessorKey: "user.gender",
        cell: ({ row }) =>
          TextCell(
            row.original.user?.beltLevel
              ? t(`belt.${row.original.user.beltLevel}`)
              : "-",
          ),
      },
    ],
    [t],
  );

  if (registrations.length === 0) {
    return (
      <div
        className={clsx(
          "flex flex-col items-center justify-center gap-4",
          compact ? "p-6" : "p-10",
        )}
      >
        <Typography size="body-paragraph-lg">
          {t("registrations.noAttendees")}
        </Typography>
      </div>
    );
  }

  return (
    <div
      className={clsx("flex w-full flex-[1_1_0]", !compact && "min-h-[400px]")}
    >
      <Table
        data={registrations}
        columns={columns}
        sorting={[]}
        onSortingChange={() => {}}
      />
    </div>
  );
};

export default RegistrationList;
