import React from 'react';
import {
  Trophy,
  X,
  Flag,
  Sparkles,
  Zap,
  Swords,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Compass,
} from 'lucide-react';
import { F4RaceResult, F4Teammate, F4Team, CoreStats } from '../../types';

interface F4TimingSheetModalProps {
  raceResult: F4RaceResult;
  team: F4Team;
  teammate: F4Teammate;
  playerStats: CoreStats;
  playerLastName: string;
  onClose: () => void;
  onNextRound?: () => void;
  hasNextRound?: boolean;
}

export const F4TimingSheetModal: React.FC<F4TimingSheetModalProps> = ({
  raceResult,
  team,
  teammate,
  playerStats,
  playerLastName,
  onClose,
  onNextRound,
  hasNextRound,
}) => {
  const { track, playerFinish, playerPoints, teammateFinish, teammatePoints, classification, label } = raceResult;

  const isWin = playerFinish === 1;
  const isPodium = playerFinish <= 3;
  const isPoints = playerFinish <= 10;
  const beatTeammate = playerFinish < teammateFinish;

  return (
    <div
      id="f4-timing-sheet-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="f4-timing-sheet-modal"
        className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#2E2E38] bg-[#24242E] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#E10600]/20 border border-[#E10600] flex items-center justify-center text-[#E10600] shrink-0">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-telemetry uppercase tracking-widest text-[#E10600] font-bold">
                  Round {track.round} of 6 Classification
                </span>
                <span className="text-xs px-2 py-0.5 rounded-sm bg-[#1C1C25] border border-[#2E2E38] text-[#9A9AA5] font-telemetry">
                  {track.location}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black italic tracking-wide text-white uppercase font-racing">
                {track.circuitName}
              </h2>
            </div>
          </div>

          <button
            type="button"
            id="close-timing-sheet-btn"
            onClick={onClose}
            className="p-2 rounded-sm text-[#9A9AA5] hover:text-white hover:bg-[#2E2E38] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Primary Result Banner */}
          <div
            className={`p-4 sm:p-5 rounded-sm border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              isWin
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : isPodium
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : isPoints
                ? 'bg-[#24242E] border-[#00D26A]/40 text-white'
                : 'bg-[#24242E] border-[#2E2E38] text-[#9A9AA5]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-sm flex items-center justify-center font-racing font-black text-2xl border shadow-inner shrink-0 ${
                  isWin
                    ? 'bg-amber-500 text-black border-amber-400 shadow-amber-900/40'
                    : isPodium
                    ? 'bg-emerald-500 text-black border-emerald-400'
                    : isPoints
                    ? 'bg-[#E10600] text-white border-[#E10600]'
                    : 'bg-[#2E2E38] text-[#9A9AA5] border-[#3E3E4A]'
                }`}
              >
                P{playerFinish}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-telemetry uppercase tracking-wider font-bold">
                    {isWin
                      ? '🏆 Race Winner'
                      : isPodium
                      ? '🥈 Podium Finish'
                      : isPoints
                      ? 'Points Scored'
                      : 'Outside the Points'}
                  </span>
                  {playerPoints > 0 && (
                    <span className="px-2 py-0.5 rounded-sm bg-[#00D26A]/20 border border-[#00D26A] text-[#00D26A] font-telemetry text-xs font-bold">
                      +{playerPoints} FIA PTS
                    </span>
                  )}
                </div>
                {/* Specific Teammate Comparison Callout (Prompt Requirement) */}
                <p className="text-base sm:text-lg font-bold text-white font-racing tracking-wide mt-1">
                  {label}
                </p>
                {raceResult.highlightLine && (
                  <p className="text-xs italic text-[#E4E4EB] font-sans mt-1">
                    “{raceResult.highlightLine}”
                  </p>
                )}
              </div>
            </div>

            {/* Track Weighting Pill */}
            <div className="bg-[#1C1C25] border border-[#2E2E38] px-3.5 py-2 rounded-sm text-xs font-telemetry text-[#9A9AA5] shrink-0">
              <div className="text-[10px] uppercase font-bold text-[#E10600] tracking-wider mb-0.5">
                Track Stat Bias
              </div>
              <div>
                Pace {(track.weighting.pace * 100).toFixed(0)}% • Racecraft{' '}
                {(track.weighting.racecraft * 100).toFixed(0)}% • Consistency{' '}
                {(track.weighting.consistency * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Teammate Head-to-Head Duel Card */}
          <div className="bg-[#24242E] border border-[#2E2E38] rounded-sm p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-xs font-telemetry uppercase tracking-widest text-[#9A9AA5] font-bold">
                <Swords className="w-4 h-4 text-[#E10600]" />
                {team.name} Garage Head-to-Head Duel
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-sm font-telemetry font-bold uppercase ${
                  beatTeammate
                    ? 'bg-[#00D26A]/20 border border-[#00D26A] text-[#00D26A]'
                    : 'bg-[#E10600]/20 border border-[#E10600] text-[#E10600]'
                }`}
              >
                {beatTeammate ? 'Teammate Defeated' : 'Teammate Ahead'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Player Box */}
              <div className="bg-[#1C1C25] border border-[#E10600]/40 rounded-sm p-3 relative">
                <div className="text-[10px] font-telemetry uppercase text-[#E10600] font-bold">
                  Car 1 • You
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-bold font-racing uppercase text-white">
                    {playerLastName || 'YOU'}
                  </span>
                  <span className="text-xl font-black font-racing text-[#E10600]">
                    P{playerFinish}
                  </span>
                </div>
                <div className="mt-2 text-xs font-telemetry text-[#9A9AA5] space-y-1">
                  <div className="flex justify-between">
                    <span>Performance Score:</span>
                    <b className="text-white">{raceResult.playerScore.toFixed(1)}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Championship Points:</span>
                    <b className="text-white">+{playerPoints} PTS</b>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#9A9AA5]">
                    <span>Luck Variance:</span>
                    <span>{raceResult.randomLuck > 0 ? `+${raceResult.randomLuck}` : raceResult.randomLuck}</span>
                  </div>
                </div>
              </div>

              {/* Teammate Box */}
              <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-3">
                <div className="text-[10px] font-telemetry uppercase text-[#9A9AA5] font-bold">
                  Car 2 • Teammate
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-bold font-racing uppercase text-[#9A9AA5]">
                    {teammate.name}
                  </span>
                  <span className="text-xl font-black font-racing text-white">
                    P{teammateFinish}
                  </span>
                </div>
                <div className="mt-2 text-xs font-telemetry text-[#9A9AA5] space-y-1">
                  <div className="flex justify-between">
                    <span>Performance Score:</span>
                    <b className="text-white">{raceResult.teammateScore.toFixed(1)}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Championship Points:</span>
                    <b className="text-white">+{teammatePoints} PTS</b>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#9A9AA5]">
                    <span>Teammate Rating:</span>
                    <span>{teammate.overallRating} OVR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full 22-Car Timing Sheet Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-telemetry uppercase tracking-widest text-[#9A9AA5] font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#E10600]" />
                Official FIA Race Classification (22 Entrants)
              </div>
              <span className="text-[11px] text-[#9A9AA5] font-telemetry">
                Top 10 score points (25-18-15-12-10-8-6-4-2-1)
              </span>
            </div>

            <div className="border border-[#2E2E38] rounded-sm overflow-hidden">
              <table className="w-full text-left text-xs font-telemetry">
                <thead className="bg-[#24242E] text-[#9A9AA5] uppercase text-[10px] border-b border-[#2E2E38]">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">POS</th>
                    <th className="py-2.5 px-3">DRIVER</th>
                    <th className="py-2.5 px-3 hidden sm:table-cell">TEAM</th>
                    <th className="py-2.5 px-3 text-right">SCORE</th>
                    <th className="py-2.5 px-3 text-right w-16">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2E38]/60 bg-[#1C1C25]">
                  {classification.map((car) => {
                    const isPlayerRow = car.isPlayer;
                    const isTeammateRow = car.isTeammate;

                    return (
                      <tr
                        key={`${car.position}-${car.name}`}
                        className={`transition-colors ${
                          isPlayerRow
                            ? 'bg-[#E10600]/15 font-bold text-white border-l-4 border-l-[#E10600]'
                            : isTeammateRow
                            ? 'bg-[#24242E] font-medium text-white border-l-4 border-l-[#00D26A]'
                            : car.position <= 10
                            ? 'text-[#C5C5D0] hover:bg-[#20202A]'
                            : 'text-[#9A9AA5] hover:bg-[#20202A]'
                        }`}
                      >
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-block font-racing font-black ${
                              car.position === 1
                                ? 'text-amber-400'
                                : car.position <= 3
                                ? 'text-emerald-400'
                                : car.position <= 10
                                ? 'text-white'
                                : 'text-[#9A9AA5]'
                            }`}
                          >
                            P{car.position}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <span>{car.name}</span>
                            {isPlayerRow && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-sm bg-[#E10600] text-white">
                                YOU
                              </span>
                            )}
                            {isTeammateRow && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-sm bg-[#00D26A]/20 border border-[#00D26A] text-[#00D26A]">
                                TEAMMATE
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-[#9A9AA5] hidden sm:table-cell">
                          {car.teamName}
                        </td>
                        <td className="py-2 px-3 text-right font-mono">
                          {car.score.toFixed(1)}
                        </td>
                        <td className="py-2 px-3 text-right font-bold">
                          {car.points > 0 ? (
                            <span className="text-[#00D26A]">+{car.points}</span>
                          ) : (
                            <span className="text-[#656575]">0</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#2E2E38] bg-[#24242E] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#9A9AA5] font-telemetry">
            Round {track.round} of 6 Completed • Standings Updated
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-sm text-xs font-telemetry uppercase tracking-wider font-bold text-[#9A9AA5] hover:text-white bg-[#1C1C25] hover:bg-[#2E2E38] border border-[#2E2E38] transition-colors cursor-pointer"
            >
              Close Timing Sheet
            </button>
            {hasNextRound && onNextRound && (
              <button
                type="button"
                id="next-round-timing-btn"
                onClick={() => {
                  onClose();
                  onNextRound();
                }}
                className="w-full sm:w-auto px-5 py-2 rounded-sm text-xs font-racing uppercase tracking-wider font-black text-white bg-[#E10600] hover:bg-[#b80500] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Proceed to Round {track.round + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
