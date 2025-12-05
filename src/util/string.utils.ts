export namespace StringUtils {
  export const containsCaseInsensitive = (str: string, substr: string) => {
    return str.toLowerCase().includes(substr.toLowerCase());
  };

  export const getLastCharacter = (str: string) => {
    return str[str.length - 1] ?? "";
  };
}
