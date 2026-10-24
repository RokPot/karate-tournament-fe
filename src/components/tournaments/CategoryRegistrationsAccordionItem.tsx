import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, IconButton } from "@mui/material";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ArrowDropUpIcon } from "@/assets/icons/general/ArrowDropUp";
import { useCategoryFormatters } from "@/components/categories/category-formatters";
import { isTeamCategory } from "@/components/registrations/public/utils/teamOverlap";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import {
  StaffRegistrationModal,
  type StaffParticipantPayload,
} from "@/components/tournaments/registrations/StaffRegistrationModal";
import { ConfirmRemoveRegistrationDialog } from "@/components/tournaments/registrations/ConfirmRemoveRegistrationDialog";
import { uiOutlineClass } from "@/components/ui/global/outline";
import Pill from "@/components/ui/Pill";
import { Loader } from "@/components/ui/status/Loader/Loader";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { RegistrationsModels } from "@/data/registrations/registrations.models";
import { RegistrationsQueries } from "@/data/registrations/registrations.queries";
import { DateUtils } from "@/util/date.utils";

interface IProps {
  category: CommonModels.CategoryResponseDto;
  tournamentId: string;
  clubId?: string;
  registrationCount: number;
  canEdit?: boolean;
}

export const CategoryRegistrationsAccordionItem = ({
  category,
  tournamentId,
  clubId,
  registrationCount,
  canEdit = false,
}: IProps) => {
  const { t } = useTranslation();
  const { successToast, errorToast } = useToast();
  const {
    emptyLabel,
    formatAgeRange,
    formatBeltRange,
    formatTeamSize,
    formatWeightRange,
  } = useCategoryFormatters();
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingRegistration, setEditingRegistration] =
    useState<RegistrationsModels.RegistrationResponseDto | null>(null);
  const [removingRegistration, setRemovingRegistration] =
    useState<RegistrationsModels.RegistrationResponseDto | null>(null);

  const teamCategory = isTeamCategory(category);
  const canAdd = canEdit && !teamCategory;

  const { data, isLoading, error, refetch } =
    RegistrationsQueries.useFindByTournament(
      { tournamentId, categoryId: category.id },
      { enabled: isExpanded && !!tournamentId },
    );

  const createMutation = RegistrationsQueries.useCreateForStaff({
    invalidateCurrentModule: true,
    onSuccess: () => {
      successToast({ text: t("registrations.staff.addSuccess") });
      setModalMode(null);
    },
    onError: (mutationError) => {
      errorToast({
        text:
          mutationError?.serverMessage ||
          mutationError?.message ||
          t("registrations.staff.addError"),
      });
    },
  });

  const updateMutation = RegistrationsQueries.useUpdateIdentity({
    invalidateCurrentModule: true,
    onSuccess: () => {
      successToast({ text: t("registrations.staff.editSuccess") });
      setModalMode(null);
      setEditingRegistration(null);
    },
    onError: (mutationError) => {
      errorToast({
        text:
          mutationError?.serverMessage ||
          mutationError?.message ||
          t("registrations.staff.editError"),
      });
    },
  });

  const removeMutation = RegistrationsQueries.useRemove({
    invalidateCurrentModule: true,
    onSuccess: () => {
      successToast({ text: t("registrations.staff.removeSuccess") });
      setRemovingRegistration(null);
    },
    onError: (mutationError) => {
      errorToast({
        text:
          mutationError?.serverMessage ||
          mutationError?.message ||
          t("registrations.staff.removeError"),
      });
    },
  });

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending;

  const metadataPills = useMemo(() => {
    const age = formatAgeRange(category);
    const weight = formatWeightRange(category);
    const belt = formatBeltRange(category);
    const teamSize = formatTeamSize(category);

    const pills = [
      t(`discipline.${category.discipline}`),
      category.subDiscipline
        ? t(`subDiscipline.${category.subDiscipline}`)
        : null,
      category.gender ? t(`categories.create.${category.gender}`) : null,
      age !== emptyLabel ? age : null,
      weight !== emptyLabel ? weight : null,
      belt !== emptyLabel ? belt : null,
      teamSize !== emptyLabel ? teamSize : null,
    ];

    return pills.filter((label): label is string => Boolean(label));
  }, [
    category,
    emptyLabel,
    formatAgeRange,
    formatBeltRange,
    formatTeamSize,
    formatWeightRange,
    t,
  ]);

  const handleRemove = (
    registration: RegistrationsModels.RegistrationResponseDto,
  ) => {
    setRemovingRegistration(registration);
  };

  const handleSubmit = ({
    participant,
  }: {
    participant: StaffParticipantPayload;
    categoryId?: string;
  }) => {
    if (modalMode === "edit" && editingRegistration) {
      updateMutation.mutate({
        id: editingRegistration.id,
        data: participant,
      });
      return;
    }
    createMutation.mutate({
      data: {
        tournamentId,
        categoryId: category.id,
        clubId,
        ...participant,
      },
    });
  };

  return (
    <div className="border-b border-secondary-100 last:border-b-0">
      <button
        type="button"
        className={clsx(
          "flex w-full items-center gap-3 bg-secondary-50 px-4 py-3 text-left hover:bg-neutral-50 cursor-pointer transition duration-300",
          uiOutlineClass,
          isExpanded && "border-b border-secondary-300",
        )}
        aria-expanded={isExpanded}
        aria-label={t(
          isExpanded
            ? "registrations.collapseCategory"
            : "registrations.expandCategory",
          { name: category.name },
        )}
        onClick={() => setIsExpanded((open) => !open)}
      >
        <ArrowDropUpIcon
          className={clsx(
            "h-6 w-6 shrink-0 text-primary-300 transition-transform duration-200",
            isExpanded ? "rotate-0" : "rotate-180",
          )}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Typography size="body-paragraph-m" variant="prominent-2" as="span">
            {category.name}
          </Typography>
          {metadataPills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {metadataPills.map((label) => (
                <Pill key={label}>
                  <Typography size="body-paragraph-s" as="span">
                    {label}
                  </Typography>
                </Pill>
              ))}
            </div>
          )}
        </div>
        <Pill>
          <Typography
            size="body-paragraph-s"
            className="font-weight-500 text-primary-300"
            as="span"
          >
            {t("registrations.registeredCount", { count: registrationCount })}
          </Typography>
        </Pill>
      </button>
      {isExpanded && (
        <div className="bg-secondary-200 p-0">
          {canAdd && (
            <div className="flex justify-end border-b border-secondary-100 px-4 py-2">
              <Button
                size="small"
                variant="outlined"
                disabled={isMutating}
                onClick={() => {
                  setEditingRegistration(null);
                  setModalMode("create");
                }}
              >
                {t("registrations.staff.addParticipant")}
              </Button>
            </div>
          )}
          {teamCategory && canEdit && (
            <div className="border-b border-secondary-100 px-4 py-2">
              <Typography size="body-paragraph-s" className="text-neutral-200">
                {t("registrations.staff.teamAddUnavailable")}
              </Typography>
            </div>
          )}
          <AccordionRegistrationsPanel
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
            registrations={data ?? []}
            canEdit={canEdit}
            isMutating={isMutating}
            onEdit={(registration) => {
              setEditingRegistration(registration);
              setModalMode("edit");
            }}
            onRemove={handleRemove}
          />
        </div>
      )}

      <StaffRegistrationModal
        open={modalMode != null}
        mode={modalMode === "edit" ? "edit" : "create"}
        fixedCategoryId={category.id}
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
        categoryName={category.name}
        isPending={removeMutation.isPending}
        onClose={() => setRemovingRegistration(null)}
        onConfirm={() => {
          if (!removingRegistration) {
            return;
          }
          removeMutation.mutate({ id: removingRegistration.id });
        }}
      />
    </div>
  );
};

const AccordionRegistrationsPanel = ({
  isLoading,
  error,
  onRetry,
  registrations,
  canEdit,
  isMutating,
  onEdit,
  onRemove,
}: {
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  registrations: RegistrationsModels.RegistrationResponseDto[];
  canEdit: boolean;
  isMutating: boolean;
  onEdit: (registration: RegistrationsModels.RegistrationResponseDto) => void;
  onRemove: (registration: RegistrationsModels.RegistrationResponseDto) => void;
}) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="flex justify-center py-6 ">
        <Loader size="m" />
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (registrations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-6">
        <Typography size="body-paragraph-m">
          {t("registrations.noAttendees")}
        </Typography>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {registrations.map((registration) => (
        <RegistrationRow
          key={registration.id}
          registration={registration}
          canEdit={canEdit}
          isMutating={isMutating}
          onEdit={() => onEdit(registration)}
          onRemove={() => onRemove(registration)}
        />
      ))}
    </ul>
  );
};

const RegistrationRow = ({
  registration,
  canEdit,
  isMutating,
  onEdit,
  onRemove,
}: {
  registration: RegistrationsModels.RegistrationResponseDto;
  canEdit: boolean;
  isMutating: boolean;
  onEdit: () => void;
  onRemove: () => void;
}) => {
  const { t } = useTranslation();
  const { user, club, teamRole } = registration;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "—";
  const details = [
    club?.name,
    user?.gender ? t(`categories.create.${user.gender}`) : null,
    user?.dateOfBirth
      ? DateUtils.formatAgeFromBirthDate(user.dateOfBirth)
      : null,
    user?.weight ? `${user.weight} kg` : null,
    user?.beltLevel ? t(`belt.${user.beltLevel}`) : null,
    teamRole ? t(`registrations.public.teams.roles.${teamRole}`) : null,
  ].filter((label): label is string => Boolean(label) && label !== "-");

  return (
    <li className="flex items-start justify-between gap-3 border-b border-secondary-100 px-4 py-3 last:border-b-0">
      <div className="flex min-w-0 flex-col gap-1">
        <Typography size="body-paragraph-m" variant="prominent-2">
          {name}
        </Typography>
        {details.length > 0 && (
          <Typography size="body-paragraph-s" className="text-neutral-200">
            {details.join(" · ")}
          </Typography>
        )}
      </div>
      {canEdit && (
        <div className="flex shrink-0 items-center gap-0-5">
          <IconButton
            size="small"
            aria-label={t("shared.edit")}
            disabled={isMutating}
            onClick={onEdit}
          >
            <FontAwesomeIcon icon={faPencil} className="text-primary-300" size="xs" />
          </IconButton>
          <IconButton
            size="small"
            aria-label={t("shared.delete")}
            disabled={isMutating}
            onClick={onRemove}
          >
            <FontAwesomeIcon icon={faTrash} className="text-danger" size="xs" />
          </IconButton>
        </div>
      )}
    </li>
  );
};
