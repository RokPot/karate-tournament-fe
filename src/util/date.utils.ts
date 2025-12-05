import { CalendarDate } from "@internationalized/date";
import { DateTime } from "luxon";

import { logger } from "@/util/logger";

const CHART_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

export namespace DateUtils {
  const ServerDateFormat = "YYYY-MM-DD";

  export function toServerDate(date: Date): string {
    return DateTime.fromJSDate(date).toFormat(ServerDateFormat);
  }

  export function formatChartDate(date: Date | string) {
    if (typeof date === "string") {
      const normalizedDate = `${date.replace("/", "-")}-01`;
      const parsedDate = new Date(normalizedDate);

      if (Number.isNaN(parsedDate.getTime())) {
        logger.warn("Invalid date format:", date);
        return date;
      }

      return CHART_DATE_FORMATTER.format(parsedDate);
    }

    return CHART_DATE_FORMATTER.format(date);
  }

  export function getParseDateRange(date: string) {
    if (!date) return undefined;
    try {
      const splitDate = date.split("-");
      if (splitDate.length === 2) {
        const parsedDateFrom = new Date(splitDate[0]);
        const dateFrom = new CalendarDate(
          parsedDateFrom.getFullYear(),
          parsedDateFrom.getMonth(),
          parsedDateFrom.getDay(),
        );
        const parsedDateTo = new Date(splitDate[1]);
        const dateTo = new CalendarDate(parsedDateTo.getFullYear(), parsedDateTo.getMonth(), parsedDateTo.getDay());
        return { start: dateFrom, end: dateTo };
      }
      if (splitDate.length === 3) {
        const parsedDateFrom = new Date(splitDate[0]);
        const dateFrom = new CalendarDate(
          parsedDateFrom.getFullYear(),
          parsedDateFrom.getMonth(),
          parsedDateFrom.getDay(),
        );
        return { start: dateFrom, end: dateFrom };
      }
      if (splitDate.length === 6) {
        const dateFrom = new CalendarDate(Number(splitDate[0]), Number(splitDate[1]), Number(splitDate[2]));
        const dateTo = new CalendarDate(Number(splitDate[3]), Number(splitDate[4]), Number(splitDate[5]));
        return { start: dateFrom, end: dateTo };
      }
      return undefined;
    } catch (e) {
      logger.error("Something went wrong while parsing date range", e);
      return undefined;
    }
  }

  export function getParseDate(date: string) {
    if (!date) return undefined;
    if (date === "Present") {
      const nowDate = new Date();
      const dateFrom = new CalendarDate(nowDate.getFullYear(), nowDate.getMonth() + 1, nowDate.getDate());

      return dateFrom;
    }
    try {
      const parsedDateFrom = new Date(date);
      const dateFrom = new CalendarDate(
        parsedDateFrom.getFullYear(),
        parsedDateFrom.getMonth() + 1,
        parsedDateFrom.getDate(),
      );

      return dateFrom;
    } catch (e) {
      logger.error("Something went wrong while parsing date", e);
      return undefined;
    }
  }

  export function getLocalizedDate(date: string | null, format?: string) {
    if (!date) return null;

    if (date === "Present") return "Present";
    try {
      const dateTime = DateTime.fromISO(date);
      if (!format) {
        return dateTime.toLocaleString();
      }
      return dateTime.toFormat(format);
    } catch (e) {
      logger.error("Something went wrong while localizing date", e);
      return null;
    }
  }

  export function getLocalizedDateRange(
    startDate: string | null | undefined,
    endDate: string | null | undefined,
    format?: string,
  ) {
    const start = startDate ? getLocalizedDate(startDate, format) : "Unknown";
    const end = endDate ? getLocalizedDate(endDate, format) : "Present";
    return `${start} - ${end}`;
  }

  export function formatDuration(months?: number) {
    if (!months) return "";

    if (months < 12) {
      return `${months}mos`;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (remainingMonths === 0) {
      return `${years}${years === 1 ? "y" : "yrs"}`;
    }

    return `${years}${years === 1 ? "y" : "yrs"} ${remainingMonths}mos`;
  }

  export function getMonthsDurationFromRange(startDate: string | null | undefined, endDate: string | null | undefined) {
    if (!startDate || !endDate) return "";
    const { months } = DateTime.fromISO(endDate || "").diff(DateTime.fromISO(startDate || ""), "months");
    const roundedMonths = Math.ceil(months || 1);
    return formatDuration(roundedMonths);
  }

  /**
   * Formats a date into a user-friendly relative format
   * @param date - The date to format (can be Date, string, or ISO string)
   * @returns Formatted date string: "today", "yesterday", "X days ago", or "MM/DD/YYYY"
   */
  export function formatRelativeDate(date: Date | string | null | undefined): string {
    if (!date) return "";

    try {
      let inputDate: Date;

      if (date instanceof Date) {
        inputDate = date;
      } else {
        inputDate = new Date(date);
      }

      if (Number.isNaN(inputDate.getTime())) {
        return "";
      }

      // Get local date components to disregard timezone
      const inputYear = inputDate.getFullYear();
      const inputMonth = inputDate.getMonth();
      const inputDay = inputDate.getDate();

      const now = new Date();
      const nowYear = now.getFullYear();
      const nowMonth = now.getMonth();
      const nowDay = now.getDate();

      // Calculate difference in days using local date components
      const inputDateOnly = new Date(inputYear, inputMonth, inputDay);
      const nowDateOnly = new Date(nowYear, nowMonth, nowDay);
      const diffInDays = Math.floor((nowDateOnly.getTime() - inputDateOnly.getTime()) / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) {
        return "Today";
      }
      if (diffInDays === 1) {
        return "Yesterday";
      }
      if (diffInDays === 2) {
        return "2 days ago";
      }
      if (diffInDays > 2 && diffInDays <= 3) {
        return `${diffInDays} days ago`;
      }
      return inputDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      logger.error("Something went wrong while formatting relative date", e);
      return "";
    }
  }
}
