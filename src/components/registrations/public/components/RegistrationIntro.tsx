import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CheckIcon } from "@/assets/icons/general/Check";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { TournamentsModels } from "@/data/tournaments/tournaments.models";
import { DateUtils } from "@/util/date.utils";

import type { RegistrantMode } from "../types";
import { CategoryFitPreview } from "./CategoryFitPreview";

const PATH_CARD_SHADOW = {
  rest: "0 1px 2px rgba(92, 72, 28, 0.06)",
  hover: "0 10px 28px rgba(184, 150, 62, 0.22)",
} as const;

const PATH_EMOJIS: Record<RegistrantMode, string> = {
  single: "🥋",
  club: "👥",
};

type RegistrationIntroProps = {
  tournament: TournamentsModels.TournamentPublicLiteResponseDto;
  canRegister: boolean;
  closedCopy?: { title: string; body: string } | null;
  onStartRegistration: (mode: RegistrantMode) => void;
};

export function RegistrationIntro({
  tournament,
  canRegister,
  closedCopy,
  onStartRegistration,
}: RegistrationIntroProps) {
  const { t } = useTranslation();
  const daysLeft = DateUtils.daysUntil(tournament.registrationDeadline);
  const dateLine = [
    DateUtils.parseAndFormatDateToLocaleShort(tournament.startDate),
    tournament.location,
  ]
    .filter(Boolean)
    .join(" · ");

  const paths: {
    mode: RegistrantMode;
    title: string;
    description: string;
  }[] = [
      {
        mode: "single",
        title: t("registrations.public.intro.paths.single.title"),
        description: t("registrations.public.intro.paths.single.description"),
      },
      {
        mode: "club",
        title: t("registrations.public.intro.paths.club.title"),
        description: t("registrations.public.intro.paths.club.description"),
      },
    ];

  const stepperLabels = [
    t("registrations.public.intro.stepper.contact"),
    t("registrations.public.intro.stepper.athletes"),
    t("registrations.public.intro.stepper.categories"),
    t("registrations.public.intro.stepper.review"),
  ];

  const readyItems = [
    t("registrations.public.intro.ready.dob"),
    t("registrations.public.intro.ready.weight"),
    t("registrations.public.intro.ready.belt"),
    t("registrations.public.intro.ready.contact"),
  ];

  const faqItems = [
    {
      q: t("registrations.public.intro.faq.account.q"),
      a: t("registrations.public.intro.faq.account.a"),
    },
    {
      q: t("registrations.public.intro.faq.changes.q"),
      a: t("registrations.public.intro.faq.changes.a"),
    },
    {
      q: t("registrations.public.intro.faq.categories.q"),
      a: t("registrations.public.intro.faq.categories.a"),
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-secondary-75">
      <section className="bg-gradient-to-b from-primary-500 to-neutral-500 px-6 py-12 text-center md:px-10 md:pb-24 md:pt-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
          {canRegister ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-success-100 bg-success-50 px-3 py-1">
              <span className="size-2 rounded-full bg-success-200" aria-hidden />
              <Typography
                size="body-paragraph-s"
                className="text-success-300"
                as="span"
              >
                {t("registrations.public.intro.statusOpen")}
              </Typography>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
              <Typography
                size="body-paragraph-s"
                className="text-secondary-100"
                as="span"
              >
                {t("registrations.public.intro.statusClosed")}
              </Typography>
            </span>
          )}

          <Typography
            as="h1"
            size="display-d6"
            sizeMobile="h2"
            variant="prominent-1"
            className="font-secondary text-white"
          >
            {tournament.name}
          </Typography>

          {tournament.club?.name && (
            <Typography size="body-paragraph-m" className="text-primary-75">
              {t("registrations.public.intro.hostedBy", {
                club: tournament.club.name,
              })}
            </Typography>
          )}

          <Typography size="body-paragraph-m" className="text-secondary-300">
            {dateLine}
          </Typography>

          {canRegister && daysLeft !== undefined && (
            <div className="mt-2 w-full max-w-md rounded-m border border-white/15 px-4 py-3">
              <Typography size="body-paragraph-m" className="text-secondary-100">
                {t("registrations.public.intro.daysLeft", { count: daysLeft })}
              </Typography>
            </div>
          )}
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-12 flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 pb-10 md:-mt-14 md:px-10">
        {!canRegister && closedCopy && (
          <div className="rounded-m border border-warning-100 bg-warning-50 px-4 py-3 shadow-sm">
            <Typography size="body-paragraph-m" variant="prominent-2">
              {closedCopy.title}
            </Typography>
            <Typography
              size="body-paragraph-s"
              className="mt-1 text-neutral-200"
            >
              {closedCopy.body}
            </Typography>
          </div>
        )}

        {canRegister && (
          <section className="flex flex-col gap-5 rounded-m border border-secondary-300 bg-secondary-200 px-5 py-8 shadow-sm md:px-8">
            <Typography
              as="h2"
              size="h3"
              className="font-secondary text-center"
            >
              {t("registrations.public.intro.whoTitle")}
            </Typography>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {paths.map((path) => (
                <PathCard
                  key={path.mode}
                  emoji={PATH_EMOJIS[path.mode]}
                  title={path.title}
                  description={path.description}
                  onClick={() => onStartRegistration(path.mode)}
                />
              ))}
            </div>

            <Typography
              size="body-paragraph-s"
              className="text-center text-neutral-200"
            >
              {t("registrations.public.intro.noAccount")}
            </Typography>
          </section>
        )}

        <ol className="relative flex flex-col gap-0 sm:flex-row sm:items-start">
          {stepperLabels.map((label, index) => (
            <li
              key={label}
              className="relative flex min-w-0 flex-1 gap-3 sm:flex-col sm:items-center sm:gap-2 sm:px-1 sm:text-center"
            >
              {index < stepperLabels.length - 1 && (
                <>
                  <span
                    aria-hidden
                    className="absolute left-[13px] top-7 bottom-0 w-[2px] bg-primary-200 sm:hidden"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-[13px] left-[calc(50%+14px)] z-0 hidden h-[2px] w-[calc(100%-28px)] bg-primary-200 sm:block"
                  />
                </>
              )}
              <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-primary-200 bg-primary-75 text-primary-400">
                <Typography
                  size="body-paragraph-s"
                  variant="prominent-2"
                  as="span"
                >
                  {index + 1}
                </Typography>
              </span>
              <Typography
                size="body-paragraph-s"
                className="pb-5 text-neutral-300 sm:pb-0"
              >
                {label}
              </Typography>
            </li>
          ))}
        </ol>

        <section className="rounded-m border border-secondary-300 bg-secondary-200 p-5">
          <Typography size="h4" className="mb-4">
            {t("registrations.public.intro.readyTitle")}
          </Typography>
          <ul className="flex flex-col gap-3">
            {readyItems.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span
                  className="flex size-5 shrink-0 items-center justify-center rounded-xs border border-primary-200 bg-primary-50 text-primary-300"
                  aria-hidden
                >
                  <CheckIcon className="size-3.5" />
                </span>
                <Typography size="body-paragraph-s" as="span">
                  {item}
                </Typography>
              </li>
            ))}
          </ul>
        </section>

        <CategoryFitPreview tournament={tournament} />

        <section className="flex flex-col gap-3">
          <Typography as="h2" size="h3" className="font-secondary">
            {t("registrations.public.intro.faqTitle")}
          </Typography>
          <div className="flex flex-col overflow-hidden rounded-m border border-secondary-300 bg-secondary-200">
            {faqItems.map((item) => (
              <FaqRow key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function PathCard({
  emoji,
  title,
  description,
  onClick,
}: {
  emoji: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{
        scale: 1,
        boxShadow: PATH_CARD_SHADOW.rest,
      }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
            scale: 1.03,
            boxShadow: PATH_CARD_SHADOW.hover,
          }
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group flex origin-center cursor-pointer flex-col items-center gap-3 rounded-m border border-secondary-400/60 bg-secondary-200 p-5 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-200"
    >
      <Typography size="display-d4" className="leading-none" aria-hidden>
        {emoji}
      </Typography>
      <Typography size="h4">{title}</Typography>
      <Typography size="body-paragraph-s" className="text-neutral-200">
        {description}
      </Typography>
      <span className="mt-auto flex size-9 items-center justify-center rounded-full bg-primary-200 text-white">
        <span
          aria-hidden
          className="inline-block transition-transform duration-500 ease-out group-hover:rotate-[360deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
        >
          <FontAwesomeIcon icon={faArrowRight} size="sm" />
        </span>
        <span className="sr-only">{title}</span>
      </span>
    </motion.button>
  );
}

function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-secondary-300 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <Typography size="body-paragraph-m" variant="prominent-1">
          {question}
        </Typography>
        <span className="text-xl leading-none text-primary-300" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <Typography size="body-paragraph-s" className="text-neutral-200">
            {answer}
          </Typography>
        </div>
      )}
    </div>
  );
}
