import { ClubsList } from "@/components/clubs/ClubsList";

const ClubsPage = () => {
  return (
    <div className="p-5">
      <ClubsList showCreateButton titleSize="h3" />
    </div>
  );
};

export default ClubsPage;
