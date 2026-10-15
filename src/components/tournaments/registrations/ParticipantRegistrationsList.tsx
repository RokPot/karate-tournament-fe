import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, IconButton } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ErrorState } from "@/components/shared/layout/ErrorState";
import { ConfirmRemoveRegistrationDialog } from "@/components/tournaments/registrations/ConfirmRemoveRegistrationDialog";
import { StaffRegistrationModal } from "@/components/tournaments/registrations/StaffRegistrationModal";
import Pill from "@/components/ui/Pill";
import { Loader } from "@/components/ui/status/Loader/Loader";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { RegistrationsModels } from "@/data/registrations/registrations.models";
import { RegistrationsQueries } from "@/data/registrations/registrations.queries";
import {
  RegistrationsStaffQueries,
  type StaffParticipantPayload,
} from "@/data/registrations/registrations.staff";
import { DateUtils } from "@/util/date.utils";

type Registration = RegistrationsModels.RegistrationResponseDto;

type ParticipantGroup = {
  userId: string;
  user?: Registration["user"];
  club?: Registration["club"];
  registrations: Registration[];
};

type ParticipantRegistrationsListProps = {
  tournamentId: string;
  categories: CommonModels.CategoryResponseDto[];
  clubId?: string;
  canEdit: boolean;
  query: string;
};

export const ParticipantRegistrationsList = ({
  tournamentId,
  categories,
  clubId,
  canEdit,
  query,
}: ParticipantRegistrationsListProps) => {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingRegistration, setEditingRegistration] =
    useState<Registration | null>(null);
  const [removingRegistration, setRemovingRegistration] =
    useState<Registration | null>(null);

  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  const { data, isLoading, error, refetch } =
    RegistrationsQueries.useFindByTournament(
      { tournamentId },
      { enabled: !!tournamentId },
    );

  const createMutation = RegistrationsStaffQueries.useStaffCreate({
    onSuccess: () => {
      successToast({ text: t("registrations.staff.addSuccess") });
      setModalMode(null);
    },
    onError: (mutationError) => {
      errorToast({
        text:
          mutationError?.message || t("registrations.staff.addError"),
      });
    },
  });

  const updateMutation = RegistrationsStaffQueries.useStaffUpdate({
    onSuccess: () => {
      successToast({ text: t("registrations.staff.editSuccess") });
      setModalMode(null);
      setEditingRegistration(null);
    },
    onError: (mutationError) => {
      errorToast({
        text:
          mutationError?.message || t("registrations.staff.editError"),
      });
    },
  });

  const removeMutation = RegistrationsStaffQueries.useStaffRemove({
    onSuccess: () => {
      successToast({ text: t("registrations.staff.removeSuccess") });
      setRemovingRegistration(null);
    },
    onError: (mutationError) => {
      errorToast({
        text:
          mutationError?.message || t("registrations.staff.removeError"),
      });
    },
  });

  const groups = useMemo(() => {
    const byUser = new Map<string, ParticipantGroup>();
    (data ?? []).forEach((registration) => {
      const existing = byUser.get(registration.userId);
      if (existing) {
        existing.registrations.push(registration);
        return;
      }
      byUser.set(registration.userId, {
        userId: registration.userId,
        user: registration.user,
        club: registration.club,
        registrations: [registration],
      });
    });
    const sorted = [...byUser.values()].sort((left, right) => {
      const leftName = [left.user?.lastName, left.user?.firstName]
        .filter(Boolean)
        .join(" ");
      const rightName = [right.user?.lastName, right.user?.firstName]
        .filter(Boolean)
        .join(" ");
      return leftName.localeCompare(rightName);
    });
    return sorted;
  }, [data]);

  const visibleGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return groups;
    }
    return groups.filter((group) => {
      const haystack = [
        group.user?.firstName,
        group.user?.lastName,
        group.club?.name,
        ...group.registrations.map(
          (registration) =>
            categoriesById.get(registration.categoryId)?.name ?? "",
        ),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [categoriesById, groups, query]);

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending;

  const handleRemove = (registration: Registration) => {
    setRemovingRegistration(registration);
  };

  const handleSubmit = ({
    participant,
    categoryId,
  }: {
    participant: StaffParticipantPayload;
    categoryId?: string;
  }) => {
    if (modalMode === "edit" && editingRegistration) {
      updateMutation.mutate({
        registrationId: editingRegistration.id,
        participant,
      });
      return;
    }
    if (!categoryId) {
      return;
    }
    createMutation.mutate({
      tournamentId,
      categoryId,
      clubId,
      participant,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader size="m" />
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {canEdit && (
        <div className="flex justify-end">
          <Button
            variant="contained"
            onClick={() => {
              setEditingRegistration(null);
              setModalMode("create");
            }}
          >
            {t("registrations.staff.addParticipant")}
          </Button>
        </div>
      )}
      {
        groups.length === 0 && <div className="flex flex-col items-center justify-center gap-3 rounded-xs border border-secondary-300 bg-secondary-200 p-10">
          <Typography size="body-paragraph-lg">
            {t("registrations.noAttendees")}
          </Typography>
          {canEdit && (
            <Button
              variant="contained"
              onClick={() => {
                setEditingRegistration(null);
                setModalMode("create");
              }}
            >
              {t("registrations.staff.addParticipant")}
            </Button>
          )}
        </div>
      }
      {
        visibleGroups.length === 0 && <div className="flex flex-col items-center justify-center gap-3 rounded-xs border border-secondary-300 bg-secondary-200 p-10">
          <Typography size="body-paragraph-lg">
            {t("registrations.search.noMatches")}
          </Typography>
        </div>
      }
      {
        visibleGroups.length > 0 && <div className="overflow-hidden rounded-xs border border-secondary-300 bg-secondary-200">
          {visibleGroups.map((group) => {
            const name =
              [group.user?.firstName, group.user?.lastName]
                .filter(Boolean)
                .join(" ") || "—";
            const details = [
              group.user?.gender
                ? t(`categories.create.${group.user.gender}`)
                : null,
              group.user?.dateOfBirth
                ? DateUtils.formatAgeFromBirthDate(group.user.dateOfBirth)
                : null,
              group.user?.weight ? `${group.user.weight} kg` : null,
              group.user?.beltLevel
                ? t(`belt.${group.user.beltLevel}`)
                : null,
            ].filter(
              (label): label is string => Boolean(label) && label !== "-",
            );
            return (
              <div
                key={group.userId}
                className="border-b border-secondary-100 last:border-b-0"
              >
                <div className="flex items-start justify-between gap-3 bg-secondary-50 px-4 py-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <Typography
                      size="body-paragraph-m"
                      variant="prominent-2"
                      as="span"
                    >
                      {name}
                    </Typography>
                    <Typography
                      size="body-paragraph-s"
                      className="text-neutral-200"
                      as="span"
                    >
                      {[group.club?.name, ...details]
                        .filter(Boolean)
                        .join(" · ")}
                    </Typography>
                  </div>
                  {canEdit && (
                    <IconButton
                      size="small"
                      aria-label={t("shared.edit")}
                      disabled={isMutating}
                      onClick={() => {
                        setEditingRegistration(group.registrations[0] ?? null);
                        setModalMode("edit");
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPencil}
                        className="text-primary-300"
                        size="xs"
                      />
                    </IconButton>
                  )}
                </div>
                <ul className="flex flex-col">
                  {group.registrations.map((registration) => {
                    const categoryName =
                      categoriesById.get(registration.categoryId)?.name ??
                      registration.categoryId;
                    return (
                      <li
                        key={registration.id}
                        className="flex items-center justify-between gap-3 border-t border-secondary-100 px-4 py-2"
                      >
                        <Pill>
                          <Typography size="body-paragraph-s" as="span">
                            {categoryName}
                          </Typography>
                        </Pill>
                        {canEdit && (
                          <IconButton
                            size="small"
                            aria-label={t("shared.delete")}
                            disabled={isMutating}
                            onClick={() => handleRemove(registration)}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-danger"
                              size="xs"
                            />
                          </IconButton>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      }



      <StaffRegistrationModal
        open={modalMode != null}
        mode={modalMode === "edit" ? "edit" : "create"}
        categories={categories}
        requireCategorySelect={modalMode === "create"}
        isPending={isMutating}
        initialValues={
          editingRegistration?.user
            ? {
              firstName: editingRegistration.user.firstName ?? "",
              lastName: editingRegistration.user.lastName ?? "",
              gender:
                editingRegistration.user.gender ??
                CommonModels.ParticipantGenderEnum.male,
              dateOfBirth:
                editingRegistration.user.dateOfBirth ??
                DateUtils.dateOfBirthFromBirthYear(
                  new Date().getFullYear() - 18,
                ),
              weight: editingRegistration.user.weight ?? 0,
              beltLevel:
                editingRegistration.user.beltLevel ??
                CommonModels.BeltEnum["10-kyu"],
            }
            : undefined
        }
        onClose={() => {
          setModalMode(null);
          setEditingRegistration(null);
        }}
        onSubmit={handleSubmit}
      />
      <ConfirmRemoveRegistrationDialog
        open={!!removingRegistration}
        name={
          [
            removingRegistration?.user?.firstName,
            removingRegistration?.user?.lastName,
          ]
            .filter(Boolean)
            .join(" ") || "—"
        }
        categoryName={
          removingRegistration
            ? (categoriesById.get(removingRegistration.categoryId)?.name ??
              removingRegistration.categoryId)
            : ""
        }
        isPending={removeMutation.isPending}
        onClose={() => setRemovingRegistration(null)}
        onConfirm={() => {
          if (!removingRegistration) {
            return;
          }
          removeMutation.mutate({ registrationId: removingRegistration.id });
        }}
      />
    </div>
  );
};
