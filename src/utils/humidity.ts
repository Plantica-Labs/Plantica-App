export const getWateringLevel = (humidity: number) => {
  const over = 90;
  const optimal = 60;
  const under = 30;
  switch (true) {
    case humidity > over:
      return 'Over';
    case humidity >= optimal && humidity <= over:
      return 'Optimally';
    case humidity >= under && humidity < optimal:
      return 'Under';
    default:
      return 'Not';
  }
};
