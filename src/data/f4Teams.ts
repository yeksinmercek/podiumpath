import { F4Team, F4Tier, KartingSeriesTier } from '../types';

/**
 * 15 F4 Teams Across 3 Tiers (5 per tier)
 * Numeric Strength Ratings:
 * - Backmarker: 30-45
 * - Midfield: 50-70
 * - Top: 75-95
 */
export const F4_TEAMS: F4Team[] = [
  // --- Backmarker Tier (30-45) ---
  {
    id: 'f4-apex',
    name: 'Apex Motorsport Academy',
    tier: 'Backmarker',
    strengthRating: 34,
    headquarters: 'Silverstone, UK',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#E25822',
  },
  {
    id: 'f4-veloce',
    name: 'Scuderia Veloce Junior',
    tier: 'Backmarker',
    strengthRating: 38,
    headquarters: 'Modena, Italy',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#8E1616',
  },
  {
    id: 'f4-trident-dyn',
    name: 'Trident Dynamics F4',
    tier: 'Backmarker',
    strengthRating: 42,
    headquarters: 'Milan, Italy',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#2563EB',
  },
  {
    id: 'f4-northstar',
    name: 'North Star Racing',
    tier: 'Backmarker',
    strengthRating: 31,
    headquarters: 'Helsinki, Finland',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#64748B',
  },
  {
    id: 'f4-pegasus',
    name: 'Pegasus GP Development',
    tier: 'Backmarker',
    strengthRating: 44,
    headquarters: 'Valencia, Spain',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#D97706',
  },

  // --- Midfield Tier (50-70) ---
  {
    id: 'f4-arden',
    name: 'Arden Youth Formula',
    tier: 'Midfield',
    strengthRating: 56,
    headquarters: 'Banbury, UK',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#DC2626',
  },
  {
    id: 'f4-campos',
    name: 'Campos NextGen Racing',
    tier: 'Midfield',
    strengthRating: 62,
    headquarters: 'Alzira, Spain',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#EA580C',
  },
  {
    id: 'f4-carlin',
    name: 'Carlin Junior Programme',
    tier: 'Midfield',
    strengthRating: 68,
    headquarters: 'Farnham, UK',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#0284C7',
  },
  {
    id: 'f4-rodin',
    name: 'Rodin Motorsport Academy',
    tier: 'Midfield',
    strengthRating: 53,
    headquarters: 'North Canterbury, NZ',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#475569',
  },
  {
    id: 'f4-hitech',
    name: 'Hitech Grand Prix Junior',
    tier: 'Midfield',
    strengthRating: 65,
    headquarters: 'Silverstone, UK',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#0D9488',
  },

  // --- Top Tier (75-95) ---
  {
    id: 'f4-prema',
    name: 'Prema Racing F4',
    tier: 'Top',
    strengthRating: 94,
    headquarters: 'Grisignano di Zocco, Italy',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#E10600',
  },
  {
    id: 'f4-art',
    name: 'ART Grand Prix Junior',
    tier: 'Top',
    strengthRating: 91,
    headquarters: 'Villeneuve-la-Guyard, France',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#2563EB',
  },
  {
    id: 'f4-mp',
    name: 'MP Motorsport F4',
    tier: 'Top',
    strengthRating: 88,
    headquarters: 'Westmaas, Netherlands',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#F59E0B',
  },
  {
    id: 'f4-van-amersfoort',
    name: 'Van Amersfoort Racing',
    tier: 'Top',
    strengthRating: 85,
    headquarters: 'Zeewolde, Netherlands',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#F97316',
  },
  {
    id: 'f4-race-gp',
    name: 'R-ace GP Elite',
    tier: 'Top',
    strengthRating: 81,
    headquarters: 'Fontenay-le-Comte, France',
    chassis: 'Tatuus F4-T421',
    engineSupplier: 'Abarth 1.4L Turbo',
    colorHex: '#7C3AED',
  },
];

/**
 * Offer Count Ranges by Karting Rating:
 * - 0-39: 1 offer
 * - 40-69: 2-3 offers
 * - 70-100: 3-4 offers
 */
export const OFFER_COUNT_RULES = {
  LOW: { minRating: 0, maxRating: 39, minOffers: 1, maxOffers: 1 },
  MID: { minRating: 40, maxRating: 69, minOffers: 2, maxOffers: 3 },
  HIGH: { minRating: 70, maxRating: 100, minOffers: 3, maxOffers: 4 },
};

/**
 * Series Visibility Constraints:
 * - Local: capped at Midfield tier max (even with perfect 100 rating)
 * - National: Top tier reachable but less likely (allowed, lower weight)
 * - International: no visibility cap, full range unlocked
 */
export const SERIES_MAX_TIER_CAPS: Record<KartingSeriesTier, F4Tier> = {
  local: 'Midfield',
  national: 'Top',
  international: 'Top',
};

/**
 * Generates F4 offers based on the driver's Karting Rating and Series choice.
 * Weights are influenced by rating and series tier.
 */
export function generateF4Offers(
  kartingRating: number,
  seriesChosen: KartingSeriesTier
): F4Team[] {
  // 1. Determine number of offers
  let offerCount = 1;
  if (kartingRating <= OFFER_COUNT_RULES.LOW.maxRating) {
    offerCount = 1;
  } else if (kartingRating <= OFFER_COUNT_RULES.MID.maxRating) {
    // 2 to 3 offers
    offerCount = Math.floor(Math.random() * 2) + 2;
  } else {
    // 3 to 4 offers
    offerCount = Math.floor(Math.random() * 2) + 3;
  }

  // 2. Determine eligible tiers based on series cap
  const maxTierAllowed = SERIES_MAX_TIER_CAPS[seriesChosen];
  const canReceiveTopTier = maxTierAllowed === 'Top';

  // 3. Define tier weights based on rating and series
  // Local series: Top tier weight is strictly 0
  let backmarkerWeight = 70;
  let midfieldWeight = 30;
  let topWeight = 0;

  if (kartingRating < 40) {
    backmarkerWeight = 85;
    midfieldWeight = 15;
    topWeight = 0;
  } else if (kartingRating < 70) {
    if (seriesChosen === 'local') {
      backmarkerWeight = 35;
      midfieldWeight = 65;
      topWeight = 0;
    } else if (seriesChosen === 'national') {
      backmarkerWeight = 30;
      midfieldWeight = 58;
      topWeight = 12; // Top reachable but less likely
    } else {
      backmarkerWeight = 20;
      midfieldWeight = 55;
      topWeight = 25;
    }
  } else {
    // High rating (70-100)
    if (seriesChosen === 'local') {
      backmarkerWeight = 15;
      midfieldWeight = 85;
      topWeight = 0; // Strictly capped at Midfield
    } else if (seriesChosen === 'national') {
      backmarkerWeight = 10;
      midfieldWeight = 55;
      topWeight = 35; // Top reachable but less likely than international
    } else {
      // International series (full unlocked access)
      backmarkerWeight = 5;
      midfieldWeight = 35;
      topWeight = 60;
    }
  }

  // Safety: if series cap forbids Top tier, zero it out
  if (!canReceiveTopTier) {
    midfieldWeight += topWeight;
    topWeight = 0;
  }

  const selectedTeams: F4Team[] = [];
  const availableTeams = [...F4_TEAMS];

  // Helper to pick a tier based on weights
  const pickTier = (): F4Tier => {
    const totalWeight = backmarkerWeight + midfieldWeight + topWeight;
    const roll = Math.random() * totalWeight;
    if (roll < backmarkerWeight) return 'Backmarker';
    if (roll < backmarkerWeight + midfieldWeight) return 'Midfield';
    return 'Top';
  };

  // Pick unique offers
  while (selectedTeams.length < offerCount && availableTeams.length > 0) {
    const targetTier = pickTier();
    // Filter available teams of this tier
    let tierTeams = availableTeams.filter((t) => t.tier === targetTier);

    // Fallback if tier is exhausted
    if (tierTeams.length === 0) {
      tierTeams = availableTeams.filter((t) => {
        if (!canReceiveTopTier && t.tier === 'Top') return false;
        return true;
      });
    }

    if (tierTeams.length === 0) break;

    // Pick a random team from the candidate set
    const chosenIndex = Math.floor(Math.random() * tierTeams.length);
    const chosenTeam = tierTeams[chosenIndex];

    selectedTeams.push(chosenTeam);
    // Remove from available
    const removeIdx = availableTeams.findIndex((t) => t.id === chosenTeam.id);
    if (removeIdx !== -1) {
      availableTeams.splice(removeIdx, 1);
    }
  }

  // Sort offers from highest strength rating to lowest
  return selectedTeams.sort((a, b) => b.strengthRating - a.strengthRating);
}
