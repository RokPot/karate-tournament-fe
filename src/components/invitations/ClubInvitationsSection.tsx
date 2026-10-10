import { HeaderCell, TextCell } from "@/components/categories/CategoryList";
import { CreateInvitationModal } from "@/components/invitations/CreateInvitationModal";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { Table } from "@/components/ui/table/Table";
import TableCell from "@/components/ui/table/TableCell";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { getInviteRoute } from "@/config/route.config";
import { CommonModels } from "@/data/common/common.models";
import { InvitationsModels } from "@/data/invitations/invitations.models";
import { InvitationsQueries } from "@/data/invitations/invitations.queries";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { cva } from "class-variance-authority";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

const canResendStatus = (status: CommonModels.InvitationStatusEnum) =>
  status === "pending" || status === "expired";

const resolveInviteUrl = (inviteUrl: string, token: string) => {
  if (inviteUrl.startsWith("http://") || inviteUrl.startsWith("https://")) {
    return inviteUrl;
  }
  const path = inviteUrl.startsWith("/") ? inviteUrl : getInviteRoute(token);
  return `${window.location.origin}${path}`;
};

interface ClubInvitationsSectionProps {
  clubId?: string;
  titleSize?: "h2" | "h3";
}

export const ClubInvitationsSection = ({
  clubId,
  titleSize = "h2",
}: ClubInvitationsSectionProps) => {
  const { t } = useTranslation();
  const { successToast, } = useToast();
  const { isAdmin, isClubOwner, isClubCoach } = useAuthRoles();
  const canResendInvitations = Boolean(isAdmin || isClubOwner || isClubCoach);
  const [inviteOpen, setInviteOpen] = useState(false);

  const { data: invitations, isError, isLoading, error, refetch } =
    InvitationsQueries.useFindAll({ clubId });



  const columns: ColumnDef<InvitationsModels.InvitationListItemDto>[] =
    useMemo(() => {
      const baseColumns: ColumnDef<InvitationsModels.InvitationListItemDto>[] =
        [
          {
            header: ({ header }) =>
              HeaderCell(header, t("invitations.inviteeName")),
            accessorKey: "firstName",
            cell: ({ row }) => {
              const { firstName, lastName } = row.original;
              const name =
                [firstName, lastName].filter(Boolean).join(" ") || "—";
              return TextCell(name);
            },
            enableSorting: false,
          },
          {
            header: ({ header }) => HeaderCell(header, t("invitations.email")),
            accessorKey: "email",
            cell: ({ row }) => TextCell(row.original.email),
            enableSorting: false,
          },
        ];

      if (!clubId) {
        baseColumns.push({
          header: ({ header }) =>
            HeaderCell(header, t("invitations.clubName")),
          accessorKey: "clubName",
          cell: ({ row }) => TextCell(row.original.clubName),
          enableSorting: false,
        });
      }

      baseColumns.push(
        {
          header: ({ header }) =>
            HeaderCell(header, t("invitations.createdAt")),
          accessorKey: "createdAt",
          cell: ({ row }) => TextCell(formatDate(row.original.createdAt)),
          enableSorting: false,
        },
        {
          header: ({ header }) =>
            HeaderCell(header, t("invitations.expiresAt")),
          accessorKey: "expiresAt",
          cell: ({ row }) => TextCell(formatDate(row.original.expiresAt)),
          enableSorting: false,
        },
        {
          header: ({ header }) =>
            HeaderCell(header, t("invitations.acceptedAt")),
          accessorKey: "acceptedAt",
          cell: ({ row }) =>
            TextCell(
              row.original.acceptedAt
                ? formatDate(row.original.acceptedAt)
                : "—",
            ),
          enableSorting: false,
        },
        {
          header: ({ header }) =>
            HeaderCell(header, t("invitations.status.label")),
          accessorKey: "status",
          cell: ({ row }) => StatusCell({ status: row.original.status }),
          enableSorting: false,
        },
      );

      if (canResendInvitations) {
        baseColumns.push({
          id: "actions",
          header: ({ header }) => HeaderCell(header, t("shared.actions")),
          cell: ({ row }) => ActionsCell({ row: row.original, canResend: canResendStatus(row.original.status) }),
          enableSorting: false,
          size: 140,
        });
      }

      return baseColumns;
    }, [canResendInvitations, clubId, t]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div>
      <div className="mb-3 flex h-14 items-center justify-between">
        <Typography size={titleSize}>{t("invitations.title")}</Typography>
        {clubId && canResendInvitations && (
          <Button variant="contained" onClick={() => setInviteOpen(true)}>
            {t("invitations.create.submit")}
          </Button>
        )}
      </div>
      {!(invitations?.length ?? 0) ? (
        <Typography size="body-paragraph-m">
          {t("invitations.noInvitations")}
        </Typography>
      ) : (
        <Table
          data={invitations ?? []}
          columns={columns}
          sorting={[]}
          onSortingChange={() => { }}
          rowSelection={{}}
          onRowClick={(row) => {
            navigator.clipboard.writeText(
              `${window.location.origin}${getInviteRoute(row.token)}`,
            );
            successToast({ text: t("clubs.inviteLinkCopied") });
          }}
        />
      )}
      {clubId && canResendInvitations && (
        <CreateInvitationModal
          open={inviteOpen}
          clubId={clubId}
          onClose={() => setInviteOpen(false)}
        />
      )}
    </div>
  );
};

const ActionsCell = ({
  row,
  canResend,
}: {
  row: InvitationsModels.InvitationListItemDto;
  canResend: boolean;

}) => {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();
  const { mutate: resendInvitation, isPending: isResending } = InvitationsQueries.useResend({
    invalidateCurrentModule: true,
    onSuccess: (response) => {
      const url = resolveInviteUrl(response.inviteUrl, response.token);
      navigator.clipboard.writeText(url).then(
        () =>
          successToast({
            text: t("invitations.resend.successCopied"),
          }),
        () =>
          successToast({
            text: t("invitations.resend.success"),
          }),
      );
    },
    onError: (mutationError) => {
      errorToast({
        text: mutationError?.message || t("invitations.resend.error"),
      });
    },
  });
  if (!canResend) {
    return TextCell("—");
  }
  const isThisResending = isResending;
  return (
    <TableCell align="end">
      <div
        className="flex items-center justify-end"
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          size="small"
          variant="outlined"
          disabled={isResending}
          onClick={() => resendInvitation({ id: row.id })}
        >
          {isThisResending
            ? t("invitations.resend.sending")
            : t("invitations.resend.submit")}
        </Button>
      </div>
    </TableCell>
  );

}

const statusIcon = cva("h-6 w-6 shrink-0 mr-2", {
  variants: {
    variant: {
      neutral: "text-neutral-200",
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

const StatusCell = ({
  status,
}: {
  status: CommonModels.InvitationStatusEnum;
}) => {
  const { t } = useTranslation();
  return (
    <TableCell className="flex flex-row items-center gap-2" align="start">
      <Typography size="body-paragraph-m" variant="prominent-2">
        <FontAwesomeIcon
          icon={faCircle}
          className={statusIcon({ variant: status })}
        />
        {t(`invitations.status.${status}`)}
      </Typography>
    </TableCell>
  );
};
