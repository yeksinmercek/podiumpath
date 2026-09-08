import { BackgroundQuestion, CoreStats } from '../types';

export const BASE_STATS: CoreStats = {
  pace: 40,
  racecraft: 40,
  consistency: 40,
};

export const BACKGROUND_QUESTIONS: BackgroundQuestion[] = [
  {
    id: 1,
    question: 'How did you get into racing?',
    choices: [
      {
        id: '1A',
        label: 'A',
        text: 'Family racing dynasty, karts since age 4',
        delta: { pace: 0, racecraft: 2, consistency: 1 },
      },
      {
        id: '1B',
        label: 'B',
        text: 'Begged your parents for a go-kart after watching a race on TV',
        delta: { pace: 2, racecraft: 0, consistency: 1 },
      },
      {
        id: '1C',
        label: 'C',
        text: 'Local kart track scout spotted you racing friends for fun',
        delta: { pace: 1, racecraft: 2, consistency: 0 },
      },
    ],
  },
  {
    id: 2,
    question: 'What did your family sacrifice to fund your karting?',
    choices: [
      {
        id: '2A',
        label: 'A',
        text: 'Nothing much — comfortably funded',
        delta: { pace: 0, racecraft: 0, consistency: 2 },
      },
      {
        id: '2B',
        label: 'B',
        text: 'Modest sacrifices, tight budgets some seasons',
        delta: { pace: 1, racecraft: 1, consistency: 1 },
      },
      {
        id: '2C',
        label: 'C',
        text: 'Everything — remortgaged house, moved countries for a season',
        delta: { pace: 2, racecraft: 2, consistency: -2 },
      },
    ],
  },
  {
    id: 3,
    question: 'Your first big crash as a teenager — what happened after?',
    choices: [
      {
        id: '3A',
        label: 'A',
        text: 'Got straight back in the car next session, no hesitation',
        delta: { pace: 2, racecraft: 0, consistency: -1 },
      },
      {
        id: '3B',
        label: 'B',
        text: 'Studied the footage obsessively before racing again',
        delta: { pace: 0, racecraft: 2, consistency: 1 },
      },
      {
        id: '3C',
        label: 'C',
        text: 'Needed real time to rebuild confidence',
        delta: { pace: 0, racecraft: 0, consistency: 2 },
      },
    ],
  },
  {
    id: 4,
    question: 'How do you handle a rival trash-talking you before a race?',
    choices: [
      {
        id: '4A',
        label: 'A',
        text: 'Get in their head right back',
        delta: { pace: 2, racecraft: 1, consistency: -1 },
      },
      {
        id: '4B',
        label: 'B',
        text: 'Ignore it completely, focus on your own race',
        delta: { pace: 0, racecraft: 1, consistency: 2 },
      },
      {
        id: '4C',
        label: 'C',
        text: 'Let it fuel a quietly ruthless on-track response',
        delta: { pace: 1, racecraft: 2, consistency: 0 },
      },
    ],
  },
  {
    id: 5,
    question: "What's your reputation in the paddock as a teenager?",
    choices: [
      {
        id: '5A',
        label: 'A',
        text: 'The fastest kid nobody can keep up with in Q1, but fades',
        delta: { pace: 3, racecraft: -1, consistency: -1 },
      },
      {
        id: '5B',
        label: 'B',
        text: 'The smart racer who wins on strategy, not raw speed',
        delta: { pace: -1, racecraft: 3, consistency: 0 },
      },
      {
        id: '5C',
        label: 'C',
        text: "The reliable one who's never spectacular but always finishes well",
        delta: { pace: -1, racecraft: 0, consistency: 3 },
      },
    ],
  },
];

export function calculateDriverStats(selectedAnswerIds: (string | null)[]): {
  stats: CoreStats;
  deltas: CoreStats;
} {
  const deltas: CoreStats = { pace: 0, racecraft: 0, consistency: 0 };

  selectedAnswerIds.forEach((answerId, qIndex) => {
    if (!answerId) return;
    const question = BACKGROUND_QUESTIONS[qIndex];
    if (!question) return;
    const choice = question.choices.find((c) => c.id === answerId);
    if (choice) {
      deltas.pace += choice.delta.pace;
      deltas.racecraft += choice.delta.racecraft;
      deltas.consistency += choice.delta.consistency;
    }
  });

  return {
    deltas,
    stats: {
      pace: Math.max(0, Math.min(100, BASE_STATS.pace + deltas.pace)),
      racecraft: Math.max(0, Math.min(100, BASE_STATS.racecraft + deltas.racecraft)),
      consistency: Math.max(0, Math.min(100, BASE_STATS.consistency + deltas.consistency)),
    },
  };
}
