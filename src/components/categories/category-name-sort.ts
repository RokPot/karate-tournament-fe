const getLeadingNumber = (value: string) => {
  const match = value.trim().match(/^(\d+)/);
  return match ? Number(match[1]) : null;
};

/** Names that start with a number sort by that number, then by the rest of the name. */
export const compareCategoryNames = (leftName: string, rightName: string) => {
  const leftLeadingNumber = getLeadingNumber(leftName);
  const rightLeadingNumber = getLeadingNumber(rightName);
  const leftStartsWithNumber = leftLeadingNumber !== null;
  const rightStartsWithNumber = rightLeadingNumber !== null;

  if (leftStartsWithNumber !== rightStartsWithNumber) {
    return leftStartsWithNumber ? -1 : 1;
  }

  if (
    leftLeadingNumber !== null &&
    rightLeadingNumber !== null &&
    leftLeadingNumber !== rightLeadingNumber
  ) {
    return leftLeadingNumber - rightLeadingNumber;
  }

  return leftName.localeCompare(rightName, undefined, {
    numeric: true,
    sensitivity: "base",
  });
};
