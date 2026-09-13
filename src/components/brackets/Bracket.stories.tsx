import type { Meta, StoryObj } from "@storybook/react";
import { useMemo } from "react";

import { themeColors } from "@/config/theme";

import { generateSingleElimination } from "@/components/brackets/core";
import type { BracketColors } from "./render/bracketColors";
import { BracketView } from "./render/BracketView";

type Team = { id: string; name: string };

const LIGHT_COLORS: BracketColors = {
  card: themeColors.primary[75],
  border: themeColors.primary[200],
  line: themeColors.primary[300],
  shadow: themeColors.primary[200],
  text: themeColors.neutral[400],
  highlight: themeColors.primary[300],
  score: themeColors.primary[200],
  scoreText: themeColors.secondary[50],
};

const DARK_COLORS: BracketColors = {
  card: themeColors.primary[400],
  border: themeColors.primary[300],
  line: themeColors.primary[100],
  shadow: themeColors.primary[500],
  text: themeColors.secondary[50],
  highlight: themeColors.primary[100],
  score: themeColors.primary[200],
  scoreText: themeColors.primary[500],
};

type BracketDemoProps = {
  count: number;
  includeThirdPlace: boolean;
  windowWidth: number;
  windowHeight: number;
  pageBackground: string;
  showScores: boolean;
} & BracketColors;

const BracketDemo = ({
  count,
  includeThirdPlace,
  windowWidth,
  windowHeight,
  pageBackground,
  showScores,
  card,
  border,
  line,
  shadow,
  text,
  highlight,
  score,
  scoreText,
}: BracketDemoProps) => {
  const participants = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: `t${index + 1}`,
        name: `Team ${index + 1}`,
      })),
    [count],
  );
  const bracket = useMemo(() => {
    const generated = generateSingleElimination(participants, (team: Team) => team.id, {
      includeThirdPlace,
    });
    if (!showScores) {
      return generated;
    }
    return {
      ...generated,
      rounds: generated.rounds.map((round, roundIndex) => {
        if (roundIndex !== 0) {
          return round;
        }
        return {
          ...round,
          matches: round.matches.map((match) => {
            if (match.data.isBye) {
              return match;
            }
            return {
              ...match,
              data: {
                ...match.data,
                winner: "item" as const,
                score: 3,
                score2: 1,
              },
            };
          }),
        };
      }),
    };
  }, [participants, includeThirdPlace, showScores]);
  const viewportWindow =
    windowWidth > 0 && windowHeight > 0
      ? { width: windowWidth, height: windowHeight }
      : undefined;

  return (
    <div className="overflow-auto p-6" style={{ backgroundColor: pageBackground }}>
      <BracketView
        bracket={bracket}
        getId={(team) => team.id}
        getLabel={(team) => team.name}
        window={viewportWindow}
        colors={{ card, border, line, shadow, text, highlight, score, scoreText }}
      />
    </div>
  );
};

const colorControl = { control: { type: "color" as const } };

const meta: Meta<typeof BracketDemo> = {
  component: BracketDemo,
  args: {
    count: 8,
    includeThirdPlace: true,
    windowWidth: 0,
    windowHeight: 0,
    pageBackground: themeColors.secondary[75],
    showScores: false,
    ...LIGHT_COLORS,
  },
  argTypes: {
    count: {
      control: { type: "number", min: 2, max: 256 },
    },
    includeThirdPlace: {
      control: { type: "boolean" },
    },
    showScores: {
      control: { type: "boolean" },
    },
    windowWidth: {
      control: { type: "number", min: 0, max: 1920 },
    },
    windowHeight: {
      control: { type: "number", min: 0, max: 1080 },
    },
    pageBackground: colorControl,
    card: colorControl,
    border: colorControl,
    line: colorControl,
    shadow: colorControl,
    text: colorControl,
    highlight: colorControl,
    score: colorControl,
    scoreText: colorControl,
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

export const WithScores: Story = {
  args: {
    count: 8,
    showScores: true,
  },
};

export const Dark: Story = {
  args: {
    count: 8,
    pageBackground: themeColors.neutral[400],
    ...DARK_COLORS,
  },
};

export const Windowed: Story = {
  args: {
    count: 8,
    includeThirdPlace: true,
    windowWidth: 640,
    windowHeight: 360,
  },
};
