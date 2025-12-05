/* eslint-disable no-param-reassign */
export namespace StyleUtils {
  export const addSharedClassToMap = <T extends string>(
    map: Record<T, string>,
    sharedClasses: string,
  ): Record<T, string> => {
    return Object.entries(map).reduce(
      (acc, [key, value]) => {
        acc[key as T] = `${value} ${sharedClasses}`;
        return acc;
      },
      {} as Record<T, string>,
    );
  };
}
