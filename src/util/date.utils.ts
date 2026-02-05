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
}
