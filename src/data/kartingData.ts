import { KartingSeriesOption, KartingSeriesTier } from '../types';

/**
 * Karting Series Options.
 * Difficulty vs. Visibility tradeoffs presented plainly to the player.
 */
export const KARTING_SERIES_OPTIONS: KartingSeriesOption[] = [
  {
    id: 'local',
    name: 'Regional Kart Trophy',
    subtitle: 'Local Series • Entry-Level Field',
    description:
      'Compete against regional grassroots drivers. The competition is softer, giving you an easier path to wins and high points, but scouts rarely attend: your maximum F4 offer will be capped at Midfield tier regardless of how dominant you are.',
    opponentStrengthLabel: 'Low (Average Skill ~38)',
    visibilityLabel: 'Capped at Midfield Tier',
    maxOfferTierText: 'Midfield Max (Top Tier locked)',
    badgeColor: '#9A9AA5',
    avgAiSkill: 38,
  },
  {
    id: 'national',
    name: 'National Kart Championship',
    subtitle: 'National Series • Competitive Pro Field',
    description:
      'Battle the country’s premier factory junior drivers. Field strength is balanced and competitive. Strong results earn legitimate paddock respect, keeping Midfield offers readily within reach while giving you an outside shot at Top Tier teams.',
    opponentStrengthLabel: 'Moderate (Average Skill ~54)',
    visibilityLabel: 'Standard (Top Tier reachable)',
    maxOfferTierText: 'Top Tier Reachable (Lower odds)',
    badgeColor: '#38BDF8',
    avgAiSkill: 54,
  },
  {
    id: 'international',
    name: 'FIA CIK-FIA Euro Champions Cup',
    subtitle: 'International Series • Elite World Grid',
    description:
      'The crucible of junior motorsport. You are up against future Formula 1 academy prodigies backed by factory teams. Finishing in the points is brutally difficult, but standout performances open direct doors to Top Tier F4 seats.',
    opponentStrengthLabel: 'High (Average Skill ~72)',
    visibilityLabel: 'Maximum (Full Tier Range)',
    maxOfferTierText: 'Uncapped (Direct Top Tier pipeline)',
    badgeColor: '#E10600',
    avgAiSkill: 72,
  },
];

/**
 * 6 Realistic Junior Karting Tracks for the Season.
 */
export const KARTING_TRACKS = [
  {
    round: 1,
    name: 'South Garda Karting',
    location: 'Lonato, Italy',
    length: '1,200m',
    characteristic: 'Technical Hairpins & High Braking Demand',
  },
  {
    round: 2,
    name: 'Kartódromo Internacional do Algarve',
    location: 'Portimão, Portugal',
    length: '1,531m',
    characteristic: 'Elevation Changes & Fast Sweepers',
  },
  {
    round: 3,
    name: 'Circuito Internacional de Zuera',
    location: 'Zaragoza, Spain',
    length: '1,700m',
    characteristic: 'Ultra-Long Straights & Slipstream Battles',
  },
  {
    round: 4,
    name: 'Karting Genk "Home of Champions"',
    location: 'Genk, Belgium',
    length: '1,360m',
    characteristic: 'Rhythm Chicanes & Variable Grip Conditions',
  },
  {
    round: 5,
    name: 'Circuito Internazionale Napoli',
    location: 'Sarno, Italy',
    length: '1,547m',
    characteristic: 'Aggressive Kerbs & Wheel-to-Wheel Chicanes',
  },
  {
    round: 6,
    name: 'PF International Kart Circuit',
    location: 'Lincolnshire, United Kingdom',
    length: '1,382m',
    characteristic: 'Famous Bridge Section & Fast Technical Flow',
  },
];

/**
 * Scoring Rules & Constants
 * Placeholder ceiling constant named KARTING_RATING_MAX_POINTS as specified by prompt.
 */
export const KARTING_RATING_MAX_POINTS = 210;

/**
 * Rookie Scaling Bonus
 * Flat bonus added to player RoundScore calculation to ensure competitive
 * baseline against junior formula AI fields.
 */
export const ROOKIE_SCALING_BONUS = 10;

/**
 * Finishing position points system:
 * 1st=25, 2nd=18, 3rd=15, 4th=12, 5th=10, 6th=8, 7th=6, 8th=4, 9th=2, 10th=1, 11th+=0
 */
export const POSITION_BASE_POINTS: Record<number, number> = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1,
};

/**
 * Bonus points:
 * +5 for every 1st place finish
 * +2 for every 2nd or 3rd place finish (podium bonus)
 */
export const WIN_BONUS_POINTS = 5;
export const PODIUM_BONUS_POINTS = 2;

/**
 * 19 Realistic AI Karting Opponent Names for the 20-Car Grid.
 */
export const AI_KARTING_NAMES = [
  'L. Antonelli Jr.',
  'M. Lindblad',
  'A. Dunne',
  'T. Mini',
  'K. Maini',
  'O. Goethe',
  'S. Montoya',
  'C. Wurz',
  'D. Beganovic',
  'T. Tramnitz',
  'L. Fornaroli',
  'M. Boya',
  'G. Bortoleto',
  'N. Tsolov',
  'K. Bilinski',
  'S. Meguetounif',
  'C. Mansell',
  'R. Stenshorne',
  'J. Loake',
];
