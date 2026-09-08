/**
 * Reusable highlight narrative event phrase pool.
 * Shared across Karting, F4, and future series (F3/F2/F1).
 */

export interface HighlightEventPool {
  win: string[];
  podium: string[];
  points: string[];
  outsidePoints: string[];
  teammateAhead: string[];
  teammateBehind: string[];
}

export const HIGHLIGHT_EVENT_POOL: HighlightEventPool = {
  win: [
    'Dominant drive from lights to flag',
    'Held off late pressure to take the win',
    'Controlled the race from the front',
    'Flawless pace all weekend, taking top step of the podium',
  ],
  podium: [
    'Fought hard to secure a podium finish',
    'Capitalized on a late mistake ahead to climb onto the podium',
    'Superb racecraft yields a hard-earned podium',
    'Charged through the frontrunners to lock down a podium',
  ],
  points: [
    'A solid points haul in a tough field',
    'Steady drive brings home valuable points',
    'Defended masterfully in the closing laps for points',
    'Maximized racecraft to salvage a top-10 result',
  ],
  outsidePoints: [
    'A difficult weekend, lost time in traffic',
    'Off the pace all weekend, work to do',
    'Struggled for grip in dirty air outside the points',
    'Tough outing against an aggressive midfield pack',
  ],
  teammateAhead: [
    'Got the better of teammate {name} this weekend',
    'Edged out teammate {name} in an intense intra-team duel',
    'Mastered race pace to finish ahead of teammate {name}',
  ],
  teammateBehind: [
    'Lost out to teammate {name} in the final stint',
    'Finished behind teammate {name} after a close battle',
    'Unable to match teammate {name}\'s pace today',
  ],
};

/**
 * Randomly selects one applicable highlight phrase from the correct category.
 * If teammate information is provided (as in F4), there is an intentional chance
 * to surface a teammate-relative narrative variant.
 */
export function getRandomHighlightPhrase(
  position: number,
  teammate?: { name: string; position: number }
): string {
  // If teammate exists, 35% chance to trigger teammate-specific flavor phrase
  if (teammate && teammate.name) {
    const isAhead = position < teammate.position;
    const isBehind = position > teammate.position;

    if ((isAhead || isBehind) && Math.random() < 0.35) {
      const pool = isAhead
        ? HIGHLIGHT_EVENT_POOL.teammateAhead
        : HIGHLIGHT_EVENT_POOL.teammateBehind;
      const template = pool[Math.floor(Math.random() * pool.length)];
      return template.replace('{name}', teammate.name);
    }
  }

  let pool: string[];
  if (position === 1) {
    pool = HIGHLIGHT_EVENT_POOL.win;
  } else if (position <= 3) {
    pool = HIGHLIGHT_EVENT_POOL.podium;
  } else if (position <= 10) {
    pool = HIGHLIGHT_EVENT_POOL.points;
  } else {
    pool = HIGHLIGHT_EVENT_POOL.outsidePoints;
  }

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
