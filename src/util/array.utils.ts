export namespace ArrayUtils {
  export const fromCommaSeparatedStr = (str: string | null | undefined) => {
    if (!str) {
      return [];
    }

    return str.split(",").map((item) => item.trim());
  };
}
