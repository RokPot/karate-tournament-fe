import { ErrorState } from "@/components/shared/layout/ErrorState";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import Pill from "@/components/ui/Pill";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { AuthContext } from "@/data/auth/auth.context";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import ClubMembersSection from "@/pages/clubs/ClubMembersSection";
import ClubTournamentSection from "@/pages/clubs/ClubTournamentSection";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";

const MyClub = () => {
    const { user: authUser } = AuthContext.useAuth();
    const { t } = useTranslation();

    const clubId = authUser?.clubId ?? "";
    const { data: club, isLoading, error, refetch } = ClubsQueries.useFindOne(
        { id: clubId },
        { enabled: !!clubId },
    );



    if (isLoading || !club) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={() => refetch()} />;
    }

    return (
        <div className="flex flex-row flex-1">
            <div className="flex flex-col gap-2 border-r border-primary-300 bg-primary-75 p-4 min-w-[300px] max-w-[300px]">
                <div className="flex flex-row items-center justify-between">
                    <Typography size="h2" >
                        {club?.name}
                    </Typography>
                    <IconButton className="h-10 w-10">
                        <FontAwesomeIcon icon={faPencil} className="text-tertiary-300" size="xs" />
                    </IconButton>
                </div>
                <div className="flex flex-row gap-1 flex-wrap">
                    <Pill>
                        <Typography size="body-paragraph-s" className="text-secondary-200">
                            {t("shared.location")}:
                        </Typography>
                        <Typography size="body-paragraph-s" className="font-weight-500">
                            {club?.address}
                        </Typography>
                    </Pill>
                    <Pill>
                        <Typography size="body-paragraph-s" className="text-secondary-200">
                            {t("shared.country")}:
                        </Typography>
                        <Typography size="body-paragraph-s" className="font-weight-500">
                            {club?.country}
                        </Typography>
                    </Pill>
                    <Pill>
                        <Typography size="body-paragraph-s" className="text-secondary-200">
                            {t("shared.registrationDeadline")}:
                        </Typography>
                        <Typography size="body-paragraph-s" className="font-weight-500">
                            {club?.createdAt}
                        </Typography>
                    </Pill>
                </div>

            </div>
            <div className="flex flex-col flex-1 px-6 py-4 gap-5">
                <ClubMembersSection
                    clubId={clubId}
                />

                <ClubTournamentSection
                    clubId={clubId}
                />
            </div>
        </div>
    )
}

export default MyClub;