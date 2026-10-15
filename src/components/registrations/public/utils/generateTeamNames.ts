import type { TFunction } from "i18next";

import { CommonModels } from "@/data/common/common.models";

import type { DraftTeam } from "../types";

export type TeamNameParts = {
  club: string;
  discipline: string;
  index: number;
};

export type TeamNameFormatter = {
  formatName: (parts: TeamNameParts) => string;
  disciplineLabel: (key: string) => string;
};

export function shortenClubName(clubName: string | undefined): string {
  const words = (clubName ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "";
  }
  if (words.length === 1) {
    return Array.from(words[0] ?? "").slice(0, 5).join("");
  }
  return words
    .map((word) => Array.from(word)[0] ?? "")
    .join("")
    .toUpperCase();
}

export function teamNameDisciplineKey(
  discipline: CommonModels.DisciplineEnum | undefined,
): string {
  if (discipline === CommonModels.DisciplineEnum["kata-team"]) {
    return CommonModels.DisciplineEnum.kata;
  }
  if (discipline === CommonModels.DisciplineEnum["kumite-team"]) {
    return "kumite";
  }
  return discipline ?? "";
}

type TeamDisciplineI18nKey =
  | `discipline.${CommonModels.DisciplineEnum}`
  | "discipline.kumite";

export function teamNameFormatterFromT(t: TFunction): TeamNameFormatter {
  return {
    formatName: ({ club, discipline, index }) =>
      t("registrations.public.teams.generatedName", {
        club,
        discipline,
        index,
      }),
    disciplineLabel: (key) =>
      key ? t(`discipline.${key}` as TeamDisciplineI18nKey) : "",
  };
}

export function generateUniqueTeamNames(
  teams: DraftTeam[],
  categories: Pick<CommonModels.CategoryResponseDto, "id" | "discipline">[],
  clubName: string | undefined,
  formatter: TeamNameFormatter,
): Map<string, string> {
  const shortClub = shortenClubName(clubName);
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const counters = new Map<string, number>();
  const names = new Map<string, string>();
  const reserved = new Set<string>();

  for (const team of teams) {
    const preserved = team.name?.trim();
    if (preserved) {
      reserved.add(preserved);
    }
  }

  for (const team of teams) {
    const preserved = team.name?.trim();
    if (preserved) {
      names.set(team.clientId, preserved);
      continue;
    }

    const disciplineKey = teamNameDisciplineKey(
      categoryById.get(team.categoryId)?.discipline,
    );
    const counterKey = `${shortClub}\0${disciplineKey}`;
    let index = (counters.get(counterKey) ?? 0) + 1;
    let candidate = formatter
      .formatName({
        club: shortClub,
        discipline: formatter.disciplineLabel(disciplineKey),
        index,
      })
      .replace(/\s+/g, " ")
      .trim();

    while (reserved.has(candidate)) {
      index += 1;
      candidate = formatter
        .formatName({
          club: shortClub,
          discipline: formatter.disciplineLabel(disciplineKey),
          index,
        })
        .replace(/\s+/g, " ")
        .trim();
    }

    counters.set(counterKey, index);
    reserved.add(candidate);
    names.set(team.clientId, candidate);
  }

  return names;
}
