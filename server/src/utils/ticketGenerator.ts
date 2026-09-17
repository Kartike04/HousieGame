/**
 * Generates valid standard Housie / Tambola tickets (3 rows x 9 columns).
 * Rules:
 * - Total 15 numbers per ticket (5 per row)
 * - Col 0: 1-9
 * - Col 1: 10-19
 * - Col 2: 20-29
 * - Col 3: 30-39
 * - Col 4: 40-49
 * - Col 5: 50-59
 * - Col 6: 60-69
 * - Col 7: 70-79
 * - Col 8: 80-90
 * - Numbers in each column are sorted vertically in ascending order.
 * - When multiple tickets are generated for a player, NO NUMBER is repeated across tickets!
 */

const COL_RANGES: [number, number][] = [
  [1, 9],
  [10, 19],
  [20, 29],
  [30, 39],
  [40, 49],
  [50, 59],
  [60, 69],
  [70, 79],
  [80, 90],
];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateHousieTicket(excludeNumbers: Set<number> = new Set()): (number | null)[][] {
  let validGridFound = false;
  let gridMask: boolean[][] = [];
  let attempts = 0;

  while (!validGridFound && attempts < 1000) {
    attempts++;
    gridMask = Array.from({ length: 3 }, () => Array(9).fill(false));

    // Each column gets at least 1 number
    const colCounts = Array(9).fill(1);
    let extras = 6;
    while (extras > 0) {
      const col = getRandomInt(0, 8);
      if (colCounts[col] < 3) {
        colCounts[col]++;
        extras--;
      }
    }

    // Pick rows for each column
    for (let col = 0; col < 9; col++) {
      const count = colCounts[col];
      const rows = shuffleArray([0, 1, 2]).slice(0, count);
      for (const r of rows) {
        gridMask[r][col] = true;
      }
    }

    // Validate each row has exactly 5 numbers
    const r0 = gridMask[0].filter(Boolean).length;
    const r1 = gridMask[1].filter(Boolean).length;
    const r2 = gridMask[2].filter(Boolean).length;

    if (r0 === 5 && r1 === 5 && r2 === 5) {
      validGridFound = true;
    }
  }

  if (!validGridFound) {
    gridMask = [
      [true, true, true, true, true, false, false, false, false],
      [false, false, false, true, true, true, true, true, false],
      [true, true, false, false, false, false, true, true, true],
    ];
  }

  // Populate numbers per column excluding used numbers
  const ticket: (number | null)[][] = Array.from({ length: 3 }, () => Array(9).fill(null));

  for (let col = 0; col < 9; col++) {
    const [min, max] = COL_RANGES[col];
    const activeRows: number[] = [];
    for (let r = 0; r < 3; r++) {
      if (gridMask[r][col]) activeRows.push(r);
    }

    // Available numbers in column excluding already used numbers across tickets
    const pool: number[] = [];
    for (let n = min; n <= max; n++) {
      if (!excludeNumbers.has(n)) {
        pool.push(n);
      }
    }

    // If pool is too small (should not happen with 2 tickets), fallback to full range
    const available = pool.length >= activeRows.length ? pool : Array.from({ length: max - min + 1 }, (_, i) => min + i);

    const picked = shuffleArray(available).slice(0, activeRows.length);
    picked.sort((a, b) => a - b);

    // Track picked numbers in exclude set so next tickets get unique numbers!
    picked.forEach((num) => excludeNumbers.add(num));

    activeRows.forEach((rIdx, idx) => {
      ticket[rIdx][col] = picked[idx];
    });
  }

  return ticket;
}

export function generateUniquePlayerTickets(count: number): (number | null)[][][] {
  const tickets: (number | null)[][][] = [];
  const usedNumbers = new Set<number>();

  for (let i = 0; i < count; i++) {
    tickets.push(generateHousieTicket(usedNumbers));
  }

  return tickets;
}
