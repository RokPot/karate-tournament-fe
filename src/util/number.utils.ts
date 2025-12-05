export namespace NumberUtils {
  export const CPI_INFLATION_RATE = 0.02;
  const NAN_VALUE = "-";

  export const formatAsUSCurrency = (
    value: number,
    options?: {
      maximumDecimalPlaces?: number;
      maximumSignificantDigits?: number;
      useAbsoluteValue?: boolean;
      hideCurrency?: boolean;
    },
  ): string => {
    if (Number.isNaN(value)) {
      return NAN_VALUE;
    }
    const valueToFormat = options?.useAbsoluteValue ? Math.abs(value) : value;
    const valueFormatter = new Intl.NumberFormat("en-US", {
      ...(options?.hideCurrency ? { style: "decimal" } : { style: "currency", currency: "USD" }),
      maximumFractionDigits: options?.maximumDecimalPlaces ?? 0,
      maximumSignificantDigits: options?.maximumSignificantDigits,
    });
    return valueFormatter.format(valueToFormat);
  };

  export const formatNumberToShort = (value: number, useAbsoluteValue = false) => {
    const absValue = useAbsoluteValue ? Math.abs(value) : value;
    if (absValue >= 1000000) {
      return `$${(absValue / 1000000).toFixed(1)}M`;
    }
    if (absValue >= 1000) {
      return `$${(absValue / 1000).toFixed(0)}K`;
    }
    return `$${absValue}`;
  };

  export const formatSalary = (
    value: number,
    options?: { maximumDecimalPlaces?: number; useAbsoluteValue?: boolean },
  ): string => {
    if (Number.isNaN(value)) {
      return NAN_VALUE;
    }
    const valueToFormat = options?.useAbsoluteValue ? Math.abs(value) : value;
    const valueFormatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: options?.maximumDecimalPlaces ?? 2,
    });
    return valueFormatter.format(valueToFormat);
  };

  /**
   * Converts a formatted salary string to a number
   * Handles strings like "123,123.456" -> 123123.456
   * @param value - The salary value (string or number)
   * @returns The numeric value or null if invalid
   */
  export const parseSalaryString = (value: string | number | null | undefined): number | null => {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === "number") {
      return Number.isNaN(value) ? null : value;
    }

    if (typeof value === "string") {
      // Remove all non-numeric characters except decimal point
      const cleanedValue = value.replace(/[^0-9.]/g, "");

      // Handle empty string
      if (cleanedValue === "" || cleanedValue === ".") {
        return null;
      }

      // Parse the cleaned value
      const numericValue = Number(cleanedValue);
      return Number.isNaN(numericValue) ? null : numericValue;
    }

    return null;
  };

  /**
   * Formats a phone number string with proper formatting
   * @param digits - The phone number digits (without formatting)
   * @returns The formatted phone number string
   */
  export const formatPhoneNumber = (digits: string, allowLongerThan10Digits = false): string => {
    let formattedPhoneNumber = "";
    if (digits.length === 0) return formattedPhoneNumber;

    if (digits.length === 1) return `+${digits} (`;

    const countryCode = digits.slice(0, 1);
    const phoneDigits = digits.slice(1);

    formattedPhoneNumber = `+${countryCode}`;
    if (phoneDigits.length === 0) {
      formattedPhoneNumber += ` (`;
    }
    if (phoneDigits.length < 3) {
      formattedPhoneNumber += ` (${phoneDigits}`;
    } else if (phoneDigits.length === 3) {
      formattedPhoneNumber += ` (${phoneDigits})`;
    } else if (phoneDigits.length === 4 || phoneDigits.length <= 6) {
      formattedPhoneNumber += ` (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3)}`;
    } else if (phoneDigits.length <= 10) {
      formattedPhoneNumber += ` (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`;
    } else if (allowLongerThan10Digits) {
      formattedPhoneNumber += ` (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`;
    }

    return formattedPhoneNumber;
  };
}
