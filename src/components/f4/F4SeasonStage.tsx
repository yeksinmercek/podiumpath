import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Flag,
  Play,
  CheckCircle2,
  Lock,
  Swords,
  Shield,
  Gauge,
  Activity,
  Award,
  ChevronRight,
  Eye,
  RotateCcw,
  Sparkles,
  FastForward,
} from 'lucide-react';
import { DriverState, F4RaceResult, F4Track } from '../../types';
import { simulateF4Race, calculateF4Standings } from '../../utils/raceSimulation';
import { F4TimingSheetModal } from './F4TimingSheetModal';
import { F4StandingsTable } from './F4StandingsTable';

interface F4SeasonStageProps {
  driverState: DriverState;
  onUpdateDriverState: (updater: (prev: DriverState) => DriverState) => void;
  onRestartKarting: () => void;
}

export const F4SeasonStage: React.FC<F4SeasonStageProps> = ({
  driverState,
  onUpdateDriverState,
  onRestartKarting,
}) => {
  const f4Season = driverState.f4Season;
  if (!f4Season) {
    return null;
  }

  const { team, teammate, calendar, raceResults, standings, aiGridRoster } = f4Season;
  const [selectedResultToView, setSelectedResultToView] = useState<F4RaceResult | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'standings'>('calendar');
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(false);

  // Next round to simulate is raceResults.length + 1
  const nextRoundNumber = raceResults.length + 1;
  const isSeasonComplete = raceResults.length >= calendar.length;

  const queueRef = useRef<F4RaceResult[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Single "Simulate Season" flow: calculates all rounds immediately, reveals progressively
  const handleSimulateSeason = () => {
    if (isSeasonComplete || isAutoSimulating) return;

    // 1. Calculate all remaining races immediately using existing formula
    const simulatedAll: F4RaceResult[] = [];
    for (let i = 0; i < calendar.length; i++) {
      if (i < raceResults.length) {
        simulatedAll.push(raceResults[i]);
      } else {
        const res = simulateF4Race(
          calendar[i],
          driverState.coreStats,
          driverState.lastName,
          team,
          teammate,
          aiGridRoster
        );
        simulatedAll.push(res);
      }
    }

    queueRef.current = simulatedAll;
    setIsAutoSimulating(true);

    // Reveal 1st remaining round immediately
    let nextCount = raceResults.length + 1;
    const initialSlice = simulatedAll.slice(0, nextCount);
    const initialStandings = calculateF4Standings(
      initialSlice,
      team,
      teammate,
      driverState.lastName
    );

    onUpdateDriverState((prev) => {
      if (!prev.f4Season) return prev;
      return {
        ...prev,
        f4Season: {
          ...prev.f4Season,
          raceResults: initialSlice,
          standings: initialStandings,
        },
      };
    });

    nextCount++;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (nextCount <= simulatedAll.length) {
        const slice = simulatedAll.slice(0, nextCount);
        const standingsSlice = calculateF4Standings(
          slice,
          team,
          teammate,
          driverState.lastName
        );

        onUpdateDriverState((prev) => {
          if (!prev.f4Season) return prev;
          return {
            ...prev,
            f4Season: {
              ...prev.f4Season,
              raceResults: slice,
              standings: standingsSlice,
            },
          };
        });

        nextCount++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsAutoSimulating(false);
      }
    }, 1600); // 1.6-second auto-advancing reveal cadence
  };

  // Instant reveal to skip animation
  const handleInstantReveal = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (queueRef.current.length > 0) {
      const finalSlice = queueRef.current;
      const finalStandings = calculateF4Standings(
        finalSlice,
        team,
        teammate,
        driverState.lastName
      );
      onUpdateDriverState((prev) => {
        if (!prev.f4Season) return prev;
        return {
          ...prev,
          f4Season: {
            ...prev.f4Season,
            raceResults: finalSlice,
            standings: finalStandings,
          },
        };
      });
    }
    setIsAutoSimulating(false);
  };

  return (
    <div id="f4-season-stage" className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Top Header & Team / Teammate Overview */}
      <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E10600]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Driver & Team Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-sm bg-[#E10600] flex items-center justify-center font-racing font-black text-2xl text-white shadow-lg border border-[#E10600] shrink-0">
              #{driverState.number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-telemetry uppercase tracking-widest text-[#E10600] font-bold">
                  FIA Formula 4 Championship
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-sm bg-[#24242E] border border-[#2E2E38] text-white font-telemetry font-bold">
                  {team.tier} Tier
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black italic tracking-wide text-white uppercase font-racing">
                {driverState.lastName ? `${driverState.lastName}` : 'Rookie'} • {team.name}
              </h1>
              <div className="text-xs text-[#9A9AA5] font-telemetry mt-0.5">
                Car Strength {team.strengthRating}/100 • {team.chassis || 'Tatuus F4-T421'} • {team.engineSupplier || 'Abarth 1.4L Turbo'}
              </div>
            </div>
          </div>

          {/* AI Teammate Card (Permanent throughout season) */}
          <div
            id="permanent-teammate-card"
            className="bg-[#24242E] border border-[#2E2E38] rounded-sm p-3.5 sm:p-4 flex items-center justify-between sm:justify-start gap-4"
          >
            <div className="w-11 h-11 rounded-sm bg-[#00D26A]/15 border border-[#00D26A]/40 flex items-center justify-center text-[#00D26A] font-racing font-black text-xl shrink-0">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-telemetry uppercase tracking-wider text-[#9A9AA5] font-bold">
                <span>Assigned Garage Teammate</span>
                <span className="px-1.5 py-0.2 rounded-sm bg-[#00D26A]/20 text-[#00D26A] text-[9px]">
                  {teammate.overallRating} OVR
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white font-racing uppercase tracking-wide">
                {teammate.name}
              </div>
              <div className="flex items-center gap-3 text-[11px] font-telemetry text-[#9A9AA5] mt-0.5">
                <span>PAC: <b className="text-white">{teammate.pace}</b></span>
                <span>RAC: <b className="text-white">{teammate.racecraft}</b></span>
                <span>CON: <b className="text-white">{teammate.consistency}</b></span>
              </div>
            </div>
          </div>
        </div>

        {/* Season Navigation Tabs */}
        <div className="flex items-center justify-between border-t border-[#2E2E38] mt-6 pt-4">
          <div className="flex items-center gap-2" role="tablist">
            <button
              type="button"
              id="tab-calendar"
              role="tab"
              aria-selected={activeTab === 'calendar'}
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 rounded-sm text-xs font-racing uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'calendar'
                  ? 'bg-[#E10600] text-white shadow-md'
                  : 'bg-[#24242E] text-[#9A9AA5] hover:text-white border border-[#2E2E38]'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Season Calendar ({raceResults.length}/6)</span>
            </button>

            <button
              type="button"
              id="tab-standings"
              role="tab"
              aria-selected={activeTab === 'standings'}
              onClick={() => setActiveTab('standings')}
              className={`px-4 py-2 rounded-sm text-xs font-racing uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'standings'
                  ? 'bg-[#E10600] text-white shadow-md'
                  : 'bg-[#24242E] text-[#9A9AA5] hover:text-white border border-[#2E2E38]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Championship Standings</span>
              {raceResults.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-sm bg-black/40 text-white text-[10px]">
                  P{standings.playerStandingPosition}
                </span>
              )}
            </button>
          </div>

          {/* Quick Sim / Status Pill */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-telemetry">
            {isSeasonComplete ? (
              <span className="text-[#00D26A] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Championship Finished
              </span>
            ) : (
              <span className="text-[#9A9AA5]">
                Next Up: <b className="text-white">Round {nextRoundNumber} ({calendar[nextRoundNumber - 1]?.name})</b>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar with prominent Simulate Season button */}
      <div className="bg-[#1C1C25] border border-[#2E2E38] p-4 rounded-sm flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#24242E] border border-[#2E2E38] flex items-center justify-center text-[#E10600]">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-telemetry uppercase tracking-widest text-white font-bold">
              {isSeasonComplete
                ? 'FIA Formula 4 Championship Concluded'
                : isAutoSimulating
                ? `Auto-Simulating Championship... Revealing Round ${raceResults.length} of 6`
                : '6-Round Championship Season Ready'}
            </div>
            <div className="text-xs text-[#9A9AA5] font-telemetry">
              {isSeasonComplete
                ? `Finished P${standings.playerStandingPosition} with ${standings.drivers.find((d) => d.isPlayer)?.points || 0} points • Teammate duel: ${standings.playerHeadToHeadWins}-${standings.teammateHeadToHeadWins}`
                : 'Auto-simulation executes all 6 rounds with track-specific stat biases and reveals progressive highlights.'}
            </div>
          </div>
        </div>

        {/* Prominent Action Button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {!isSeasonComplete ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                id="simulate-season-btn"
                onClick={handleSimulateSeason}
                disabled={isAutoSimulating}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-sm font-racing text-sm font-black uppercase tracking-wider text-white bg-[#E10600] hover:bg-[#b80500] disabled:bg-[#24242E] disabled:text-[#9A9AA5] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/40 active:scale-[0.99]"
              >
                <Play className={`w-4 h-4 ${isAutoSimulating ? 'animate-pulse' : 'fill-current'}`} />
                <span>
                  {isAutoSimulating
                    ? `Simulating (${raceResults.length}/6)...`
                    : 'Simulate Season'}
                </span>
              </button>

              {isAutoSimulating && (
                <button
                  type="button"
                  id="skip-reveal-f4-btn"
                  onClick={handleInstantReveal}
                  className="px-3.5 py-3 rounded-sm font-racing text-xs font-bold uppercase tracking-wider text-[#9A9AA5] hover:text-white bg-[#24242E] hover:bg-[#2E2E38] border border-[#2E2E38] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
              id="view-standings-summary-btn"
              onClick={() => setActiveTab('standings')}
              className="w-full sm:w-auto px-6 py-3 rounded-sm font-racing text-sm font-black uppercase tracking-wider text-white bg-[#00D26A] hover:bg-[#00b259] text-black shadow-lg shadow-black/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              <Trophy className="w-4 h-4" />
              <span>Inspect Championship Standings &amp; Rivalry</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'calendar' ? (
        <div className="space-y-6">
          {/* Calendar List (6 Rounds) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black italic tracking-wide text-white uppercase font-racing flex items-center gap-2">
                <Flag className="w-4 h-4 text-[#E10600]" />
                6-Round Championship Calendar
              </h2>
              <span className="text-xs font-telemetry text-[#9A9AA5]">
                Track-specific stat weightings modify your RoundScore calculation
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5" role="feed" aria-label="Season Race Rounds">
              {calendar.map((track, idx) => {
                const roundResult = raceResults.find((r) => r.roundNumber === track.round);
                const isCompleted = !!roundResult;
                const isCurrentSimulating = isAutoSimulating && track.round === nextRoundNumber;
                const isNext = track.round === nextRoundNumber;
                const isLocked = track.round > nextRoundNumber;

                return (
                  <div
                    key={track.round}
                    id={`round-card-${track.round}`}
                    className={`rounded-sm border p-4 sm:p-5 transition-all relative overflow-hidden ${
                      isCompleted
                        ? 'bg-[#1C1C25] border-[#2E2E38] hover:border-[#3E3E4A]'
                        : isCurrentSimulating
                        ? 'bg-[#24242E] border-2 border-[#E10600] ring-1 ring-[#E10600]/30 shadow-xl'
                        : isNext
                        ? 'bg-[#20202B] border-[#3E3E4A]'
                        : 'bg-[#181820] border-[#25252E] opacity-70'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Round & Track Info */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-sm flex items-center justify-center font-racing font-black text-lg border shrink-0 ${
                            isCompleted
                              ? 'bg-[#00D26A]/20 border-[#00D26A] text-[#00D26A]'
                              : isCurrentSimulating
                              ? 'bg-[#E10600] border-[#E10600] text-white shadow-lg animate-pulse'
                              : 'bg-[#24242E] border-[#2E2E38] text-[#9A9AA5]'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : `R${track.round}`}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <span className="text-xs font-telemetry uppercase tracking-widest text-[#E10600] font-bold">
                              Round {track.round}
                            </span>
                            <span className="text-xs text-[#9A9AA5] font-telemetry">• {track.location}</span>
                            {isCompleted && (
                              <span className="px-2 py-0.5 rounded-sm bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/40 text-[10px] font-telemetry font-bold">
                                Finished P{roundResult.playerFinish} (+{roundResult.playerPoints} PTS)
                              </span>
                            )}
                            {isCurrentSimulating && (
                              <span className="px-2 py-0.5 rounded-sm bg-[#E10600] text-white text-[10px] font-telemetry font-bold uppercase tracking-wider animate-pulse">
                                Simulating Now...
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl sm:text-2xl font-black italic tracking-wide text-white uppercase font-racing">
                            {track.name} — <span className="text-[#C5C5D0] text-lg font-normal">{track.circuitName}</span>
                          </h3>

                          <p className="text-xs text-[#9A9AA5] font-telemetry mt-1">
                            {track.characteristic}
                          </p>

                          {/* Track Stat Weighting Badges (Prompt Requirement) */}
                          <div className="flex flex-wrap items-center gap-2 mt-2.5">
                            <span className="text-[10px] uppercase font-telemetry font-bold text-[#9A9AA5]">
                              Formula Weighting:
                            </span>
                            <span className={`px-2 py-0.5 rounded-sm text-[11px] font-telemetry font-bold border ${
                              track.weighting.pace >= 0.4
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-[#1C1C25] text-[#9A9AA5] border-[#2E2E38]'
                            }`}>
                              Pace {(track.weighting.pace * 100).toFixed(0)}%
                            </span>
                            <span className={`px-2 py-0.5 rounded-sm text-[11px] font-telemetry font-bold border ${
                              track.weighting.racecraft >= 0.4
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : 'bg-[#1C1C25] text-[#9A9AA5] border-[#2E2E38]'
                            }`}>
                              Racecraft {(track.weighting.racecraft * 100).toFixed(0)}%
                            </span>
                            <span className={`px-2 py-0.5 rounded-sm text-[11px] font-telemetry font-bold border ${
                              track.weighting.consistency >= 0.4
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-[#1C1C25] text-[#9A9AA5] border-[#2E2E38]'
                            }`}>
                              Consistency {(track.weighting.consistency * 100).toFixed(0)}%
                            </span>
                          </div>

                          {/* Narrative Flavor Highlight Phrase */}
                          {isCompleted && roundResult.highlightLine && (
                            <div className="mt-2.5 text-xs italic text-[#E4E4EB] font-sans flex items-center gap-1.5 bg-[#15151E] px-3 py-1.5 rounded-sm border border-[#2E2E38]/80 max-w-xl">
                              <span className="text-[#E10600] font-black not-italic font-racing text-sm select-none">“</span>
                              <span>{roundResult.highlightLine}</span>
                              <span className="text-[#E10600] font-black not-italic font-racing text-sm select-none">”</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions / Status */}
                      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                        {isCompleted && (
                          <button
                            type="button"
                            id={`view-result-btn-${track.round}`}
                            onClick={() => setSelectedResultToView(roundResult)}
                            className="px-4 py-2.5 rounded-sm font-racing text-xs uppercase tracking-wider font-bold text-white bg-[#24242E] hover:bg-[#2E2E38] border border-[#2E2E38] flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#E10600]" />
                            <span>View Timing Sheet</span>
                          </button>
                        )}

                        {!isCompleted && (
                          <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-sm font-telemetry text-xs uppercase tracking-wider text-[#9A9AA5] bg-[#1C1C25] border border-[#2E2E38]">
                            {isCurrentSimulating ? (
                              <span className="text-[#E10600] font-bold animate-pulse">Resolving...</span>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Round {track.round} Scheduled</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Result Callout Ribbon if finished */}
                    {isCompleted && (
                      <div className="mt-3 pt-3 border-t border-[#2E2E38]/60 flex flex-wrap items-center justify-between text-xs font-telemetry text-[#9A9AA5]">
                        <span className="font-semibold text-white">
                          Outcome: {roundResult.label}
                        </span>
                        <div className="flex items-center gap-3">
                          <span>
                            You: <b className="text-white">P{roundResult.playerFinish}</b> ({roundResult.playerScore.toFixed(1)} score)
                          </span>
                          <span>
                            Teammate: <b className="text-white">P{roundResult.teammateFinish}</b> ({roundResult.teammateScore.toFixed(1)} score)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Standings Preview Footer */}
          <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-telemetry uppercase tracking-wider text-[#9A9AA5]">
                Championship Status
              </div>
              <div className="text-sm sm:text-base font-bold font-racing uppercase text-white">
                {raceResults.length === 0
                  ? 'Season Ready to Begin'
                  : `Current Standing: P${standings.playerStandingPosition} • ${standings.drivers.find((d) => d.isPlayer)?.points || 0} Points`}
              </div>
            </div>

            <button
              type="button"
              id="view-full-standings-footer-btn"
              onClick={() => setActiveTab('standings')}
              className="w-full sm:w-auto px-5 py-2 rounded-sm text-xs font-racing uppercase tracking-wider font-bold text-white bg-[#24242E] hover:bg-[#2E2E38] border border-[#2E2E38] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-[#E10600]" />
              <span>Inspect Full Standings Table</span>
            </button>
          </div>
        </div>
      ) : (
        /* Standings Tab: Standings & Full Round-by-Round Recap (Always visible & scrollable) */
        <div className="space-y-6">
          <F4StandingsTable
            standings={standings}
            team={team}
            teammate={teammate}
            calendar={calendar}
            playerLastName={driverState.lastName}
          />

          {/* 6-Round Race Results Recap preserved & scrollable on Summary */}
          {raceResults.length > 0 && (
            <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2E2E38]">
                <div className="flex items-center gap-2 font-racing text-sm uppercase text-white font-bold">
                  <Flag className="w-4 h-4 text-[#E10600]" />
                  <span>Season Race-by-Race Log ({raceResults.length}/6 Rounds)</span>
                </div>
                <span className="text-xs font-telemetry text-[#9A9AA5]">
                  Select &quot;View Timing Sheet&quot; for full 22-car classification
                </span>
              </div>

              <div className="divide-y divide-[#2E2E38]">
                {raceResults.map((round) => (
                  <div
                    key={round.roundNumber}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-telemetry hover:bg-[#20202B] px-2 rounded-sm transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span
                        className={`w-10 h-8 rounded-sm border flex items-center justify-center font-racing font-bold text-xs shrink-0 ${
                          round.playerFinish === 1
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : round.playerFinish <= 3
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : round.playerFinish <= 10
                            ? 'bg-[#E10600]/20 text-white border-[#E10600]/50'
                            : 'bg-[#24242E] text-[#9A9AA5] border-[#2E2E38]'
                        }`}
                      >
                        P{round.playerFinish}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-[#E10600]">
                            R{round.roundNumber}
                          </span>
                          <span className="text-white font-semibold text-sm font-racing uppercase">
                            {round.track.name}
                          </span>
                          <span className="text-[#9A9AA5] hidden sm:inline">
                            • {round.track.location}
                          </span>
                          <span className="px-1.5 py-0.2 rounded-sm bg-[#24242E] text-white text-[10px]">
                            Score: {round.playerScore.toFixed(1)}
                          </span>
                        </div>

                        {round.highlightLine ? (
                          <div className="text-xs italic text-[#E4E4EB] font-sans mt-0.5">
                            “{round.highlightLine}”
                          </div>
                        ) : (
                          <div className="text-xs text-[#9A9AA5] mt-0.5">{round.label}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <span className="font-racing font-bold text-white text-sm">
                          +{round.playerPoints} PTS
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedResultToView(round)}
                        className="px-3 py-1.5 rounded-sm font-racing text-xs uppercase tracking-wider font-bold text-white bg-[#24242E] hover:bg-[#2E2E38] border border-[#2E2E38] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3 h-3 text-[#E10600]" />
                        <span>Timing Sheet</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Race Result Modal / Timing Sheet */}
      {selectedResultToView && (
        <F4TimingSheetModal
          raceResult={selectedResultToView}
          team={team}
          teammate={teammate}
          playerStats={driverState.coreStats}
          playerLastName={driverState.lastName}
          onClose={() => setSelectedResultToView(null)}
          hasNextRound={false}
        />
      )}
    </div>
  );
};
