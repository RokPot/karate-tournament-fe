import { HeaderCell, TextCell } from "@/components/categories/CategoryList";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { Table } from "@/components/ui/table/Table";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { InvitationsModels } from "@/data/invitations/invitations.models";
import { InvitationsQueries } from "@/data/invitations/invitations.queries";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { getInviteRoute } from "@/config/route.config";
import TableCell from "@/components/ui/table/TableCell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { cva } from "class-variance-authority";

const STATUS_KEYS: Record<InvitationsModels.InvitationStatusEnum, string> = {
  pending: "invitations.statusPending",
  accepted: "invitations.statusAccepted",
  expired: "invitations.statusExpired",
  cancelled: "invitations.statusCancelled",
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
};

export const InvitationsPage = () => {
  const { t } = useTranslation();
  const { successToast } = useToast();

  const { data: invitations, isError, isLoading, error, refetch } = InvitationsQueries.useFindAll();

  const columns: ColumnDef<InvitationsModels.InvitationListItemDto>[] = useMemo(
    () => [
      {
        header: ({ header }) => HeaderCell(header, t("invitations.inviteeName")),
        accessorKey: "firstName",
        cell: ({ row }) => {
          const { firstName, lastName } = row.original;
          const name = [firstName, lastName].filter(Boolean).join(" ") || "—";
          return TextCell(name);
        },
      },
      {
        header: ({ header }) => HeaderCell(header, t("invitations.email")),
        accessorKey: "email",
        cell: ({ row }) => TextCell(row.original.email),
      },
      {
        header: ({ header }) => HeaderCell(header, t("invitations.clubName")),
        accessorKey: "clubName",
        cell: ({ row }) => TextCell(row.original.clubName),
      },



      {
        header: ({ header }) => HeaderCell(header, t("invitations.createdAt")),
        accessorKey: "createdAt",
        cell: ({ row }) => TextCell(formatDate(row.original.createdAt)),
      },
      {
        header: ({ header }) => HeaderCell(header, t("invitations.expiresAt")),
        accessorKey: "expiresAt",
        cell: ({ row }) => TextCell(formatDate(row.original.expiresAt)),
      },
      {
        header: ({ header }) => HeaderCell(header, t("invitations.acceptedAt")),
        accessorKey: "acceptedAt",
        cell: ({ row }) => TextCell(row.original.acceptedAt ? formatDate(row.original.acceptedAt) : "—"),
      },
      {
        header: ({ header }) => HeaderCell(header, t("invitations.status")),
        accessorKey: "status",
        cell: ({ row }) => StatusCell({ status: row.original.status }),
      },
    ],
    [t],
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="p-5">
      <div className="pb-4 h-14 flex items-center justify-start">
        <Typography size="h3">{t("invitations.title")}</Typography>
      </div>
      {!invitations?.length ? (
        <Typography size="body-paragraph-m">{t("invitations.noInvitations")}</Typography>
      ) : (
        <Table
          data={invitations}
          columns={columns}
          sorting={[]}
          onSortingChange={() => { }}
          rowSelection={{}}
          onRowClick={row => {
            navigator.clipboard.writeText(`${window.location.origin}${getInviteRoute(row.token)}`);
            successToast({ text: t("clubs.inviteLinkCopied") });
          }}

        />
      )}
    </div>
  );
};


const statusIcon = cva("h-6 w-6 shrink-0 mr-2", {
  variants: {
    variant: {
      neutral: "text-secondary-50",
      pending: "stroke-warning text-warning",
      accepted: "stroke-success text-success",
      expired: "stroke-danger text-danger",
      cancelled: "stroke-danger text-danger",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});
const StatusCell = ({ status }: { status: InvitationsModels.InvitationStatusEnum }) => {
  const { t } = useTranslation();
  return <TableCell className="flex flex-row items-center gap-2" align="start">
    <Typography size="body-paragraph-m" variant="prominent-2">
      <FontAwesomeIcon icon={faCircle} className={statusIcon({ variant: status })} />
      {t(STATUS_KEYS[status] as any)}
    </Typography>
  </TableCell>
};