import {
  CoreStats,
  KartingRoundResult,
  KartingSeriesTier,
  StatWeighting,
  F4Track,
  F4Team,
  F4Teammate,
  F4RaceResult,
  F4RaceCarResult,
  F4SeasonStandings,
  F4DriverStanding,
} from '../types';
import {
  KARTING_TRACKS,
  KARTING_RATING_MAX_POINTS,
  ROOKIE_SCALING_BONUS,
  POSITION_BASE_POINTS,
  WIN_BONUS_POINTS,
  PODIUM_BONUS_POINTS,
  AI_KARTING_NAMES,
  KARTING_SERIES_OPTIONS,
} from '../data/kartingData';
import { getRandomHighlightPhrase } from '../data/highlightPhrases';

/**
 * Standard fixed stat weighting used in Karting rounds:
 * Pace 40%, Racecraft 35%, Consistency 25%.
 */
export const DEFAULT_KARTING_WEIGHTING: StatWeighting = {
  pace: 0.4,
  racecraft: 0.35,
  consistency: 0.25,
};

/**
 * SHARED ROUND RESOLUTION FORMULA
 * Reusable for Karting, F4, F3, F2, and F1 race simulations.
 * Now supports per-track stat weighting parameters.
 *
 * Exact Formula:
 * PlayerRoundScore = (Pace * W_pace) + (Racecraft * W_racecraft) + (Consistency * W_consistency) + ROOKIE_SCALING_BONUS + RandomLuck
 * where ROOKIE_SCALING_BONUS is a flat bonus (10) applied to player calculations only,
 * and RandomLuck is a random value between -10 and +10.
 */
export function calculateRoundScore(
  stats: Pick<CoreStats, 'pace' | 'racecraft' | 'consistency'>,
  weighting: StatWeighting = DEFAULT_KARTING_WEIGHTING,
  providedLuck?: number,
  isPlayer: boolean = true
): {
  roundScore: number;
  randomLuck: number;
  paceComponent: number;
  racecraftComponent: number;
  consistencyComponent: number;
  rookieScalingBonus: number;
  weighting: StatWeighting;
} {
  // RandomLuck between -10 and +10, rounded to 1 decimal place
  const randomLuck =
    providedLuck !== undefined
      ? providedLuck
      : Math.round((Math.random() * 20 - 10) * 10) / 10;

  const paceComponent = Math.round(stats.pace * weighting.pace * 10) / 10;
  const racecraftComponent = Math.round(stats.racecraft * weighting.racecraft * 10) / 10;
  const consistencyComponent = Math.round(stats.consistency * weighting.consistency * 10) / 10;
  const rookieScalingBonus = isPlayer ? ROOKIE_SCALING_BONUS : 0;

  const rawScore =
    stats.pace * weighting.pace +
    stats.racecraft * weighting.racecraft +
    stats.consistency * weighting.consistency +
    rookieScalingBonus +
    randomLuck;

  const roundScore = Math.round(rawScore * 10) / 10;

  return {
    roundScore,
    randomLuck,
    paceComponent,
    racecraftComponent,
    consistencyComponent,
    rookieScalingBonus,
    weighting,
  };
}

/**
 * Generates an appropriate descriptive one-line label based on finishing position.
 */
export function getRoundFinishLabel(position: number): string {
  if (position === 1) {
    return 'P1 — Dominant Victory! Race winner';
  }
  if (position === 2) {
    return 'P2 — Podium finish, fighting for the lead';
  }
  if (position === 3) {
    return 'P3 — Podium finish! Superb racecraft';
  }
  if (position <= 5) {
    return `P${position} — Top-5 finish, strong points haul`;
  }
  if (position <= 8) {
    return `P${position} — Solid points-scoring finish`;
  }
  if (position <= 10) {
    return `P${position} — P10 cutoff, scraping championship points`;
  }
  if (position <= 15) {
    return `P${position} — Midfield battle, outside the points`;
  }
  return `P${position} — Off the pace, difficult race`;
}

/**
 * Calculates position base points, bonus points, and total round points.
 * Points per finishing position:
 * 1st=25, 2nd=18, 3rd=15, 4th=12, 5th=10, 6th=8, 7th=6, 8th=4, 9th=2, 10th=1, 11th+=0
 * Bonus: +5 for 1st, +2 for 2nd or 3rd
 */
export function calculateRoundPoints(position: number): {
  basePoints: number;
  bonusPoints: number;
  totalRoundPoints: number;
} {
  const basePoints = POSITION_BASE_POINTS[position] || 0;
  let bonusPoints = 0;

  if (position === 1) {
    bonusPoints = WIN_BONUS_POINTS;
  } else if (position === 2 || position === 3) {
    bonusPoints = PODIUM_BONUS_POINTS;
  }

  return {
    basePoints,
    bonusPoints,
    totalRoundPoints: basePoints + bonusPoints,
  };
}

/**
 * Normalizes total season points to a 0-100 Karting Rating:
 * KartingRating = min(100, round((totalPoints / KARTING_RATING_MAX_POINTS) * 100))
 */
export function calculateKartingRating(totalPoints: number): number {
  return Math.min(
    100,
    Math.max(0, Math.round((totalPoints / KARTING_RATING_MAX_POINTS) * 100))
  );
}

/**
 * Simulates a single 20-car karting round:
 * 1. Generates 19 AI opponents with skill levels appropriate for the series tier
 * 2. Calculates player RoundScore using the exact formula
 * 3. Applies a small random variance to AI scores (-6 to +6)
 * 4. Ranks player against the 19 AI opponents
 * 5. Returns a structured KartingRoundResult
 */
export function simulateKartingRound(
  roundNumber: number,
  seriesTier: KartingSeriesTier,
  playerStats: CoreStats,
  driverLastName: string
): KartingRoundResult {
  const trackInfo = KARTING_TRACKS[roundNumber - 1] || {
    name: `Karting Grand Prix ${roundNumber}`,
    location: 'International Circuit',
  };

  const seriesOption = KARTING_SERIES_OPTIONS.find((s) => s.id === seriesTier);
  const avgAiSkill = seriesOption?.avgAiSkill || 54;

  // 1. Calculate player's score via the single reusable function
  const playerScoreBreakdown = calculateRoundScore(playerStats);
  const playerScore = playerScoreBreakdown.roundScore;

  // 2. Generate 19 AI opponents with appropriate base skill spread
  const field: { name: string; score: number; isPlayer: boolean }[] = [];

  // Add player
  field.push({
    name: driverLastName ? `${driverLastName.toUpperCase()} (YOU)` : 'YOU',
    score: playerScore,
    isPlayer: true,
  });

  // Add 19 AI competitors
  AI_KARTING_NAMES.slice(0, 19).forEach((aiName, idx) => {
    // Distribute AI base skills around avgAiSkill with a realistic bell spread (-12 to +12)
    // plus round-to-round variance (-6 to +6)
    const skillOffset = (idx - 9) * 1.2; // slight spread across the 19 drivers
    const roundVariance = Math.round((Math.random() * 12 - 6) * 10) / 10;
    const aiBaseSkill = Math.max(20, Math.min(95, avgAiSkill + skillOffset));
    const aiScore = Math.round((aiBaseSkill + roundVariance) * 10) / 10;

    field.push({
      name: aiName,
      score: aiScore,
      isPlayer: false,
    });
  });

  // 3. Rank all 20 participants by score descending
  field.sort((a, b) => b.score - a.score);

  // 4. Find player finishing position (1-indexed)
  const playerIndex = field.findIndex((c) => c.isPlayer);
  const finishingPosition = playerIndex !== -1 ? playerIndex + 1 : 20;

  // 5. Points calculation
  const positionPassedToScoring = finishingPosition;
  const { basePoints, bonusPoints, totalRoundPoints } =
    calculateRoundPoints(positionPassedToScoring);

  // 6. Descriptive one-line label & narrative highlight phrase
  const label = getRoundFinishLabel(finishingPosition);
  const highlightLine = getRandomHighlightPhrase(finishingPosition);

  // All 20 competitors sorted for timing tower & full classification display
  const fieldResults = field.map((item, idx) => ({
    position: idx + 1,
    name: item.name,
    score: item.score,
    isPlayer: item.isPlayer,
  }));

  const debugDetails = {
    paceStat: playerStats.pace,
    paceComponent: playerScoreBreakdown.paceComponent,
    racecraftStat: playerStats.racecraft,
    racecraftComponent: playerScoreBreakdown.racecraftComponent,
    consistencyStat: playerStats.consistency,
    consistencyComponent: playerScoreBreakdown.consistencyComponent,
    rookieScalingBonus: playerScoreBreakdown.rookieScalingBonus,
    randomLuck: playerScoreBreakdown.randomLuck,
    computedScoreTotal: playerScore,
    positionFromResultSort: finishingPosition,
    positionPassedToScoring,
    pointsAwardedFromLookup: basePoints,
    bonusPointsAwarded: bonusPoints,
    totalRoundPoints,
  };

  return {
    roundNumber,
    circuitName: trackInfo.name,
    circuitLocation: trackInfo.location,
    finishingPosition,
    roundScore: playerScore,
    randomLuck: playerScoreBreakdown.randomLuck,
    pointsAwarded: basePoints,
    bonusPointsAwarded: bonusPoints,
    totalRoundPoints,
    label,
    highlightLine,
    fieldResults,
    debugDetails,
  };
}

/**
 * Simulates a single 22-car FIA Formula 4 Championship round:
 * - 1 Player
 * - 1 Permanent AI Teammate (ranked in same field)
 * - 20 AI Competitors (scaled with National-tier baseline skill distribution)
 *
 * Uses track-specific stat weighting for player and teammate.
 * Awards standard championship points (25-18-15-12-10-8-6-4-2-1 for 1st-10th).
 */
export function simulateF4Race(
  track: F4Track,
  playerStats: CoreStats,
  driverLastName: string,
  team: F4Team,
  teammate: F4Teammate,
  aiGridRoster: { name: string; teamName: string; baseSkill: number }[]
): F4RaceResult {
  // 1. Calculate player's score with track-specific weighting and rookie bonus
  const playerBreakdown = calculateRoundScore(
    playerStats,
    track.weighting,
    undefined,
    true
  );
  const playerScore = playerBreakdown.roundScore;

  // 2. Calculate teammate's score with track-specific weighting (no rookie scaling bonus)
  const teammateBreakdown = calculateRoundScore(
    {
      pace: teammate.pace,
      racecraft: teammate.racecraft,
      consistency: teammate.consistency,
    },
    track.weighting,
    undefined,
    false
  );
  const teammateScore = teammateBreakdown.roundScore;

  // 3. Populate 22-car grid
  const gridEntries: {
    name: string;
    teamName: string;
    score: number;
    isPlayer: boolean;
    isTeammate: boolean;
  }[] = [];

  // Add Player
  const playerDisplayName = driverLastName
    ? `${driverLastName.toUpperCase()} (YOU)`
    : 'YOU';
  gridEntries.push({
    name: playerDisplayName,
    teamName: team.name,
    score: playerScore,
    isPlayer: true,
    isTeammate: false,
  });

  // Add Teammate
  gridEntries.push({
    name: `${teammate.name} (TEAMMATE)`,
    teamName: team.name,
    score: teammateScore,
    isPlayer: false,
    isTeammate: true,
  });

  // Add 20 AI competitors with round-to-round variance (-6 to +6)
  aiGridRoster.slice(0, 20).forEach((ai) => {
    const roundVariance = Math.round((Math.random() * 12 - 6) * 10) / 10;
    const aiScore = Math.round((ai.baseSkill + roundVariance) * 10) / 10;
    gridEntries.push({
      name: ai.name,
      teamName: ai.teamName,
      score: aiScore,
      isPlayer: false,
      isTeammate: false,
    });
  });

  // 4. Sort all 22 entrants by score descending
  gridEntries.sort((a, b) => b.score - a.score);

  // 5. Build official classification with positions & FIA points
  const classification: F4RaceCarResult[] = gridEntries.map((entry, idx) => {
    const position = idx + 1;
    const points = POSITION_BASE_POINTS[position] || 0;
    return {
      position,
      name: entry.name,
      teamName: entry.teamName,
      score: entry.score,
      points,
      isPlayer: entry.isPlayer,
      isTeammate: entry.isTeammate,
    };
  });

  const playerCar = classification.find((c) => c.isPlayer)!;
  const teammateCar = classification.find((c) => c.isTeammate)!;

  const playerFinish = playerCar.position;
  const playerPoints = playerCar.points;
  const teammateFinish = teammateCar.position;
  const teammatePoints = teammateCar.points;
  const beatTeammate = playerFinish < teammateFinish;

  // 6. Specific callout for teammate rivalry outcome
  let label = '';
  if (playerFinish < teammateFinish) {
    label = `You finished P${playerFinish}, ahead of teammate ${teammate.name} in P${teammateFinish}`;
  } else if (playerFinish > teammateFinish) {
    label = `You finished P${playerFinish}, behind teammate ${teammate.name} in P${teammateFinish}`;
  } else {
    label = `Dead heat! You and teammate ${teammate.name} both tied for P${playerFinish}`;
  }

  const highlightLine = getRandomHighlightPhrase(playerFinish, {
    name: teammate.name,
    position: teammateFinish,
  });

  return {
    roundNumber: track.round,
    track,
    playerFinish,
    playerPoints,
    playerScore,
    teammateFinish,
    teammatePoints,
    teammateScore,
    beatTeammate,
    classification,
    label,
    highlightLine,
    randomLuck: playerBreakdown.randomLuck,
    teammateLuck: teammateBreakdown.randomLuck,
  };
}

/**
 * Recalculates the complete running F4 Drivers' Championship standings
 * based on all completed race results.
 */
export function calculateF4Standings(
  raceResults: F4RaceResult[],
  team: F4Team,
  teammate: F4Teammate,
  playerLastName: string
): F4SeasonStandings {
  if (raceResults.length === 0) {
    return {
      drivers: [],
      roundsCompleted: 0,
      playerStandingPosition: 1,
      teammateStandingPosition: 2,
      playerHeadToHeadWins: 0,
      teammateHeadToHeadWins: 0,
    };
  }

  // Driver map keyed by unique driver name
  const driverMap = new Map<string, F4DriverStanding>();

  raceResults.forEach((round) => {
    round.classification.forEach((car) => {
      let entry = driverMap.get(car.name);
      if (!entry) {
        entry = {
          name: car.name,
          teamName: car.teamName,
          isPlayer: car.isPlayer,
          isTeammate: car.isTeammate,
          points: 0,
          wins: 0,
          podiums: 0,
          bestFinish: car.position,
          finishes: [],
        };
        driverMap.set(car.name, entry);
      }

      entry.points += car.points;
      if (car.position === 1) entry.wins += 1;
      if (car.position <= 3) entry.podiums += 1;
      if (car.position < entry.bestFinish) entry.bestFinish = car.position;
      entry.finishes.push(car.position);
    });
  });

  // Convert to array and sort according to FIA championship tie-break rules:
  // 1. Total Points (descending)
  // 2. Wins count (descending)
  // 3. Podiums count (descending)
  // 4. Best finishing position (ascending)
  const sortedDrivers = Array.from(driverMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.podiums !== a.podiums) return b.podiums - a.podiums;
    if (a.bestFinish !== b.bestFinish) return a.bestFinish - b.bestFinish;
    return a.name.localeCompare(b.name);
  });

  const playerStandingPosition =
    sortedDrivers.findIndex((d) => d.isPlayer) !== -1
      ? sortedDrivers.findIndex((d) => d.isPlayer) + 1
      : 1;

  const teammateStandingPosition =
    sortedDrivers.findIndex((d) => d.isTeammate) !== -1
      ? sortedDrivers.findIndex((d) => d.isTeammate) + 1
      : 2;

  const playerHeadToHeadWins = raceResults.filter(
    (r) => r.playerFinish < r.teammateFinish
  ).length;

  const teammateHeadToHeadWins = raceResults.filter(
    (r) => r.teammateFinish < r.playerFinish
  ).length;

  return {
    drivers: sortedDrivers,
    roundsCompleted: raceResults.length,
    playerStandingPosition,
    teammateStandingPosition,
    playerHeadToHeadWins,
    teammateHeadToHeadWins,
  };
}
