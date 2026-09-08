import React, { useState } from 'react';
import {
  Bug,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CoreStats, KartingRoundResult, KartingSeriesTier } from '../../types';
import { POSITION_BASE_POINTS, ROOKIE_SCALING_BONUS } from '../../data/kartingData';

interface DebugRoundCalculationPanelProps {
  seriesTier: KartingSeriesTier;
  coreStats: CoreStats;
  roundResults: KartingRoundResult[];
}

export const DebugRoundCalculationPanel: React.FC<DebugRoundCalculationPanelProps> = ({
  seriesTier,
  coreStats,
  roundResults,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeRoundTab, setActiveRoundTab] = useState<number>(1);
  const [showAllRounds, setShowAllRounds] = useState<boolean>(false);

  if (!roundResults || roundResults.length === 0) {
    return null;
  }

  const activeRound =
    roundResults.find((r) => r.roundNumber === activeRoundTab) || roundResults[0];

  const renderRoundDetail = (round: KartingRoundResult) => {
    // Resolve debug values from debugDetails or fallback to raw round properties
    const paceStat = round.debugDetails?.paceStat ?? coreStats.pace;
    const paceComp =
      round.debugDetails?.paceComponent ?? Math.round(paceStat * 0.4 * 10) / 10;

    const racecraftStat = round.debugDetails?.racecraftStat ?? coreStats.racecraft;
    const racecraftComp =
      round.debugDetails?.racecraftComponent ?? Math.round(racecraftStat * 0.35 * 10) / 10;

    const consistencyStat = round.debugDetails?.consistencyStat ?? coreStats.consistency;
    const consistencyComp =
      round.debugDetails?.consistencyComponent ?? Math.round(consistencyStat * 0.25 * 10) / 10;

    const rookieBonus =
      round.debugDetails?.rookieScalingBonus ?? ROOKIE_SCALING_BONUS;

    const randomLuck = round.debugDetails?.randomLuck ?? round.randomLuck;
    const computedTotal = round.debugDetails?.computedScoreTotal ?? round.roundScore;

    const positionFromResultSort =
      round.debugDetails?.positionFromResultSort ?? round.finishingPosition;
    const positionPassedToScoring =
      round.debugDetails?.positionPassedToScoring ?? round.finishingPosition;

    const pointsAwarded =
      round.debugDetails?.pointsAwardedFromLookup ?? round.pointsAwarded;
    const bonusAwarded =
      round.debugDetails?.bonusPointsAwarded ?? round.bonusPointsAwarded;
    const totalPoints =
      round.debugDetails?.totalRoundPoints ?? round.totalRoundPoints;

    const isPointsEligible = positionPassedToScoring <= 10;
    const baseLookupExpected = POSITION_BASE_POINTS[positionPassedToScoring] || 0;

    return (
      <div
        key={round.roundNumber}
        id={`debug-detail-round-${round.roundNumber}`}
        className="bg-[#15151E] border border-[#2E2E38] rounded-sm p-4 space-y-4 mb-4"
      >
        {/* Round Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#2E2E38]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-sm bg-[#E10600]/20 border border-[#E10600]/50 text-[#E10600] font-black font-racing text-xs flex items-center justify-center">
              R{round.roundNumber}
            </span>
            <div>
              <span className="font-racing uppercase text-sm font-bold text-white tracking-wide">
                {round.circuitName}
              </span>
              <span className="text-[11px] font-telemetry text-[#9A9AA5] ml-2">
                ({round.circuitLocation})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-telemetry text-xs">
            <span className="px-2 py-0.5 rounded-sm bg-[#24242E] border border-[#2E2E38] text-[#9A9AA5]">
              Sorted Finish: <b className="text-white">P{positionFromResultSort}</b>
            </span>
            <span className="px-2 py-0.5 rounded-sm bg-[#24242E] border border-[#2E2E38] text-[#9A9AA5]">
              Scoring Input: <b className="text-white">Pos {positionPassedToScoring}</b>
            </span>
            <span
              className={`px-2 py-0.5 rounded-sm border font-bold ${
                totalPoints > 0
                  ? 'bg-[#00D26A]/20 border-[#00D26A]/50 text-[#00D26A]'
                  : 'bg-[#24242E] border-[#2E2E38] text-[#9A9AA5]'
              }`}
            >
              Points: {totalPoints}
            </span>
          </div>
        </div>

        {/* Section 1: Player RoundScore Formula Components */}
        <div className="space-y-1.5 font-telemetry text-xs">
          <div className="text-[10px] uppercase font-bold text-[#E10600] tracking-widest flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            1. Player RoundScore Calculation Breakdown
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px]">
            {/* Pace */}
            <div className="p-2.5 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
              <span className="text-[9px] uppercase tracking-wider text-[#9A9AA5] block">
                Pace Contribution (40%)
              </span>
              <div className="font-mono text-white text-xs font-bold mt-0.5">
                {paceStat} × 0.40 = <span className="text-[#38BDF8]">{paceComp.toFixed(2)}</span>
              </div>
            </div>

            {/* Racecraft */}
            <div className="p-2.5 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
              <span className="text-[9px] uppercase tracking-wider text-[#9A9AA5] block">
                Racecraft Contribution (35%)
              </span>
              <div className="font-mono text-white text-xs font-bold mt-0.5">
                {racecraftStat} × 0.35 = <span className="text-[#38BDF8]">{racecraftComp.toFixed(2)}</span>
              </div>
            </div>

            {/* Consistency */}
            <div className="p-2.5 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
              <span className="text-[9px] uppercase tracking-wider text-[#9A9AA5] block">
                Consistency Contribution (25%)
              </span>
              <div className="font-mono text-white text-xs font-bold mt-0.5">
                {consistencyStat} × 0.25 = <span className="text-[#38BDF8]">{consistencyComp.toFixed(2)}</span>
              </div>
            </div>

            {/* Rookie Scaling Bonus */}
            <div className="p-2.5 rounded-sm bg-[#1C1C25] border border-[#00D26A]/40">
              <span className="text-[9px] uppercase tracking-wider text-[#00D26A] block font-bold">
                Rookie Scaling Bonus
              </span>
              <div className="font-mono text-[#00D26A] text-xs font-bold mt-0.5">
                +{rookieBonus.toFixed(2)}
              </div>
            </div>

            {/* Random Luck */}
            <div className="p-2.5 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
              <span className="text-[9px] uppercase tracking-wider text-[#9A9AA5] block">
                Random Luck Roll (±10)
              </span>
              <div
                className={`font-mono text-xs font-bold mt-0.5 ${
                  randomLuck > 0
                    ? 'text-[#00D26A]'
                    : randomLuck < 0
                    ? 'text-[#E10600]'
                    : 'text-white'
                }`}
              >
                {randomLuck > 0 ? `+${randomLuck}` : randomLuck}
              </div>
            </div>
          </div>

          {/* Equation summary */}
          <div className="p-2.5 rounded-sm bg-[#1C1C25] border border-[#2E2E38] font-mono text-xs flex flex-wrap items-center justify-between gap-2">
            <span className="text-[#9A9AA5]">
              Exact Formula: <span className="text-white">({paceComp.toFixed(2)} + {racecraftComp.toFixed(2)} + {consistencyComp.toFixed(2)}) + Rookie Bonus (+{rookieBonus.toFixed(2)}) + ({randomLuck > 0 ? `+${randomLuck}` : randomLuck})</span>
            </span>
            <span className="text-white font-bold bg-[#24242E] px-2.5 py-1 rounded-sm border border-[#2E2E38]">
              Computed Player RoundScore = <span className="text-[#00D26A]">{computedTotal}</span>
            </span>
          </div>
        </div>

        {/* Section 2: Position & Points Lookup Verification */}
        <div className="space-y-1.5 font-telemetry text-xs">
          <div className="text-[10px] uppercase font-bold text-[#FFB800] tracking-widest flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            2. Position &amp; Points Lookup Verification
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="p-2.5 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
              <span className="text-[9px] text-[#9A9AA5] uppercase block">
                Field Sort Position
              </span>
              <span className="text-base font-bold text-white font-mono">
                P{positionFromResultSort} of 20
              </span>
              <span className="text-[10px] text-[#9A9AA5] block mt-0.5">
                (Player ranked against 19 AI scores)
              </span>
            </div>

            <div className="p-2.5 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
              <span className="text-[9px] text-[#9A9AA5] uppercase block">
                Position Passed to calculateRoundPoints()
              </span>
              <span className="text-base font-bold text-white font-mono">
                {positionPassedToScoring}
              </span>
              <span className="text-[10px] text-[#9A9AA5] block mt-0.5">
                {positionFromResultSort === positionPassedToScoring ? (
                  <span className="text-[#00D26A] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Exact match (No off-by-one error)
                  </span>
                ) : (
                  <span className="text-[#E10600] flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Mismatch detected!
                  </span>
                )}
              </span>
            </div>

            <div className="p-2.5 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
              <span className="text-[9px] text-[#9A9AA5] uppercase block">
                Points Lookup Table Result
              </span>
              <div className="text-sm font-bold text-white font-mono">
                Base: {pointsAwarded} | Bonus: {bonusAwarded} = <span className={totalPoints > 0 ? 'text-[#00D26A]' : 'text-[#E10600]'}>{totalPoints} PTS</span>
              </div>
              <span className="text-[10px] text-[#9A9AA5] block mt-0.5">
                {isPointsEligible
                  ? `P${positionPassedToScoring} is eligible for points (P1-P10)`
                  : `P${positionPassedToScoring} is >= 11 (Position points table assigns 0 pts for P11-P20)`}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Full 20-Car Field Scores (Sorted High to Low) */}
        <div className="space-y-1.5 font-telemetry text-xs">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#38BDF8] tracking-widest">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              3. Full 20-Car Field Classification &amp; Scores (Sorted High to Low)
            </span>
            <span className="text-[#9A9AA5] lowercase font-normal">
              player highlighted in red
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto p-2 bg-[#1C1C25] border border-[#2E2E38] rounded-sm font-mono text-[11px]">
            {round.fieldResults && round.fieldResults.length > 0 ? (
              round.fieldResults.map((car) => {
                const isPlayer = car.isPlayer;
                return (
                  <div
                    key={car.position}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors ${
                      isPlayer
                        ? 'bg-[#E10600]/25 border-2 border-[#E10600] text-white font-bold shadow-sm'
                        : car.position <= 10
                        ? 'bg-[#15151E] text-white border border-[#2E2E38]'
                        : 'bg-[#15151E]/60 text-[#9A9AA5] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 text-center font-bold ${
                          car.position <= 3
                            ? 'text-[#FFB800]'
                            : car.position <= 10
                            ? 'text-[#38BDF8]'
                            : 'text-[#9A9AA5]'
                        }`}
                      >
                        P{car.position}
                      </span>
                      <span className="truncate max-w-[160px]">
                        {car.name} {isPlayer && '★ [YOU]'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={isPlayer ? 'text-[#00D26A] font-bold' : 'text-white'}>
                        {car.score.toFixed(1)}
                      </span>
                      <span className="text-[9px] text-[#9A9AA5]">
                        {car.position <= 10 ? `(${POSITION_BASE_POINTS[car.position] || 0} pts)` : '(0 pts)'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-4 text-[#9A9AA5]">
                Field results array not captured for this round.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      id="debug-round-calculation-panel"
      className="bg-[#1C1C25] border-2 border-[#E10600]/60 rounded-sm shadow-2xl overflow-hidden mb-8 mt-6"
    >
      {/* Collapsible Banner Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-[#24242E] hover:bg-[#2A2A36] border-b border-[#2E2E38] flex items-center justify-between cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#E10600]/20 border border-[#E10600] text-[#E10600] flex items-center justify-center">
            <Bug className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-telemetry uppercase tracking-widest font-black text-[#E10600] bg-[#E10600]/10 px-1.5 py-0.5 rounded-sm border border-[#E10600]/30">
                DIAGNOSTIC PANEL
              </span>
              <h3 className="text-base font-black uppercase text-white font-racing tracking-wide">
                DEBUG: Round Calculation Detail
              </h3>
            </div>
            <p className="text-xs text-[#9A9AA5] font-telemetry mt-0.5">
              Raw telemetry trace verifying RoundScores, RandomLuck rolls, 20-car field rankings, and points lookup mapping.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-telemetry text-[#9A9AA5] hidden sm:inline">
            {isOpen ? 'Click to collapse' : 'Click to expand'}
          </span>
          <div className="p-1 rounded-sm bg-[#1C1C25] border border-[#2E2E38] text-[#9A9AA5]">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-5 space-y-6">
          {/* STATIC OUTSIDE SECTION: National Series AI Field Generation Logic */}
          <div className="p-4 rounded-sm bg-[#15151E] border border-[#38BDF8]/40 space-y-3 font-telemetry text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#2E2E38]">
              <div className="flex items-center gap-2 text-white font-bold text-sm uppercase font-racing">
                <Info className="w-4 h-4 text-[#38BDF8]" />
                National Series AI Opponent Field Generation Logic (Code Baseline)
              </div>
              <span className="text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded-sm border border-[#38BDF8]/30 uppercase font-bold">
                Series: {seriesTier.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
              {/* Box 1 */}
              <div className="p-3 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
                <span className="text-[9px] uppercase tracking-wider text-[#9A9AA5] block font-bold mb-1">
                  1. AI Base Skill Distribution
                </span>
                <ul className="space-y-1 text-white">
                  <li>• Target Average: <b className="text-[#38BDF8]">54.0 Skill</b></li>
                  <li>• 19 AI Drivers generated using spread:</li>
                  <li className="font-mono text-[10px] text-[#9A9AA5] pl-2">
                    skillOffset = (idx - 9) × 1.2
                  </li>
                  <li>• Resulting AI Base Skill Range:</li>
                  <li className="font-mono text-xs text-[#38BDF8] font-bold pl-2">
                    43.2 to 64.8 (clamped [20, 95])
                  </li>
                </ul>
              </div>

              {/* Box 2 */}
              <div className="p-3 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
                <span className="text-[9px] uppercase tracking-wider text-[#9A9AA5] block font-bold mb-1">
                  2. Round Variance Applied to AI
                </span>
                <ul className="space-y-1 text-white">
                  <li>• Variance formula per round per AI driver:</li>
                  <li className="font-mono text-[10px] text-[#9A9AA5] pl-2">
                    roundVariance = (rand × 12 - 6)
                  </li>
                  <li>• Range: <b className="text-[#FFB800]">-6.0 to +6.0 points</b></li>
                  <li>• Final AI Round Scores typically land between:</li>
                  <li className="font-mono text-xs text-[#00D26A] font-bold pl-2">
                    ~37.2 to ~70.8
                  </li>
                </ul>
              </div>

              {/* Box 3 */}
              <div className="p-3 rounded-sm bg-[#1C1C25] border border-[#2E2E38]">
                <span className="text-[9px] uppercase tracking-wider text-[#9A9AA5] block font-bold mb-1">
                  3. Player Score vs. Points Table Cutoff
                </span>
                <ul className="space-y-1 text-white">
                  <li>• Player Formula:</li>
                  <li className="font-mono text-[10px] text-[#9A9AA5] pl-2">
                    Pace*0.4 + Race*0.35 + Cons*0.25 + ROOKIE_BONUS (10) ± 10
                  </li>
                  <li>• Player Median Score (with +10 Bonus): <b className="text-[#00D26A]">{((coreStats.pace * 0.4) + (coreStats.racecraft * 0.35) + (coreStats.consistency * 0.25) + ROOKIE_SCALING_BONUS).toFixed(1)}</b></li>
                  <li>• FIA Points Cutoff:</li>
                  <li className="text-[10px] text-[#38BDF8] font-bold pl-2">
                    P1-P10 award points (25 to 1 pt). P11-P20 award 0 pts.
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-2.5 rounded-sm bg-[#1C1C25] border border-[#2E2E38] text-[11px] text-[#9A9AA5] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#00D26A] shrink-0 mt-0.5" />
              <div>
                <b className="text-white">Rookie Scaling Bonus Active (+{ROOKIE_SCALING_BONUS.toFixed(2)}):</b> The named constant <span className="text-[#00D26A] font-bold">ROOKIE_SCALING_BONUS</span> shifts the rookie player baseline from ~40–50 up to ~50–60. This enables competitive battles inside the points-paying positions (P1–P10) against National AI drivers (~54.0 avg skill) rather than automatically finishing in P11–P20.
              </div>
            </div>
          </div>

          {/* PER-ROUND BREAKDOWN CONTROLS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Round Tab Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-telemetry">
              {roundResults.map((r) => (
                <button
                  key={r.roundNumber}
                  type="button"
                  onClick={() => {
                    setActiveRoundTab(r.roundNumber);
                    setShowAllRounds(false);
                  }}
                  className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                    !showAllRounds && activeRoundTab === r.roundNumber
                      ? 'bg-[#E10600] text-white shadow-md'
                      : 'bg-[#15151E] text-[#9A9AA5] hover:text-white border border-[#2E2E38]'
                  }`}
                >
                  Round {r.roundNumber} (P{r.finishingPosition})
                </button>
              ))}
            </div>

            {/* Toggle view all rounds */}
            <button
              type="button"
              onClick={() => setShowAllRounds(!showAllRounds)}
              className="px-3 py-1.5 rounded-sm bg-[#24242E] hover:bg-[#2E2E38] border border-[#2E2E38] text-xs font-telemetry text-white font-bold cursor-pointer transition-colors shrink-0"
            >
              {showAllRounds ? 'Show Single Round Tab' : 'Show All 6 Rounds at Once'}
            </button>
          </div>

          {/* RENDER ACTIVE ROUND OR ALL ROUNDS */}
          <div>
            {showAllRounds ? (
              roundResults.map((r) => renderRoundDetail(r))
            ) : (
              renderRoundDetail(activeRound)
            )}
          </div>
        </div>
      )}
    </div>
  );
};
