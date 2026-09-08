import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Play,
  FastForward,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { DriverState, KartingRoundResult, KartingSeriesTier } from '../../types';
import { KARTING_SERIES_OPTIONS, KARTING_TRACKS } from '../../data/kartingData';
import { simulateKartingRound, calculateKartingRating } from '../../utils/raceSimulation';
import { getStatSemanticStyle } from '../../utils/statColors';
import { DebugRoundCalculationPanel } from './DebugRoundCalculationPanel';

interface SeasonSimulationStepProps {
  driverState: DriverState;
  seriesTier: KartingSeriesTier;
  initialResults?: KartingRoundResult[];
  onSeasonComplete: (results: KartingRoundResult[]) => void;
}

export const SeasonSimulationStep: React.FC<SeasonSimulationStepProps> = ({
  driverState,
  seriesTier,
  initialResults = [],
  onSeasonComplete,
}) => {
  const [results, setResults] = useState<KartingRoundResult[]>(initialResults);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(false);
  const [expandedRound, setExpandedRound] = useState<number | null>(null);

  const seriesInfo = KARTING_SERIES_OPTIONS.find((s) => s.id === seriesTier)!;

  const currentRoundIndex = results.length; // 0 to 6
  const isAllCompleted = results.length >= 6;

  // Refs for tracking auto-advance interval and precalculated results
  const queueRef = useRef<KartingRoundResult[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Calculate live cumulative metrics
  const totalPoints = results.reduce((acc, r) => acc + r.totalRoundPoints, 0);
  const winsCount = results.filter((r) => r.finishingPosition === 1).length;
  const podiumsCount = results.filter((r) => r.finishingPosition <= 3).length;
  const currentKartingRating = calculateKartingRating(totalPoints);

  // Auto-simulate the entire season: calculates all rounds immediately, reveals progressively
  const handleSimulateSeason = () => {
    if (isAutoSimulating || isAllCompleted) return;

    // 1. Calculate all remaining rounds immediately using existing formula
    const allRounds: KartingRoundResult[] = [];
    for (let r = 1; r <= 6; r++) {
      allRounds.push(
        simulateKartingRound(r, seriesTier, driverState.coreStats, driverState.lastName)
      );
    }

    queueRef.current = allRounds;
    setIsAutoSimulating(true);

    // Reveal 1st round immediately
    setResults([allRounds[0]]);
    setExpandedRound(null);

    let nextIndex = 1;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (nextIndex < allRounds.length) {
        const upTo = allRounds.slice(0, nextIndex + 1);
        setResults(upTo);
        nextIndex++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsAutoSimulating(false);
      }
    }, 1600); // 1.6-second auto-advancing reveal cadence
  };

  // Instant reveal / skip animation if player prefers immediate results
  const handleInstantReveal = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (queueRef.current.length > 0) {
      setResults(queueRef.current);
    }
    setIsAutoSimulating(false);
  };

  const getPositionBadge = (pos: number) => {
    if (pos === 1) {
      return {
        text: 'P1',
        label: 'WINNER',
        className: 'bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/50 font-black',
      };
    }
    if (pos <= 3) {
      return {
        text: `P${pos}`,
        label: 'PODIUM',
        className: 'bg-[#00D26A]/15 text-[#00D26A] border-[#00D26A]/50 font-black',
      };
    }
    if (pos <= 10) {
      return {
        text: `P${pos}`,
        label: 'POINTS',
        className: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/40 font-bold',
      };
    }
    return {
      text: `P${pos}`,
      label: 'FINISH',
      className: 'bg-[#24242E] text-[#9A9AA5] border-[#2E2E38] font-medium',
    };
  };

  return (
    <div id="karting-season-simulation" className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#2E2E38] mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-telemetry uppercase tracking-widest text-[#E10600] font-bold mb-1">
            <Trophy className="w-3.5 h-3.5" />
            Karting Phase • Step 2 of 3 • Race Simulation
          </div>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-wide text-white uppercase font-racing">
            {seriesInfo.name}
          </h1>
          <p className="text-[#9A9AA5] text-xs sm:text-sm max-w-2xl mt-1 font-telemetry">
            Simulate 6 rounds across European karting circuits. Every round computes race score from your Pace, Racecraft, Consistency, and race luck.
          </p>
        </div>

        {/* Live Season Telemetry Tally */}
        <div className="grid grid-cols-4 gap-2 bg-[#1C1C25] border border-[#2E2E38] p-3 rounded-sm shadow-xl shrink-0 font-telemetry text-center">
          <div className="px-2">
            <span className="text-[9px] text-[#9A9AA5] uppercase block">Round</span>
            <span className="text-base font-black text-white">
              {results.length}<span className="text-xs text-[#9A9AA5]">/6</span>
            </span>
          </div>
          <div className="px-2 border-l border-[#2E2E38]">
            <span className="text-[9px] text-[#9A9AA5] uppercase block">Points</span>
            <span className="text-base font-black text-[#00D26A]">{totalPoints}</span>
          </div>
          <div className="px-2 border-l border-[#2E2E38]">
            <span className="text-[9px] text-[#9A9AA5] uppercase block">Podiums</span>
            <span className="text-base font-black text-[#FFB800]">{podiumsCount}</span>
          </div>
          <div className="px-2 border-l border-[#2E2E38]">
            <span className="text-[9px] text-[#9A9AA5] uppercase block">Rating</span>
            <span className="text-base font-black text-white">{currentKartingRating}</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="bg-[#1C1C25] border border-[#2E2E38] p-4 rounded-sm mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#24242E] border border-[#2E2E38] flex items-center justify-center text-[#E10600]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-telemetry uppercase tracking-widest text-white font-bold">
              {isAllCompleted
                ? 'Season Simulation Concluded'
                : isAutoSimulating
                ? `Auto-Simulating Championship... Revealing Round ${results.length} of 6`
                : 'Championship Season Ready • 6 Rounds'}
            </div>
            <div className="text-xs text-[#9A9AA5] font-telemetry">
              {isAllCompleted
                ? 'All 6 rounds officially logged. Ready to aggregate rating and unlock F4 offers.'
                : 'Auto-simulation resolves all 6 rounds and progressively reveals results with race highlights.'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isAllCompleted ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                id="simulate-season-btn"
                onClick={handleSimulateSeason}
                disabled={isAutoSimulating}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-sm font-racing text-sm font-black uppercase tracking-wider text-white bg-[#E10600] hover:bg-[#b80500] disabled:bg-[#24242E] disabled:text-[#9A9AA5] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.99]"
              >
                <Play className={`w-4 h-4 ${isAutoSimulating ? 'animate-pulse' : 'fill-white'}`} />
                <span>
                  {isAutoSimulating
                    ? `Simulating (${results.length}/6)...`
                    : 'Simulate Season'}
                </span>
              </button>

              {isAutoSimulating && (
                <button
                  type="button"
                  id="skip-reveal-btn"
                  onClick={handleInstantReveal}
                  className="px-3 py-3 rounded-sm font-racing text-xs font-bold uppercase tracking-wider text-[#9A9AA5] hover:text-white bg-[#24242E] hover:bg-[#2E2E38] border border-[#2E2E38] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Reveal all remaining rounds immediately"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Fast-Forward</span>
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              id="proceed-to-offers-btn"
              onClick={() => onSeasonComplete(results)}
              className="w-full sm:w-auto px-6 py-3 rounded-sm font-racing text-base font-black uppercase tracking-wider text-white bg-[#00D26A] hover:bg-[#00b259] text-black shadow-lg shadow-black/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              <span>View Season Summary &amp; F4 Offers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progressive Round Results Timing Sheet */}
      <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm shadow-xl overflow-hidden mb-8">
        {/* Table Header */}
        <div className="p-4 border-b border-[#2E2E38] bg-[#15151E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E10600]"></span>
            <span className="text-xs font-racing uppercase tracking-wider text-white font-bold">
              Official Championship Timing Sheet
            </span>
          </div>
          <span className="text-[11px] font-telemetry uppercase tracking-widest text-[#9A9AA5]">
            20-Car Field • 6 Rounds Total
          </span>
        </div>

        {/* Empty state before simulation begins */}
        {results.length === 0 && (
          <div className="p-12 text-center text-[#9A9AA5] font-telemetry">
            <div className="w-12 h-12 rounded-sm bg-[#24242E] border border-[#2E2E38] flex items-center justify-center mx-auto mb-3 text-[#9A9AA5]">
              <Trophy className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white uppercase tracking-wider font-racing mb-1">
              Championship Calendar Ready (6 Rounds)
            </p>
            <p className="text-xs max-w-sm mx-auto text-[#9A9AA5] mb-4">
              Click &quot;Simulate Season&quot; to auto-advance through all 6 rounds and review your performance.
            </p>
            <button
              type="button"
              onClick={handleSimulateSeason}
              className="px-6 py-2.5 rounded-sm font-racing text-xs font-black uppercase tracking-wider text-white bg-[#E10600] hover:bg-[#b80500] transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Simulate Season</span>
            </button>
          </div>
        )}

        {/* Render Completed Rounds Progressively */}
        <div className="divide-y divide-[#2E2E38]">
          {results.map((round) => {
            const badge = getPositionBadge(round.finishingPosition);
            const isExpanded = expandedRound === round.roundNumber;

            return (
              <div
                key={round.roundNumber}
                id={`round-result-${round.roundNumber}`}
                className="p-4 hover:bg-[#20202B] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Round & Track Info */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Position Badge */}
                    <div
                      className={`w-14 h-12 rounded-sm border flex flex-col items-center justify-center shrink-0 ${badge.className}`}
                    >
                      <span className="text-base font-racing leading-none">{badge.text}</span>
                      <span className="text-[8px] font-telemetry uppercase tracking-widest leading-none mt-0.5">
                        {badge.label}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-telemetry uppercase tracking-wider font-bold text-[#E10600]">
                          Round {round.roundNumber}
                        </span>
                        <span className="text-xs text-[#9A9AA5]">•</span>
                        <span className="text-xs text-[#9A9AA5] font-telemetry">
                          {round.circuitLocation}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white uppercase font-racing tracking-wide">
                        {round.circuitName}
                      </h4>
                      {/* One-Line Result Label */}
                      <p className="text-xs text-[#00D26A] font-telemetry font-semibold mt-0.5">
                        {round.label}
                      </p>
                      {/* Narrative Flavor Highlight Phrase */}
                      {round.highlightLine && (
                        <div className="mt-1.5 text-xs italic text-[#E4E4EB] font-sans flex items-center gap-1.5 bg-[#15151E] px-2.5 py-1 rounded-sm border border-[#2E2E38]/80 max-w-xl">
                          <span className="text-[#E10600] font-black not-italic font-racing text-sm select-none">“</span>
                          <span>{round.highlightLine}</span>
                          <span className="text-[#E10600] font-black not-italic font-racing text-sm select-none">”</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Points & Details Toggle */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 font-telemetry">
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1.5">
                        <span className="text-lg font-black text-white font-racing">
                          +{round.totalRoundPoints}
                        </span>
                        <span className="text-xs text-[#9A9AA5]">PTS</span>
                      </div>
                      <span className="text-[10px] text-[#9A9AA5]">
                        Base {round.pointsAwarded}
                        {round.bonusPointsAwarded > 0 && ` + ${round.bonusPointsAwarded} Bonus`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedRound(isExpanded ? null : round.roundNumber)}
                      className="p-1.5 rounded-sm bg-[#24242E] hover:bg-[#2E2E38] border border-[#2E2E38] text-[#9A9AA5] hover:text-white transition-colors cursor-pointer"
                      title={isExpanded ? 'Hide telemetry breakdown' : 'View telemetry breakdown'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Telemetry Breakdown Details */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-[#2E2E38] bg-[#15151E] p-3 rounded-sm font-telemetry text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#9A9AA5] font-bold">
                        Formula Telemetry Breakdown
                      </span>
                      <span className="text-[10px] text-[#9A9AA5]">
                        Round Score: <b className="text-white font-bold">{round.roundScore}</b>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mb-3">
                      <div className="p-2 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
                        <span className="text-[9px] text-[#9A9AA5] uppercase block">Pace (40%)</span>
                        <span className="font-bold text-white">
                          {(driverState.coreStats.pace * 0.4).toFixed(1)}
                        </span>
                      </div>
                      <div className="p-2 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
                        <span className="text-[9px] text-[#9A9AA5] uppercase block">Racecraft (35%)</span>
                        <span className="font-bold text-white">
                          {(driverState.coreStats.racecraft * 0.35).toFixed(1)}
                        </span>
                      </div>
                      <div className="p-2 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
                        <span className="text-[9px] text-[#9A9AA5] uppercase block">Consistency (25%)</span>
                        <span className="font-bold text-white">
                          {(driverState.coreStats.consistency * 0.25).toFixed(1)}
                        </span>
                      </div>
                      <div className="p-2 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
                        <span className="text-[9px] text-[#9A9AA5] uppercase block">Random Luck (±10)</span>
                        <span
                          className={`font-bold ${
                            round.randomLuck > 0
                              ? 'text-[#00D26A]'
                              : round.randomLuck < 0
                              ? 'text-[#E10600]'
                              : 'text-white'
                          }`}
                        >
                          {round.randomLuck > 0 ? `+${round.randomLuck}` : round.randomLuck}
                        </span>
                      </div>
                    </div>

                    {/* Top 5 Field Classification */}
                    {round.fieldResults && (
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#9A9AA5] block mb-1">
                          Top 5 Finishers:
                        </span>
                        <div className="space-y-1">
                          {round.fieldResults.slice(0, 5).map((competitor) => (
                            <div
                              key={competitor.position}
                              className={`flex items-center justify-between px-2 py-1 rounded-sm text-[10px] ${
                                competitor.isPlayer
                                  ? 'bg-[#E10600]/20 border border-[#E10600]/50 text-white font-bold'
                                  : 'bg-[#1C1C25] text-[#9A9AA5]'
                              }`}
                            >
                              <span>
                                P{competitor.position} • {competitor.name}
                              </span>
                              <span>{competitor.score.toFixed(1)} Score</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Pending rounds indicators */}
          {Array.from({ length: 6 - results.length }).map((_, idx) => {
            const pendingRoundNum = results.length + idx + 1;
            const track = KARTING_TRACKS[pendingRoundNum - 1];

            return (
              <div
                key={pendingRoundNum}
                className="p-4 bg-[#15151E]/50 flex items-center justify-between opacity-50 font-telemetry"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-10 rounded-sm border border-dashed border-[#2E2E38] flex items-center justify-center text-xs text-[#9A9AA5] font-racing">
                    R{pendingRoundNum}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#9A9AA5] block">
                      Scheduled Round
                    </span>
                    <span className="text-sm font-bold text-[#9A9AA5] font-racing uppercase">
                      {track?.name} ({track?.location})
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#9A9AA5] uppercase tracking-wider">Awaiting Simulation</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Panel: Detailed Round Calculation Breakdown */}
      {results.length > 0 && (
        <DebugRoundCalculationPanel
          seriesTier={seriesTier}
          coreStats={driverState.coreStats}
          roundResults={results}
        />
      )}
    </div>
  );
};
