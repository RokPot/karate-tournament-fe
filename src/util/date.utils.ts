import { DateTime } from "luxon";

import { logger } from "@/util/logger";

export namespace DateUtils {
  const ServerDateFormat = "YYYY-MM-DD";

  export function toServerDate(date: Date): string {
    return DateTime.fromJSDate(date).toFormat(ServerDateFormat);
  }

  export function parseDate(date?: string) {
    if (!date) return undefined;

    try {
      const newDate = new Date(date);
      return newDate;
    } catch (e) {
      logger.error("Something went wrong while parsing date", e);
      return undefined;
    }
  }

  export function formatDateTimeToLocaleShort(date?: Date) {
    if (!date) return "-";
    return date.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
  }

  export function formatDateToLocaleShort(date?: Date) {
    if (!date) return "-";
    return date.toLocaleDateString(undefined, { dateStyle: "short" });
  }

  export function parseAndFormatDateTimeToLocaleShort(date?: string | null) {
    const parsedDate = parseDate(date || undefined);
    return formatDateTimeToLocaleShort(parsedDate);
  }

  export function parseAndFormatDateToLocaleShort(date?: string | null) {
    const parsedDate = parseDate(date || undefined);
    return formatDateToLocaleShort(parsedDate);
  }

  /** Full years between birth date and today (floor). */
  export function calculateAgeInYearsFromBirthDate(
    birthDate?: string | null,
  ): number | undefined {
    const parsed = parseDate(birthDate ?? undefined);
    if (!parsed) return undefined;

    const today = new Date();
    if (parsed.getTime() > today.getTime()) return undefined;

    let years = today.getFullYear() - parsed.getFullYear();
    const birthdayNotYetThisYear =
      today.getMonth() < parsed.getMonth() ||
      (today.getMonth() === parsed.getMonth() &&
        today.getDate() < parsed.getDate());

    if (birthdayNotYetThisYear) {
      years -= 1;
    }

    return Math.floor(years);
  }

  export function formatAgeFromBirthDate(birthDate?: string | null): string {
    const age = calculateAgeInYearsFromBirthDate(birthDate);
    return age !== undefined ? String(age) : "-";
  }

  /** Fixed month/day (2 Feb) — only birth year is collected in public registration. */
  export const BIRTH_YEAR_PLACEHOLDER_MONTH = 2;
  export const BIRTH_YEAR_PLACEHOLDER_DAY = 2;

  export function dateOfBirthFromBirthYear(year: number): string {
    return new Date(
      Date.UTC(
        year,
        BIRTH_YEAR_PLACEHOLDER_MONTH - 1,
        BIRTH_YEAR_PLACEHOLDER_DAY,
      ),
    ).toISOString();
  }

  /** Normalize API / form values to the same ISO string for comparison. */
  export function toDateOfBirthIso(dateOfBirth: string): string {
    const parsed = parseDate(dateOfBirth);
    if (!parsed || Number.isNaN(parsed.getTime())) {
      return dateOfBirth;
    }
    return parsed.toISOString();
  }

  export function getBirthYearFromDateOfBirth(
    dateOfBirth?: string | null,
  ): number | undefined {
    const parsed = parseDate(dateOfBirth ?? undefined);
    return parsed?.getFullYear();
  }
}
