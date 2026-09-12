import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { cx } from "class-variance-authority";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  BracketView,
  generateSingleElimination,
  type Bracket,
  type BracketColors,
} from "@/components/brackets";
import { uiOutlineClass } from "@/components/ui/global/outline";
import Pill from "@/components/ui/Pill";
import { Loader } from "@/components/ui/status/Loader/Loader";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { themeColors } from "@/config/theme";
import { CommonModels } from "@/data/common/common.models";
import { RegistrationsApi } from "@/data/registrations/registrations.api";
import { RegistrationsModels } from "@/data/registrations/registrations.models";
import { RegistrationsQueries } from "@/data/registrations/registrations.queries";
import { useThemeStore } from "@/providers/ThemeModeContext";

type BracketCompetitor = {
  id: string;
  name: string;
};

type CategoryBracketStatus = "tooFew" | "ready" | "generated";

const LIGHT_BRACKET_COLORS: BracketColors = {
  card: themeColors.primary[75],
  border: themeColors.primary[200],
  line: themeColors.primary[300],
  shadow: themeColors.primary[200],
  text: themeColors.neutral[400],
  highlight: themeColors.primary[300],
  score: themeColors.primary[200],
  scoreText: themeColors.secondary[50],
};

const DARK_BRACKET_COLORS: BracketColors = {
  card: themeColors.primary[400],
  border: themeColors.primary[300],
  line: themeColors.primary[100],
  shadow: themeColors.primary[500],
  text: themeColors.secondary[50],
  highlight: themeColors.primary[100],
  score: themeColors.primary[200],
  scoreText: themeColors.primary[500],
};

const getBracketColors = (isDarkMode: boolean): BracketColors =>
  isDarkMode ? DARK_BRACKET_COLORS : LIGHT_BRACKET_COLORS;

type TournamentBracketsPanelProps = {
  tournamentId: string;
  categories: CommonModels.CategoryResponseDto[];
  canManageSetup: boolean;
  isUnlocked: boolean;
};

const mapRegistrationToCompetitor = (
  registration: RegistrationsModels.RegistrationResponseDto,
): BracketCompetitor => ({
  id: registration.id,
  name:
    [registration.user?.firstName, registration.user?.lastName]
      .filter(Boolean)
      .join(" ") || "—",
});

const BracketPaneBody = ({
  isGenerating,
  bracket,
  paneSize,
  emptyMessage,
  colors,
  getRoundLabel,
}: {
  isGenerating: boolean;
  bracket?: Bracket<BracketCompetitor>;
  paneSize?: { width: number; height: number };
  emptyMessage: string;
  colors: BracketColors;
  getRoundLabel: (columnIndex: number) => string;
}) => {
  if (isGenerating) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader size="m" />
      </div>
    );
  }

  if (bracket && paneSize && paneSize.width > 0 && paneSize.height > 0) {
    return (
      <BracketView
        bracket={bracket}
        getId={(item) => item.id}
        getLabel={(item) => item.name}
        window={paneSize}
        colors={colors}
        getRoundLabel={getRoundLabel}
      />
    );
  }

  return (
    <div className="flex h-full items-center justify-center p-6">
      <Typography
        size="body-paragraph-m"
        className="text-center text-neutral-200"
      >
        {emptyMessage}
      </Typography>
    </div>
  );
};

export const TournamentBracketsPanel = ({
  tournamentId,
  categories,
  canManageSetup,
  isUnlocked,
}: TournamentBracketsPanelProps) => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const { errorToast } = useToast();
  const queryClient = useQueryClient();
  const paneRef = useRef<HTMLDivElement>(null);
  const [paneSize, setPaneSize] = useState<{ width: number; height: number }>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [includeThirdPlace, setIncludeThirdPlace] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bracketsByCategoryId, setBracketsByCategoryId] = useState<
    Record<string, Bracket<BracketCompetitor>>
  >({});

  const { data: counts } = RegistrationsQueries.useFindCountsByTournament(
    { tournamentId },
    { enabled: isUnlocked && !!tournamentId },
  );

  const countsByCategoryId = useMemo(
    () =>
      new Map(
        (counts ?? []).map((item) => [item.categoryId, item.registrationCount]),
      ),
    [counts],
  );

  useEffect(() => {
    if (!selectedCategoryId && categories[0]) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const hasBracketPane = isUnlocked && categories.length > 0;

  useEffect(() => {
    if (!hasBracketPane) {
      return () => undefined;
    }
    const el = paneRef.current;
    if (!el) {
      return () => undefined;
    }
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      const { width, height } = entry.contentRect;
      if (width < 1 || height < 1) {
        return;
      }
      setPaneSize({
        width: Math.floor(width),
        height: Math.floor(height),
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasBracketPane]);

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );
  const selectedCount = selectedCategory
    ? (countsByCategoryId.get(selectedCategory.id) ?? 0)
    : 0;
  const selectedBracket = selectedCategoryId
    ? bracketsByCategoryId[selectedCategoryId]
    : undefined;
  const canGenerate =
    canManageSetup &&
    !!selectedCategory &&
    selectedCount >= 2 &&
    !isGenerating;

  const getCategoryStatus = (categoryId: string): CategoryBracketStatus => {
    if (bracketsByCategoryId[categoryId]) {
      return "generated";
    }
    return (countsByCategoryId.get(categoryId) ?? 0) < 2 ? "tooFew" : "ready";
  };

  const handleGenerate = async () => {
    if (!selectedCategory || !canGenerate) {
      return;
    }
    setIsGenerating(true);
    try {
      const registrations = await queryClient.fetchQuery({
        queryKey: RegistrationsQueries.keys.findByTournament(
          tournamentId,
          selectedCategory.id,
        ),
        queryFn: () =>
          RegistrationsApi.findByTournament(
            tournamentId,
            selectedCategory.id,
          ),
      });
      const competitors = registrations.map(mapRegistrationToCompetitor);
      if (competitors.length < 2) {
        errorToast({ text: t("tournaments.brackets.tooFewToGenerate") });
        return;
      }
      const bracket = generateSingleElimination(
        competitors,
        (item) => item.id,
        { includeThirdPlace },
      );
      setBracketsByCategoryId((current) => ({
        ...current,
        [selectedCategory.id]: bracket,
      }));
    } catch (error) {
      errorToast({
        text:
          error instanceof Error
            ? error.message
            : t("tournaments.brackets.generateError"),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-m bg-secondary-200 p-6">
        <Typography size="body-paragraph-m" className="text-neutral-200">
          {t("tournaments.brackets.locked")}
        </Typography>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-m bg-secondary-200 p-6">
        <Typography size="body-paragraph-m" className="text-neutral-200">
          {t("tournaments.brackets.noCategories")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex min-h-[min(70vh,720px)] flex-1 flex-col gap-4 t:flex-row">
      <nav
        className="flex max-h-[40vh] w-full shrink-0 flex-col overflow-y-auto rounded-m border border-secondary-300 bg-secondary-200 t:max-h-none t:w-72"
        aria-label={t("tournaments.brackets.categoryRail")}
      >
        {categories.map((category) => {
          const isSelected = category.id === selectedCategoryId;
          const status = getCategoryStatus(category.id);
          const count = countsByCategoryId.get(category.id) ?? 0;
          return (
            <button
              key={category.id}
              type="button"
              className={cx(
                "flex w-full flex-col gap-1 border-b border-secondary-100 px-4 py-3 text-left last:border-b-0",
                uiOutlineClass,
                isSelected
                  ? "bg-secondary-100"
                  : "hover:bg-neutral-50 cursor-pointer",
              )}
              onClick={() => setSelectedCategoryId(category.id)}
            >
              <Typography
                size="body-paragraph-m"
                variant="prominent-2"
                as="span"
                className="truncate"
              >
                {category.name}
              </Typography>
              <div className="flex flex-wrap items-center gap-1">
                <Typography
                  size="body-paragraph-s"
                  className="text-neutral-200"
                  as="span"
                >
                  {t("tournaments.brackets.entries", { count })}
                </Typography>
                <Pill>
                  <Typography size="body-paragraph-s" as="span">
                    {t(`tournaments.brackets.status.${status}`)}
                  </Typography>
                </Pill>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
        {canManageSetup && (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="contained"
              disabled={!canGenerate}
              onClick={() => {
                handleGenerate().then(
                  () => undefined,
                  () => undefined,
                );
              }}
            >
              {selectedBracket
                ? t("tournaments.brackets.regenerate")
                : t("tournaments.brackets.generate")}
            </Button>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeThirdPlace}
                  onChange={(event) =>
                    setIncludeThirdPlace(event.target.checked)
                  }
                  size="small"
                />
              }
              label={
                <Typography size="body-paragraph-s" as="span">
                  {t("tournaments.brackets.includeThirdPlace")}
                </Typography>
              }
            />
          </div>
        )}

        <div
          ref={paneRef}
          className={cx(
            "min-h-0 min-w-0 flex-1 overflow-hidden rounded-m",
            isDarkMode ? "bg-primary-500" : "bg-primary-50",
          )}
        >
          <BracketPaneBody
            isGenerating={isGenerating}
            bracket={selectedBracket}
            paneSize={paneSize}
            colors={getBracketColors(!!isDarkMode)}
            getRoundLabel={(columnIndex) =>
              t("tournaments.brackets.round", { number: columnIndex + 1 })
            }
            emptyMessage={
              selectedCount < 2
                ? t("tournaments.brackets.tooFewToGenerate")
                : t("tournaments.brackets.selectCategory")
            }
          />
        </div>
      </div>
    </div>
  );
};
