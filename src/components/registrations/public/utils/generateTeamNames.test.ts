import { CommonModels } from "@/data/common/common.models";

import type { DraftTeam } from "../types";
import {
  generateUniqueTeamNames,
  shortenClubName,
  teamNameDisciplineKey,
  type TeamNameFormatter,
} from "./generateTeamNames";

const formatter: TeamNameFormatter = {
  formatName: ({ club, discipline, index }) =>
    ["Team", club, discipline, String(index)].filter(Boolean).join(" "),
  disciplineLabel: (key) => {
    if (key === "kata") {
      return "Kata";
    }
    if (key === "kumite") {
      return "Kumite";
    }
    return key;
  },
};

const category = (
  overrides: Partial<CommonModels.CategoryResponseDto>,
): Pick<CommonModels.CategoryResponseDto, "id" | "discipline"> => ({
  id: "cat-1",
  discipline: "kata-team",
  ...overrides,
});

const team = (overrides: Partial<DraftTeam>): DraftTeam => ({
  clientId: "t-1",
  categoryId: "cat-1",
  starterIds: [],
  reserveIds: [],
  ...overrides,
});

describe("shortenClubName", () => {
  it("uses uppercase initials for multiple words", () => {
    expect(shortenClubName("SKIF Ljubljana")).toBe("SL");
    expect(shortenClubName("Dragon Karate Club")).toBe("DKC");
  });

  it("keeps up to 5 characters of a single word", () => {
    expect(shortenClubName("SKIF")).toBe("SKIF");
    expect(shortenClubName("Ljubljana")).toBe("Ljubl");
  });

  it("returns empty when the club name is missing", () => {
    expect(shortenClubName(undefined)).toBe("");
    expect(shortenClubName("   ")).toBe("");
  });
});

describe("teamNameDisciplineKey", () => {
  it("maps team disciplines to the individual label key", () => {
    expect(teamNameDisciplineKey("kata-team")).toBe("kata");
    expect(teamNameDisciplineKey("kumite-team")).toBe("kumite");
    expect(teamNameDisciplineKey("yako-soku-kumite")).toBe("yako-soku-kumite");
  });
});

describe("generateUniqueTeamNames", () => {
  const kataTeam = category({ id: "kata-t", discipline: "kata-team" });
  const kumiteTeam = category({ id: "kumite-t", discipline: "kumite-team" });

  it("builds Team + short club + Kata + index", () => {
    const names = generateUniqueTeamNames(
      [team({ clientId: "a", categoryId: "kata-t" })],
      [kataTeam],
      "SKIF Ljubljana",
      formatter,
    );

    expect(names.get("a")).toBe("Team SL Kata 1");
  });

  it("increments the index for the same base discipline", () => {
    const names = generateUniqueTeamNames(
      [
        team({ clientId: "a", categoryId: "kata-t" }),
        team({ clientId: "b", categoryId: "kata-t" }),
      ],
      [kataTeam],
      "SKIF Ljubljana",
      formatter,
    );

    expect(names.get("a")).toBe("Team SL Kata 1");
    expect(names.get("b")).toBe("Team SL Kata 2");
  });

  it("restarts the index for a different base discipline", () => {
    const names = generateUniqueTeamNames(
      [
        team({ clientId: "a", categoryId: "kata-t" }),
        team({ clientId: "b", categoryId: "kumite-t" }),
      ],
      [kataTeam, kumiteTeam],
      "SKIF Ljubljana",
      formatter,
    );

    expect(names.get("a")).toBe("Team SL Kata 1");
    expect(names.get("b")).toBe("Team SL Kumite 1");
  });

  it("omits the club segment when club name is missing", () => {
    const names = generateUniqueTeamNames(
      [team({ clientId: "a", categoryId: "kata-t" })],
      [kataTeam],
      undefined,
      formatter,
    );

    expect(names.get("a")).toBe("Team Kata 1");
  });
});
