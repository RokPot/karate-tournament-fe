import { Button } from "@mui/material";
import { ColumnDef, SortingState } from "@tanstack/react-table";
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
import { Table } from "@/components/ui/table/Table";
import TableCell from "@/components/ui/table/TableCell";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { getTournamentDetailRoute } from "@/config/route.config";
import { CommonModels } from "@/data/common/common.models";
import { DateUtils } from "@/util/date.utils";

interface TournamentsListProps {
  tournaments?: CommonModels.TournamentResponseDto[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  showCreateButton?: boolean;
  createClubId?: string;
  titleSize?: "h2" | "h3";
  showApprovalActions?: boolean;
  showClubColumn?: boolean;
  showStatusColumn?: boolean;
  hideHeader?: boolean;
  emptyLabel?: string;
}

export const TournamentsList = ({
  tournaments,
  isLoading = false,
  error,
  onRetry,
  showCreateButton = false,
  createClubId,
  titleSize = "h2",
  showApprovalActions = false,
  showClubColumn = true,
  showStatusColumn = true,
  hideHeader = false,
  emptyLabel,
}: TournamentsListProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [declineTournamentId, setDeclineTournamentId] = useState<string | null>(
    null,
  );
  const { approve, decline, isReviewPending } = useTournamentReview();
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<CommonModels.TournamentResponseDto>[] = useMemo(
    () => {
      const cols: ColumnDef<CommonModels.TournamentResponseDto>[] = [
        {
          header: ({ header }) => HeaderCell(header, t("shared.name")),
          accessorKey: "name",
          cell: ({ row }) => TextCell(row.original.name),
          enableSorting: false,
        },
      ];

      if (showClubColumn) {
        cols.push({
          header: ({ header }) => HeaderCell(header, t("shared.club")),
          accessorKey: "club",
          cell: ({ row }) => TextCell(row.original.club?.name || "—"),
          enableSorting: false,
        });
      }

      cols.push(
        {
          header: ({ header }) => HeaderCell(header, t("shared.location")),
          accessorKey: "location",
          cell: ({ row }) => TextCell(row.original.location || "—"),
          enableSorting: false,
        },
        {
          header: ({ header }) => HeaderCell(header, t("shared.registrationDeadline")),
          accessorKey: "registrationDeadline",
          cell: ({ row }) =>
            TextCell(DateUtils.parseAndFormatDateTimeToLocaleShort(row.original.registrationDeadline)),
          enableSorting: true,
          sortingFn: "datetime",
        },
        {
          header: ({ header }) => HeaderCell(header, t("shared.startDate")),
          accessorKey: "startDate",
          cell: ({ row }) => TextCell(DateUtils.parseAndFormatDateTimeToLocaleShort(row.original.startDate)),
          enableSorting: true,
          sortingFn: "datetime",
        },
        {
          header: ({ header }) => HeaderCell(header, t("shared.categories")),
          accessorKey: "categoryIds",
          cell: ({ row }) => TextCell(String(row.original.categoryIds.length)),
          enableSorting: false,
        },
      );

      if (showStatusColumn) {
        cols.push({
          header: ({ header }) => HeaderCell(header, t("tournaments.status.label")),
          accessorKey: "status",
          cell: ({ row }) => TournamentStatusCellComponent({ status: row.original.status }),
          enableSorting: false,
        });
      }

      if (showApprovalActions) {
        cols.push({
          id: "actions",
          header: ({ header }) => HeaderCell(header, ""),
          cell: ({ row }) => TournamentActionsCell({ onApprove: () => approve.mutate({ id: row.original.id }), onDecline: () => setDeclineTournamentId(row.original.id), isReviewPending }),
          enableSorting: false,
        });
      }

      return cols;
    },
    [approve, isReviewPending, showApprovalActions, showClubColumn, showStatusColumn, t],
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  const hasTournaments = tournaments && Array.isArray(tournaments) && tournaments.length > 0;

  return (
    <div>
      {!hideHeader && (
        <div className="mb-3 flex items-center justify-between">
          <Typography size={titleSize}>{t("shared.tournaments")}</Typography>
          {showCreateButton && (
            <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
              {t("tournaments.addTournament")}
            </Button>
          )}
        </div>
      )}

      {!hasTournaments ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 p-10">
          <Typography size="body-paragraph-lg">
            {emptyLabel ?? t("tournaments.noTournaments")}
          </Typography>
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
          sorting={sorting}
          onSortingChange={setSorting}
          manualSorting={false}
          onRowClick={(row) => router.push(getTournamentDetailRoute(row.id))}
        />
      )}

      {showCreateButton && (
        <CreateTournamentModal
          open={createDialogOpen}
          clubId={createClubId}
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
              data: reason ? { reason } : {},
            },
            { onSuccess: () => setDeclineTournamentId(null) },
          );
        }}
      />
    </div>
  );
};

const TournamentStatusCellComponent = ({ status }: { status: CommonModels.TournamentsFindAllStatusEnum }) => {
  return <TournamentStatusCell status={status} />
}

const TournamentActionsCell = (
  { onApprove, onDecline, isReviewPending }:
    { onApprove: () => void, onDecline: () => void, isReviewPending: boolean }
) => {
  const { t } = useTranslation();
  return <TableCell align="end" className="gap-2">
    <div
      className="flex flex-row items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Button
        size="small"
        variant="contained"
        disabled={isReviewPending}
        onClick={onApprove}
      >
        {t("tournaments.review.approve")}
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="error"
        disabled={isReviewPending}
        onClick={onDecline}
      >
        {t("tournaments.review.decline")}
      </Button>
    </div>
  </TableCell>
}
