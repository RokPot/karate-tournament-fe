import { useTranslation } from "react-i18next";

import { ErrorState } from "@/components/shared/layout/ErrorState";
import Pill from "@/components/ui/Pill";
import { Loader } from "@/components/ui/status/Loader/Loader";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { RegistrationsModels } from "@/data/registrations/registrations.models";
import { RegistrationsQueries } from "@/data/registrations/registrations.queries";
import { DateUtils } from "@/util/date.utils";

type RegistrationSubmissionsListProps = {
  tournamentId: string;
};

const formatEuro = (amount: number) =>
  `${amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} €`;

export const RegistrationSubmissionsList = ({
  tournamentId,
}: RegistrationSubmissionsListProps) => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } =
    RegistrationsQueries.useFindSubmissionsByTournament(
      { tournamentId },
      { enabled: !!tournamentId },
    );

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

  const groups = data ?? [];

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xs border border-secondary-300 bg-secondary-200 p-10">
        <Typography size="body-paragraph-lg">
          {t("registrations.submissions.empty")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xs border border-secondary-300 bg-secondary-200">
      {groups.map((group) => {
        const contactName = [group.firstName, group.lastName]
          .filter(Boolean)
          .join(" ");
        const clubName = group.clubName?.trim();
        const title = clubName || contactName;
        const sends = group.submissions;
        const showSendChrome = sends.length > 1;
        const singleSendDate =
          !showSendChrome && sends[0]
            ? DateUtils.parseAndFormatDateTimeToLocaleShort(
                sends[0].details.createdAt,
              )
            : null;
        const headerDetails = [
          clubName ? contactName : null,
          group.email,
          singleSendDate,
        ].filter(Boolean);

        return (
          <div
            key={group.groupKey}
            className="border-b border-secondary-100 last:border-b-0"
          >
            <div className="flex flex-col gap-1 bg-secondary-50 px-4 py-3">
              <Typography
                size="body-paragraph-m"
                variant="prominent-2"
                as="span"
              >
                {title}
              </Typography>
              <Typography
                size="body-paragraph-s"
                className="text-neutral-200"
                as="span"
              >
                {headerDetails.join(" · ")}
              </Typography>
            </div>

            {sends.map((send) => (
              <SubmissionSend
                key={send.details.id}
                send={send}
                showDate={showSendChrome}
              />
            ))}

            <GroupFees fees={group.fees} />
          </div>
        );
      })}
    </div>
  );
};

const SubmissionSend = ({
  send,
  showDate,
}: {
  send: RegistrationsModels.RegistrationSubmissionResponseDto;
  showDate: boolean;
}) => {
  const { t } = useTranslation();
  const dateLabel = DateUtils.parseAndFormatDateTimeToLocaleShort(
    send.details.createdAt,
  );

  return (
    <div>
      {showDate && (
        <div className="border-t border-secondary-100 px-4 py-2">
          <Typography size="body-paragraph-s" className="text-neutral-200" as="span">
            {t("registrations.submissions.sendLabel", { date: dateLabel })}
          </Typography>
        </div>
      )}
      {send.participants.length === 0 ? (
        <div className="px-4 py-3">
          <Typography size="body-paragraph-s" className="text-neutral-200" as="span">
            {t("registrations.submissions.noParticipants")}
          </Typography>
        </div>
      ) : (
        <ul className="flex flex-col">
          {send.participants.map((participant) => (
            <SubmissionParticipantRow
              key={participant.id}
              participant={participant}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

const SubmissionParticipantRow = ({
  participant,
}: {
  participant: RegistrationsModels.RegistrationSubmissionParticipantDto;
}) => {
  const { t } = useTranslation();
  const name =
    [participant.firstName, participant.lastName].filter(Boolean).join(" ") ||
    "—";
  const details = [
    participant.gender ? t(`categories.create.${participant.gender}`) : null,
    participant.dateOfBirth
      ? DateUtils.formatAgeFromBirthDate(participant.dateOfBirth)
      : null,
    participant.weight ? `${participant.weight} kg` : null,
    participant.beltLevel ? t(`belt.${participant.beltLevel}`) : null,
  ].filter((label): label is string => Boolean(label) && label !== "-");

  return (
    <li className="flex flex-col gap-2 border-t border-secondary-100 px-4 py-3">
      <div className="flex min-w-0 flex-col gap-0-5">
        <Typography size="body-paragraph-m" as="span">
          {name}
        </Typography>
        {details.length > 0 && (
          <Typography
            size="body-paragraph-s"
            className="text-neutral-200"
            as="span"
          >
            {details.join(" · ")}
          </Typography>
        )}
      </div>
      {participant.categories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {participant.categories.map((category) => (
            <Pill key={category.id}>
              <Typography size="body-paragraph-s" as="span">
                {category.name}
              </Typography>
            </Pill>
          ))}
        </div>
      )}
    </li>
  );
};

const GroupFees = ({
  fees,
}: {
  fees: CommonModels.TournamentFeesCalculationDto;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 border-t border-secondary-100 bg-secondary-50 px-4 py-3">
      {fees.participants.map((line) => (
        <div
          key={line.userId}
          className="flex items-center justify-between gap-3"
        >
          <Typography size="body-paragraph-s" as="span">
            {t("registrations.submissions.participantFee", {
              name: line.name,
              count: line.categoryCount,
            })}
          </Typography>
          <Typography size="body-paragraph-s" as="span">
            {formatEuro(line.amount)}
          </Typography>
        </div>
      ))}
      {fees.teams.map((line) => (
        <div
          key={line.teamId}
          className="flex items-center justify-between gap-3"
        >
          <Typography size="body-paragraph-s" as="span">
            {t("registrations.submissions.teamFee", {
              name: line.name,
              category: line.categoryName,
            })}
          </Typography>
          <Typography size="body-paragraph-s" as="span">
            {formatEuro(line.amount)}
          </Typography>
        </div>
      ))}
      <div className="flex items-center justify-between gap-3">
        <Typography size="body-paragraph-m" variant="prominent-2" as="span">
          {t("registrations.submissions.total")}
        </Typography>
        <Typography size="body-paragraph-m" variant="prominent-2" as="span">
          {formatEuro(fees.total)}
        </Typography>
      </div>
    </div>
  );
};
