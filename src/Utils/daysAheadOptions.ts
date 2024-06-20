export const daysAheadOptions = Array.from({ length: 31 }, (_, index) => ({
  value: index + 1,
  label: `${index + 1} days ahead`,
}));
