import type { Meta, StoryObj } from "@storybook/react";
import { useMemo } from "react";

import { themeColors } from "@/config/theme";

import {
  generateSingleElimination,
  type ScoreOn,
} from "@/components/brackets/core";
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
  /** Rounds cut off after the last generated round. 0 = full tree. */
  stopFromEnd: number;
  /** Score cells next to each result (plus a Sum cell). 0 = single score well. */
  scoreCount: number;
  sumLabel: string;
  /** Rounds that get the score row (maps to `scoreOn`). */
  scoreOn: ScoreOnChoice;
  /** Fields of this size or smaller become a single layer. 0 = off. */
  singleLayerWhenAtMost: number;
  /** Fill the score rows with sample values. */
  fillScoreRow: boolean;
} & BracketColors;

type ScoreOnChoice = "last" | "all" | "first" | "first and last";

const toScoreOn = (choice: ScoreOnChoice, roundCount: number): ScoreOn => {
  switch (choice) {
    case "all":
      return "all";
    case "first":
      return { rounds: [0] };
    case "first and last":
      return { rounds: [0, roundCount - 1] };
    default:
      return "last";
  }
};

const BracketDemo = ({
  count,
  includeThirdPlace,
  windowWidth,
  windowHeight,
  pageBackground,
  showScores,
  stopFromEnd,
  scoreCount,
  sumLabel,
  scoreOn,
  singleLayerWhenAtMost,
  fillScoreRow,
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
      stopAt: stopFromEnd > 0 ? { fromEnd: stopFromEnd } : undefined,
      singleLayerWhenAtMost:
        singleLayerWhenAtMost > 0 ? singleLayerWhenAtMost : undefined,
    });
    if (fillScoreRow && scoreCount > 0) {
      return {
        ...generated,
        rounds: generated.rounds.map((round) => ({
          ...round,
          matches: round.matches.map((match) =>
            match.data.isBye
              ? match
              : {
                  ...match,
                  data: {
                    ...match.data,
                    scores: Array.from(
                      { length: scoreCount },
                      (_, index) => index + 1,
                    ),
                  },
                },
          ),
        })),
      };
    }
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
  }, [
    participants,
    includeThirdPlace,
    showScores,
    stopFromEnd,
    singleLayerWhenAtMost,
    scoreCount,
    fillScoreRow,
  ]);
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
        scoreCount={scoreCount}
        scoreOn={toScoreOn(scoreOn, bracket.rounds.length)}
        sumLabel={sumLabel}
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
    stopFromEnd: 0,
    scoreCount: 0,
    sumLabel: "Sum",
    scoreOn: "last",
    singleLayerWhenAtMost: 0,
    fillScoreRow: false,
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
    stopFromEnd: {
      control: { type: "number", min: 0, max: 7 },
    },
    scoreCount: {
      control: { type: "number", min: 0, max: 10 },
    },
    sumLabel: {
      control: { type: "text" },
    },
    scoreOn: {
      control: { type: "select" },
      options: ["last", "all", "first", "first and last"],
    },
    singleLayerWhenAtMost: {
      control: { type: "number", min: 0, max: 16 },
    },
    fillScoreRow: {
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

/** Sketch: 8 teams, quarterfinals only, 5 blank score cells and a Sum cell. */
export const QuarterfinalSheet: Story = {
  args: {
    count: 8,
    includeThirdPlace: false,
    stopFromEnd: 2,
    scoreCount: 5,
  },
};

export const QuarterfinalSheetFilled: Story = {
  args: {
    count: 8,
    includeThirdPlace: false,
    stopFromEnd: 2,
    scoreCount: 5,
    fillScoreRow: true,
  },
};

export const SemifinalStop: Story = {
  args: {
    count: 8,
    includeThirdPlace: false,
    stopFromEnd: 1,
    scoreCount: 3,
  },
};

/** 5 teams with `singleLayerWhenAtMost: 5`: one layer, byes included. */
export const SmallFieldSingleLayer: Story = {
  args: {
    count: 5,
    includeThirdPlace: true,
    singleLayerWhenAtMost: 5,
    scoreCount: 5,
  },
};

/** 16 teams cut to the last two rounds: the score row sits on the last round only. */
export const ScoresOnLastRoundOnly: Story = {
  args: {
    count: 16,
    includeThirdPlace: false,
    stopFromEnd: 2,
    scoreCount: 5,
    scoreOn: "last",
  },
};

export const ScoresOnAllRounds: Story = {
  args: {
    count: 16,
    includeThirdPlace: false,
    stopFromEnd: 2,
    scoreCount: 5,
    scoreOn: "all",
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
