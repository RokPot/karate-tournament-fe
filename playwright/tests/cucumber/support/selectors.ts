export const TestIds = {
  mainPage: {},
};

export function testIdSelector(id: string): string {
  return `[data-testid="${id}"]`;
}
