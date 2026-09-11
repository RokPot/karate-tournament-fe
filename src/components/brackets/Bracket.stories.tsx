import type { Meta, StoryObj } from "@storybook/react";
import { useMemo } from "react";

import { generateSingleElimination } from "./generate/generateSingleElimination";
import { BracketView } from "./render/BracketView";

type Team = { id: string; name: string };

type BracketDemoProps = {
  count: number;
  includeThirdPlace: boolean;
  windowWidth: number;
  windowHeight: number;
};

const BracketDemo = ({
  count,
  includeThirdPlace,
  windowWidth,
  windowHeight,
}: BracketDemoProps) => {
  const participants = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: `t${index + 1}`,
        name: `Team ${index + 1}`,
      })),
    [count],
  );
  const bracket = useMemo(
    () =>
      generateSingleElimination(participants, (team: Team) => team.id, {
        includeThirdPlace,
      }),
    [participants, includeThirdPlace],
  );
  const viewportWindow =
    windowWidth > 0 && windowHeight > 0
      ? { width: windowWidth, height: windowHeight }
      : undefined;

  return (
    <div className="overflow-auto bg-primary-200 p-6">
      <BracketView
        bracket={bracket}
        getId={(team) => team.id}
        getLabel={(team) => team.name}
        window={viewportWindow}
      />
    </div>
  );
};

const meta: Meta<typeof BracketDemo> = {
  component: BracketDemo,
  args: {
    count: 8,
    includeThirdPlace: true,
    windowWidth: 0,
    windowHeight: 0,
  },
  argTypes: {
    count: {
      control: { type: "number", min: 2, max: 256 },
    },
    includeThirdPlace: {
      control: { type: "boolean" },
    },
    windowWidth: {
      control: { type: "number", min: 0, max: 1920 },
    },
    windowHeight: {
      control: { type: "number", min: 0, max: 1080 },
    },
  },
};

export default meta;

type Story = StoryObj<typeof BracketDemo>;

export const EightTeams: Story = {
  args: { count: 8 },
};

export const TwoTeams: Story = {
  args: { count: 2 },
};

export const ThreeTeams: Story = {
  args: { count: 3 },
};

export const FiveTeams: Story = {
  args: { count: 5 },
};

export const SevenTeams: Story = {
  args: { count: 7 },
};

export const NineTeams: Story = {
  args: { count: 9 },
};

export const SixteenTeams: Story = {
  args: { count: 16 },
};

export const ThirtyTwoTeams: Story = {
  args: { count: 32 },
};

export const Windowed: Story = {
  args: {
    count: 8,
    includeThirdPlace: true,
    windowWidth: 640,
    windowHeight: 360,
  },
};
