export interface Nationality {
  name: string;
  code: string;
  flagEmoji: string;
}

export interface CoreStats {
  pace: number;
  racecraft: number;
  consistency: number;
}

export interface StatDelta {
  pace: number;
  racecraft: number;
  consistency: number;
}

export interface AnswerChoice {
  id: string;
  label: string;
  text: string;
  delta: StatDelta;
}

export interface BackgroundQuestion {
  id: number;
  question: string;
  choices: AnswerChoice[];
}

export type CreationStage = 'identity' | 'background' | 'summary' | 'karting' | 'f4';

export type KartingSeriesTier = 'local' | 'national' | 'international';

export interface KartingSeriesOption {
  id: KartingSeriesTier;
  name: string;
  subtitle: string;
  description: string;
  opponentStrengthLabel: string;
  visibilityLabel: string;
  maxOfferTierText: string;
  badgeColor: string;
  avgAiSkill: number;
}

export interface KartingRoundResult {
  roundNumber: number;
  circuitName: string;
  circuitLocation: string;
  finishingPosition: number;
  roundScore: number;
  randomLuck: number;
  pointsAwarded: number;
  bonusPointsAwarded: number;
  totalRoundPoints: number;
  label: string;
  highlightLine?: string;
  fieldResults?: { position: number; name: string; score: number; isPlayer: boolean }[];
  debugDetails?: {
    paceStat: number;
    paceComponent: number;
    racecraftStat: number;
    racecraftComponent: number;
    consistencyStat: number;
    consistencyComponent: number;
    rookieScalingBonus: number;
    randomLuck: number;
    computedScoreTotal: number;
    positionFromResultSort: number;
    positionPassedToScoring: number;
    pointsAwardedFromLookup: number;
    bonusPointsAwarded: number;
    totalRoundPoints: number;
  };
}

export type F4Tier = 'Backmarker' | 'Midfield' | 'Top';

export interface F4Team {
  id: string;
  name: string;
  tier: F4Tier;
  strengthRating: number;
  headquarters?: string;
  chassis?: string;
  engineSupplier?: string;
  colorHex?: string;
}

export interface KartingSeasonState {
  seriesChosen: KartingSeriesTier | null;
  roundResults: KartingRoundResult[];
  totalPoints: number;
  kartingRating: number;
  offersReceived: F4Team[];
  selectedTeam: F4Team | null;
}

export interface DriverState {
  lastName: string;
  number: number;
  nationality: Nationality | null;
  backgroundAnswers: (string | null)[];
  coreStats: CoreStats;
  kartingSeason?: KartingSeasonState;
  f4Season?: F4SeasonState;
}

/**
 * Per-track stat weighting parameters for RoundScore calculation.
 */
export interface StatWeighting {
  pace: number;
  racecraft: number;
  consistency: number;
}

/**
 * Permanent AI Teammate for the F4 Season.
 */
export interface F4Teammate {
  name: string;
  pace: number;
  racecraft: number;
  consistency: number;
  overallRating: number;
}

/**
 * 6 Official F4 Tracks with custom stat weightings.
 */
export interface F4Track {
  round: number;
  name: string;
  circuitName: string;
  location: string;
  country: string;
  weighting: StatWeighting;
  description?: string;
  characteristic?: string;
}

/**
 * Single competitor entry on the F4 race classification sheet.
 */
export interface F4RaceCarResult {
  position: number;
  name: string;
  teamName: string;
  score: number;
  points: number;
  isPlayer: boolean;
  isTeammate: boolean;
}

/**
 * Race resolution result for an F4 round.
 */
export interface F4RaceResult {
  roundNumber: number;
  track: F4Track;
  playerFinish: number;
  playerPoints: number;
  playerScore: number;
  teammateFinish: number;
  teammatePoints: number;
  teammateScore: number;
  beatTeammate: boolean;
  classification: F4RaceCarResult[];
  label: string;
  highlightLine?: string;
  randomLuck: number;
  teammateLuck: number;
}

/**
 * Standings entry for a driver in the F4 Drivers' Championship.
 */
export interface F4DriverStanding {
  name: string;
  teamName: string;
  isPlayer: boolean;
  isTeammate: boolean;
  points: number;
  wins: number;
  podiums: number;
  bestFinish: number;
  finishes: number[];
}

/**
 * Running championship standings table across the F4 season.
 */
export interface F4SeasonStandings {
  drivers: F4DriverStanding[];
  roundsCompleted: number;
  playerStandingPosition: number;
  teammateStandingPosition: number;
  playerHeadToHeadWins: number;
  teammateHeadToHeadWins: number;
}

/**
 * Complete state for the F4 Season.
 */
export interface F4SeasonState {
  team: F4Team;
  teammate: F4Teammate;
  calendar: F4Track[];
  raceResults: F4RaceResult[];
  standings: F4SeasonStandings;
  aiGridRoster: { name: string; teamName: string; baseSkill: number }[];
}
