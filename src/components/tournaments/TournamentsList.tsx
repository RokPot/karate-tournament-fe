import { Button } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { HeaderCell, TextCell } from "@/components/categories/CategoryList";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { CreateTournamentModal } from "@/components/tournaments/CreateTournamentModal";
import { DeclineTournamentDialog } from "@/components/tournaments/DeclineTournamentDialog";
import { TournamentStatusCell } from "@/components/tournaments/TournamentStatusCell";
import { useTournamentReview } from "@/components/tournaments/useTournamentReview";
import TableCell from "@/components/ui/table/TableCell";
import { Table } from "@/components/ui/table/Table";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { getTournamentDetailRoute } from "@/config/route.config";
import { CommonModels } from "@/data/common/common.models";
import { TournamentsModels } from "@/data/tournaments/tournaments.models";
import { TournamentsQueries } from "@/data/tournaments/tournaments.queries";
import { DateUtils } from "@/util/date.utils";

interface TournamentsListProps {
  showCreateButton?: boolean;
  titleSize?: "h2" | "h3";
  source?: "all" | "registered";
  status?: TournamentsModels.FindAllStatusParam;
  showApprovalActions?: boolean;
  showClubColumn?: boolean;
  showStatusColumn?: boolean;
}

export const TournamentsList = ({
  showCreateButton = false,
  titleSize = "h2",
  source = "all",
  status,
  showApprovalActions = false,
  showClubColumn = false,
  showStatusColumn,
}: TournamentsListProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [declineTournamentId, setDeclineTournamentId] = useState<string | null>(
    null,
  );
  const { approve, decline, isReviewPending } = useTournamentReview();
  const includeStatusColumn = showStatusColumn ?? source !== "registered";

  const allQuery = TournamentsQueries.useFindAll(
    { status },
    { enabled: source === "all" },
  );
  const registeredQuery = TournamentsQueries.useFindRegistered({
    enabled: source === "registered",
  });
  const { data: tournaments, isLoading, error, refetch } =
    source === "registered" ? registeredQuery : allQuery;

  const columns: ColumnDef<CommonModels.TournamentResponseDto>[] = useMemo(
    () => {
      const cols: ColumnDef<CommonModels.TournamentResponseDto>[] = [
        {
          header: ({ header }) => HeaderCell(header, t("shared.name")),
          accessorKey: "name",
          cell: ({ row }) => TextCell(row.original.name),
        },
      ];

      if (showClubColumn) {
        cols.push({
          header: ({ header }) => HeaderCell(header, t("shared.club")),
          accessorKey: "club",
          cell: ({ row }) => TextCell(row.original.club?.name || "—"),
        });
      }

      cols.push(
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
      );

      if (includeStatusColumn) {
        cols.push({
          header: ({ header }) => HeaderCell(header, t("tournaments.status.label")),
          accessorKey: "status",
          cell: ({ row }) => <TournamentStatusCell status={row.original.status} />,
        });
      }

      if (showApprovalActions) {
        cols.push({
          id: "actions",
          header: ({ header }) => HeaderCell(header, ""),
          cell: ({ row }) => (
            <TableCell align="end" className="gap-2">
              <div
                className="flex flex-row items-center gap-2"
                onClick={(event) => event.stopPropagation()}
              >
                <Button
                  size="small"
                  variant="contained"
                  disabled={isReviewPending}
                  onClick={() => approve.mutate({ id: row.original.id })}
                >
                  {t("tournaments.review.approve")}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  disabled={isReviewPending}
                  onClick={() => setDeclineTournamentId(row.original.id)}
                >
                  {t("tournaments.review.decline")}
                </Button>
              </div>
            </TableCell>
          ),
        });
      }

      return cols;
    },
    [approve, includeStatusColumn, isReviewPending, showApprovalActions, showClubColumn, t],
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const hasTournaments = tournaments && Array.isArray(tournaments) && tournaments.length > 0;
  const emptyLabel =
    status === "pending"
      ? t("tournaments.noPendingRequests")
      : t("tournaments.noTournaments");

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
          <Typography size="body-paragraph-lg">{emptyLabel}</Typography>
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

      <DeclineTournamentDialog
        open={!!declineTournamentId}
        isPending={decline.isPending}
        onClose={() => setDeclineTournamentId(null)}
        onConfirm={(reason) => {
          if (!declineTournamentId) return;
          decline.mutate(
            {
              id: declineTournamentId,
              data: reason ? { reason } : undefined,
            },
            { onSuccess: () => setDeclineTournamentId(null) },
          );
        }}
      />
    </div>
  );
};
