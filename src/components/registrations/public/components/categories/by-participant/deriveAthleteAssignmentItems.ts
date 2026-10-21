import type { DraftParticipant } from "@/components/registrations/public/types";
import { isTeamCategory } from "@/components/registrations/public/utils/teamOverlap";
import { RegistrationsModels } from "@/data/registrations/registrations.models";

export type ParticipantEligibleCategories = {
  participantIndex: number;
  participant: DraftParticipant;
  categories: RegistrationsModels.PublicParticipantSuitableCategoriesItemDto["categories"];
};

export function deriveAthleteAssignmentItems(
  participants: DraftParticipant[],
  items: RegistrationsModels.GetBulkPublicSuitableCategoriesResponse | undefined,
): {
  participantItems: ParticipantEligibleCategories[];
  teamItems: RegistrationsModels.CategorySuitableParticipantsItemDto[];
} {
  const participantItems = participants.map((participant, participantIndex) => {
    const rawCategories = items?.[participantIndex]?.categories ?? [];
    return {
      participantIndex,
      participant,
      categories: rawCategories.filter((category) => !isTeamCategory(category)),
    };
  });

  const byCategoryId = new Map<
    string,
    RegistrationsModels.CategorySuitableParticipantsItemDto
  >();

  if (items) {
    participants.forEach((participant, participantIndex) => {
      for (const category of items[participantIndex]?.categories ?? []) {
        if (!isTeamCategory(category)) {
          continue;
        }

        const suitable: RegistrationsModels.SuitableParticipantDto = {
          participantIndex,
          firstName: participant.firstName,
          lastName: participant.lastName,
          weight: participant.weight,
          dateOfBirth: participant.dateOfBirth,
          gender: participant.gender,
          beltLevel: participant.beltLevel,
        };
        const existing = byCategoryId.get(category.id);
        if (existing) {
          existing.participants.push(suitable);
          continue;
        }
        byCategoryId.set(category.id, {
          category,
          participants: [suitable],
          otherEligibleParticipants: [],
        });
      }
    });
  }

  return {
    participantItems,
    teamItems: [...byCategoryId.values()],
  };
}
