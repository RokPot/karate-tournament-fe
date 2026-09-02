import { Button } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { HeaderCell, TextCell } from "@/components/categories/CategoryList";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { CreateTournamentModal } from "@/components/tournaments/CreateTournamentModal";
import { Table } from "@/components/ui/table/Table";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { getTournamentDetailRoute } from "@/config/route.config";
import { CommonModels } from "@/data/common/common.models";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { DateUtils } from "@/util/date.utils";

interface TournamentsListProps {
  showCreateButton?: boolean;
  titleSize?: "h2" | "h3";
}

export const TournamentsList = ({ showCreateButton = false, titleSize = "h2" }: TournamentsListProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: tournaments, isLoading, error, refetch } = TournamentsQueries.useFindAll();

  const columns: ColumnDef<CommonModels.TournamentResponseDto>[] = useMemo(
    () => [
      {
        header: ({ header }) => HeaderCell(header, t("shared.name")),
        accessorKey: "name",
        cell: ({ row }) => TextCell(row.original.name),
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.location")),
        accessorKey: "location",
        cell: ({ row }) => TextCell(row.original.location || "—"),
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.registrationDeadline")),
        accessorKey: "registrationDeadline",
        cell: ({ row }) =>
          TextCell(DateUtils.parseAndFormatDateTimeToLocaleShort(row.original.registrationDeadline)),
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.startDate")),
        accessorKey: "startDate",
        cell: ({ row }) => TextCell(DateUtils.parseAndFormatDateTimeToLocaleShort(row.original.startDate)),
      },
      {
        header: ({ header }) => HeaderCell(header, t("shared.categories")),
        accessorKey: "categoryIds",
        cell: ({ row }) => TextCell(String(row.original.categoryIds.length)),
      },
    ],
    [t],
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const hasTournaments = tournaments && Array.isArray(tournaments) && tournaments.length > 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <Typography size={titleSize}>{t("shared.tournaments")}</Typography>
        {showCreateButton && (
          <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
            {t("tournaments.addTournament")}
          </Button>
        )}
      </div>

      {!hasTournaments ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 p-10">
          <Typography size="body-paragraph-lg">{t("tournaments.noTournaments")}</Typography>
          {showCreateButton && (
            <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
              {t("tournaments.addTournament")}
            </Button>
          )}
        </div>
      ) : (
        <Table
          data={tournaments}
          columns={columns}
          tableLayout="auto"
          onRowClick={(row) => router.push(getTournamentDetailRoute(row.id))}
        />
      )}

      {showCreateButton && (
        <CreateTournamentModal
          open={createDialogOpen}
          onClose={(newTournament) => {
            setCreateDialogOpen(false);
            if (newTournament) {
              router.push(getTournamentDetailRoute(newTournament.id));
            }
          }}
        />
      )}
    </div>
  );
};
