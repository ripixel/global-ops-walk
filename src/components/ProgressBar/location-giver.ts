const LOCATIONS = [
  {
    title: 'London',
    distanceFromLastLocation: 0,
    distanceFromStartPoint: 0,
  },
  {
    title: 'Belfast',
    distanceFromLastLocation: 518,
    distanceFromStartPoint: 518,
  },
  {
    title: 'Paris',
    distanceFromLastLocation: 854,
    distanceFromStartPoint: 1372,
  },
  {
    title: 'Madrid',
    distanceFromLastLocation: 1053,
    distanceFromStartPoint: 2425,
  },
  {
    title: 'Berlin',
    distanceFromLastLocation: 1870,
    distanceFromStartPoint: 4295,
  },
  {
    title: 'Milan',
    distanceFromLastLocation: 843,
    distanceFromStartPoint: 5138,
  },
  {
    title: 'Athens',
    distanceFromLastLocation: 1461,
    distanceFromStartPoint: 6599,
  },
  // {
  //   title: 'Istanbul',
  //   distanceFromLastLocation: 562,
  //   distanceFromStartPoint: 2499,
  // },
  // {
  //   title: 'St. Petersburg',
  //   distanceFromLastLocation: 2104,
  //   distanceFromStartPoint: 2100,
  // },
  // {
  //   title: 'New Dehli',
  //   distanceFromLastLocation: 4932,
  //   distanceFromStartPoint: 6709,
  // },
  // {
  //   title: 'Hanoi',
  //   distanceFromLastLocation: 3009,
  //   distanceFromStartPoint: 9234,
  // },
  // {
  //   title: 'Singapore',
  //   distanceFromLastLocation: 2206,
  //   distanceFromStartPoint: 10854,
  // },
  // {
  //   title: 'Wellington',
  //   distanceFromLastLocation: 8524,
  //   distanceFromStartPoint: 18813,
  // },
  // {
  //   title: 'Toronto',
  //   distanceFromLastLocation: 14137,
  //   distanceFromStartPoint: 5713,
  // },
];

export const calculateLocations = async () => {
  const response = await fetch(
    'https://spreadsheets.google.com/feeds/cells/1LvU1pcPDQRrV77SPIszVRJh-XadCADmnelTtTm9PfmI/1/public/full?alt=json'
  );
  const data = (await response.json()) as any;

  const grandTotalCell = data.feed.entry.find(
    (cell: { content: { $t: string } }) => cell.content.$t === 'GRAND TOTAL'
  )?.gs$cell;

  if (!grandTotalCell) {
    throw new Error('Could not find cell with content "GRAND TOTAL"');
  }

  const totalKmWalked = data.feed.entry
    .filter(
      (cell: { gs$cell: { row: string; col: string } }) =>
        parseInt(cell.gs$cell.row, 10) > parseInt(grandTotalCell.row, 10) &&
        parseInt(cell.gs$cell.col, 10) === parseInt(grandTotalCell.col, 10)
    )
    .map((cell: { content: { $t: string } }) => parseFloat(cell.content.$t))
    .reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue
    );

  const locationsReached = LOCATIONS.filter(
    (location) => location.distanceFromStartPoint < totalKmWalked
  );

  return {
    locationsReachedAndNext: LOCATIONS.filter(
      (_, index) => index <= locationsReached.length
    ),
    reached: locationsReached.length - 1,
    next: locationsReached.length,
    totalKmWalked,
  };
};
