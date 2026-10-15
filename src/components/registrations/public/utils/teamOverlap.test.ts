import { isTeamCategory } from "./teamOverlap";

describe("isTeamCategory", () => {
  it("treats kata, kumite, and yako team disciplines with a size as teams", () => {
    expect(isTeamCategory({ discipline: "kata-team", teamSize: 3 })).toBe(true);
    expect(isTeamCategory({ discipline: "kumite-team", teamSize: 5 })).toBe(
      true,
    );
    expect(
      isTeamCategory({ discipline: "yako-soku-kumite", teamSize: 3 }),
    ).toBe(true);
  });

  it("keeps yako-soku-kumite individual when team size is missing", () => {
    expect(
      isTeamCategory({ discipline: "yako-soku-kumite", teamSize: null }),
    ).toBe(false);
    expect(isTeamCategory({ discipline: "yako-soku-kumite" })).toBe(false);
    expect(isTeamCategory({ discipline: "yako-soku-kumite", teamSize: 0 })).toBe(
      false,
    );
  });

  it("does not treat individual kata as a team even with a size", () => {
    expect(isTeamCategory({ discipline: "kata", teamSize: 3 })).toBe(false);
  });
});
