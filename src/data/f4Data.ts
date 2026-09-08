import { F4Team, F4Teammate, F4Track, F4SeasonState, F4DriverStanding, F4SeasonStandings } from '../types';

/**
 * 6 Official FIA Formula 4 Tracks with Track-Specific Stat Weightings.
 *
 * Weighting specs (exactly per prompt):
 * 1. Monza, Italy — Pace 0.5, Racecraft 0.3, Consistency 0.2
 * 2. Monaco, Monaco — Racecraft 0.5, Consistency 0.3, Pace 0.2
 * 3. Spa-Francorchamps, Belgium — Pace 0.4, Consistency 0.4, Racecraft 0.2
 * 4. Silverstone, United Kingdom — Pace 0.4, Racecraft 0.4, Consistency 0.2
 * 5. Hungaroring, Hungary — Consistency 0.5, Racecraft 0.3, Pace 0.2
 * 6. Istanbul Park, Turkey — Racecraft 0.4, Consistency 0.4, Pace 0.2
 */
export const F4_TRACKS: F4Track[] = [
  {
    round: 1,
    name: 'Monza',
    circuitName: 'Autodromo Nazionale Monza',
    location: 'Monza, Italy',
    country: 'Italy',
    weighting: {
      pace: 0.5,
      racecraft: 0.3,
      consistency: 0.2,
    },
    characteristic: 'Temple of Speed • Slipstream duels & heavy braking chicanes',
    description: 'Ultra-low downforce temple favoring top-line engine power and pure single-lap qualifying pace.',
  },
  {
    round: 2,
    name: 'Monaco',
    circuitName: 'Circuit de Monaco',
    location: 'Monaco, Monaco',
    country: 'Monaco',
    weighting: {
      pace: 0.2,
      racecraft: 0.5,
      consistency: 0.3,
    },
    characteristic: 'Narrow Street Circuit • Armco barriers & ruthless wheel-to-wheel precision',
    description: 'Millimeter-precise canyon where raw racecraft and defensive positioning outweigh sheer straight-line speed.',
  },
  {
    round: 3,
    name: 'Spa-Francorchamps',
    circuitName: 'Circuit de Spa-Francorchamps',
    location: 'Stavelot, Belgium',
    country: 'Belgium',
    weighting: {
      pace: 0.4,
      racecraft: 0.2,
      consistency: 0.4,
    },
    characteristic: 'Ardennes Rollercoaster • Eau Rouge elevation & endurance rhythm',
    description: 'Long high-speed sectors mixed with treacherous weather demand balanced pace and relentless lap-to-lap consistency.',
  },
  {
    round: 4,
    name: 'Silverstone',
    circuitName: 'Silverstone Circuit',
    location: 'Silverstone, United Kingdom',
    country: 'United Kingdom',
    weighting: {
      pace: 0.4,
      racecraft: 0.4,
      consistency: 0.2,
    },
    characteristic: 'Home of British Motorsport • Maggotts-Becketts aero commitment',
    description: 'High lateral G-forces and sweeping complexes where aggressive overtaking and aerodynamic pace decide the podium.',
  },
  {
    round: 5,
    name: 'Hungaroring',
    circuitName: 'Hungaroring',
    location: 'Mogyoród, Hungary',
    country: 'Hungary',
    weighting: {
      pace: 0.2,
      racecraft: 0.3,
      consistency: 0.5,
    },
    characteristic: 'Karting Track for Single-Seaters • Tight continuous cornering & tire management',
    description: 'Twisty, physical layout with minimal straights where unwavering consistency and tire preservation dominate.',
  },
  {
    round: 6,
    name: 'Istanbul Park',
    circuitName: 'Intercity Istanbul Park',
    location: 'Tuzla, Istanbul, Turkey',
    country: 'Turkey',
    weighting: {
      pace: 0.2,
      racecraft: 0.4,
      consistency: 0.4,
    },
    characteristic: 'Legendary Quad-Apex Turn 8 • Anti-clockwise elevation & brutal tire loads',
    description: 'Demanding multi-apex sweepers requiring exceptional racecraft under pressure and stamina consistency.',
  },
];

/**
 * Plausible First and Last Names for AI Teammates and Competitors.
 */
const TEAMMATE_FIRST_NAMES = [
  'Oliver', 'Lucas', 'Frederik', 'Leonardo', 'Gabriel',
  'Dennis', 'Callum', 'Victor', 'Rafael', 'Matias',
  'Arvid', 'Tim', 'Dino', 'Joshua', 'Taylor',
  'Roman', 'Laurens', 'Alexander', 'Sebastian', 'Martinius',
];

const TEAMMATE_LAST_NAMES = [
  'Lindblad', 'Browning', 'Tramnitz', 'Beganovic', 'Dunne',
  'Boya', 'Goethe', 'Tsolov', 'Bilinski', 'Meguetounif',
  'Mansell', 'Stenshorne', 'Wurz', 'Fornaroli', 'Mini',
  'Voisin', 'Wharton', 'Zagazeta', 'Bedrin', 'Esterson',
];

/**
 * 20 AI Competitors for the F4 Field.
 * Generated with realistic junior academy names and teams,
 * with base skills centered around ~54 (National tier baseline).
 */
export const F4_AI_GRID_TEMPLATE = [
  { name: 'K. Antonelli Jr.', teamName: 'Prema Racing Junior', baseSkill: 64.8 },
  { name: 'L. Browning', teamName: 'Hitech Grand Prix', baseSkill: 63.6 },
  { name: 'A. Dunne', teamName: 'MP Motorsport Dev', baseSkill: 62.4 },
  { name: 'D. Beganovic', teamName: 'Van Amersfoort Racing', baseSkill: 61.2 },
  { name: 'T. Tramnitz', teamName: 'ART Junior Team', baseSkill: 60.0 },
  { name: 'G. Bortoleto', teamName: 'Campos Racing Academy', baseSkill: 58.8 },
  { name: 'L. Fornaroli', teamName: 'Trident Dynamics F4', baseSkill: 57.6 },
  { name: 'S. Montoya', teamName: 'Jenzer Motorsport', baseSkill: 56.4 },
  { name: 'O. Goethe', teamName: 'Rodin Carlin Junior', baseSkill: 55.2 },
  { name: 'M. Boya', teamName: 'Scuderia Veloce Junior', baseSkill: 54.0 },
  { name: 'N. Tsolov', teamName: 'Apex Motorsport Academy', baseSkill: 52.8 },
  { name: 'M. Stenshorne', teamName: 'PHM Racing by Charouz', baseSkill: 51.6 },
  { name: 'C. Wurz', teamName: 'BWT Mücke Motorsport', baseSkill: 50.4 },
  { name: 'S. Meguetounif', teamName: 'Pegasus GP Development', baseSkill: 49.2 },
  { name: 'K. Bilinski', teamName: 'North Star Racing', baseSkill: 48.0 },
  { name: 'C. Mansell', teamName: 'Cram Motorsport', baseSkill: 46.8 },
  { name: 'J. Loake', teamName: 'AKM Motorsport', baseSkill: 45.6 },
  { name: 'T. Inthraphuvasak', teamName: 'Monolite Racing', baseSkill: 44.4 },
  { name: 'N. Bedrin', teamName: 'R-ace GP Development', baseSkill: 43.8 },
  { name: 'J. Wharton', teamName: 'Drivex School', baseSkill: 43.2 },
];

/**
 * Generates an AI Teammate for the player's F4 team.
 *
 * Specs:
 * - Plausible full name (distinct from player's last name)
 * - Overall skill within tier range:
 *   - Backmarker: 35-55
 *   - Midfield: 55-75
 *   - Top: 75-90
 *   Centered near team strength rating with slight random variance
 * - Split into Pace, Racecraft, Consistency roughly matching overall rating
 */
export function generateF4Teammate(team: F4Team, playerLastName: string): F4Teammate {
  let minSkill = 35;
  let maxSkill = 55;

  if (team.tier === 'Midfield') {
    minSkill = 55;
    maxSkill = 75;
  } else if (team.tier === 'Top') {
    minSkill = 75;
    maxSkill = 90;
  }

  // Center near team strength rating with small random variance (-4 to +4)
  const baseTarget = team.strengthRating + Math.round((Math.random() * 8 - 4));
  const overallRating = Math.max(minSkill, Math.min(maxSkill, baseTarget));

  // Generate plausible name distinct from player
  const filteredLastNames = TEAMMATE_LAST_NAMES.filter(
    (ln) => ln.toLowerCase() !== playerLastName.trim().toLowerCase()
  );
  const firstName = TEAMMATE_FIRST_NAMES[Math.floor(Math.random() * TEAMMATE_FIRST_NAMES.length)];
  const lastName = filteredLastNames[Math.floor(Math.random() * filteredLastNames.length)] || 'Vance';
  const name = `${firstName} ${lastName}`;

  // Split overall rating into Pace, Racecraft, Consistency with slight distributed variance
  const v1 = Math.round((Math.random() * 4 - 2));
  const v2 = Math.round((Math.random() * 4 - 2));
  const v3 = -(v1 + v2);

  const pace = Math.max(20, Math.min(99, overallRating + v1));
  const racecraft = Math.max(20, Math.min(99, overallRating + v2));
  const consistency = Math.max(20, Math.min(99, overallRating + v3));

  return {
    name,
    pace,
    racecraft,
    consistency,
    overallRating,
  };
}

/**
 * Initializes the F4 Season state.
 */
export function initializeF4Season(team: F4Team, playerLastName: string): F4SeasonState {
  const teammate = generateF4Teammate(team, playerLastName);
  const calendar = F4_TRACKS.map((t) => ({ ...t }));

  // Initial Standings structure (empty at season start)
  const standings: F4SeasonStandings = {
    drivers: [],
    roundsCompleted: 0,
    playerStandingPosition: 1,
    teammateStandingPosition: 2,
    playerHeadToHeadWins: 0,
    teammateHeadToHeadWins: 0,
  };

  const aiGridRoster = F4_AI_GRID_TEMPLATE.map((ai) => ({ ...ai }));

  return {
    team,
    teammate,
    calendar,
    raceResults: [],
    standings,
    aiGridRoster,
  };
}
