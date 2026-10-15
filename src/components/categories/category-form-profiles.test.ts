import { categoryFormProfiles } from "./category-form-profiles";

describe("categoryFormProfiles yako-soku-kumite", () => {
  it("asks for team size as well as belt and sub-discipline", () => {
    const profile = categoryFormProfiles["yako-soku-kumite"];
    expect(profile.show.team).toBe(true);
    expect(profile.require.team).toBe(true);
    expect(profile.show.belt).toBe(true);
    expect(profile.require.subDiscipline).toBe(true);
  });
});
