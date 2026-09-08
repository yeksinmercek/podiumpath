import React, { useState } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  FileSignature,
  Gauge,
  Flag,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { DriverState, F4Team, KartingRoundResult, KartingSeriesTier } from '../../types';
import { KARTING_RATING_MAX_POINTS, KARTING_SERIES_OPTIONS } from '../../data/kartingData';
import { SERIES_MAX_TIER_CAPS } from '../../data/f4Teams';
import { getStatSemanticStyle } from '../../utils/statColors';
import { DebugRoundCalculationPanel } from './DebugRoundCalculationPanel';

interface OffersStepProps {
  driverState: DriverState;
  seriesTier: KartingSeriesTier;
  roundResults: KartingRoundResult[];
  totalPoints: number;
  kartingRating: number;
  offers: F4Team[];
  selectedTeam: F4Team | null;
  onAcceptOffer: (team: F4Team) => void;
  onRestartKarting: () => void;
  onEnterF4Season?: (team: F4Team) => void;
}

export const OffersStep: React.FC<OffersStepProps> = ({
  driverState,
  seriesTier,
  roundResults,
  totalPoints,
  kartingRating,
  offers,
  selectedTeam,
  onAcceptOffer,
  onRestartKarting,
  onEnterF4Season,
}) => {
  const [selectedOfferId, setSelectedOfferId] = useState<string>(
    selectedTeam ? selectedTeam.id : offers[0]?.id || ''
  );
  const [isContractConfirmed, setIsContractConfirmed] = useState<boolean>(!!selectedTeam);

  const seriesInfo = KARTING_SERIES_OPTIONS.find((s) => s.id === seriesTier)!;
  const maxTierAllowed = SERIES_MAX_TIER_CAPS[seriesTier];

  const winsCount = roundResults.filter((r) => r.finishingPosition === 1).length;
  const podiumsCount = roundResults.filter((r) => r.finishingPosition <= 3).length;

  const currentSelectedTeam = offers.find((o) => o.id === selectedOfferId) || offers[0];

  const handleSignContract = () => {
    if (!currentSelectedTeam) return;
    onAcceptOffer(currentSelectedTeam);
    setIsContractConfirmed(true);
  };

  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'Top':
        return {
          bgClass: 'bg-[#E10600]/15 border-[#E10600]',
          textClass: 'text-[#E10600]',
          label: 'TOP TIER TEAM',
        };
      case 'Midfield':
        return {
          bgClass: 'bg-[#0284C7]/15 border-[#0284C7]',
          textClass: 'text-[#38BDF8]',
          label: 'MIDFIELD CONTENDER',
        };
      case 'Backmarker':
      default:
        return {
          bgClass: 'bg-[#D97706]/15 border-[#D97706]',
          textClass: 'text-[#F59E0B]',
          label: 'BACKMARKER DEVELOPER',
        };
    }
  };

  return (
    <div id="karting-offers-step" className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#2E2E38] mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-telemetry uppercase tracking-widest text-[#E10600] font-bold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00D26A]" />
            Karting Phase • Step 3 of 3 • Season Complete
          </div>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-wide text-white uppercase font-racing">
            Championship Aggregation &amp; F4 Offers
          </h1>
          <p className="text-[#9A9AA5] text-xs sm:text-sm max-w-2xl mt-1 font-telemetry">
            Your 6-round karting season has concluded. Below is your final Karting Rating and resulting contract offers for the upcoming FIA Formula 4 season.
          </p>
        </div>

        {/* Restart / Re-simulate Option */}
        <button
          type="button"
          onClick={onRestartKarting}
          className="flex items-center gap-1.5 px-3 py-2 rounded-sm bg-[#24242E] hover:bg-[#2E2E38] border border-[#2E2E38] text-xs font-telemetry text-[#9A9AA5] hover:text-white transition-all cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay Karting</span>
        </button>
      </div>

      {/* Season Aggregation Metric Hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Rating Card */}
        <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-telemetry tracking-widest text-[#9A9AA5] font-bold">
                Official Karting Rating
              </span>
              <Gauge className="w-4 h-4 text-[#E10600]" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-white font-racing">{kartingRating}</span>
              <span className="text-sm font-telemetry text-[#9A9AA5]">/ 100 OVR</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#15151E] rounded-full overflow-hidden border border-[#2E2E38] mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#0284C7] via-[#00D26A] to-[#E10600] rounded-full transition-all duration-700"
                style={{ width: `${kartingRating}%` }}
              />
            </div>
          </div>
          <div className="text-[10px] font-telemetry text-[#9A9AA5] pt-2 border-t border-[#2E2E38]">
            Formula: <span className="text-white font-bold">min(100, round(({totalPoints} / {KARTING_RATING_MAX_POINTS}) × 100))</span>
          </div>
        </div>

        {/* Season Statistics */}
        <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-telemetry tracking-widest text-[#9A9AA5] font-bold">
                Season Tally
              </span>
              <Trophy className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-2 font-telemetry">
              <div className="p-2 rounded-sm bg-[#15151E] border border-[#2E2E38]">
                <span className="text-[9px] text-[#9A9AA5] uppercase block">Points</span>
                <span className="text-xl font-black text-[#00D26A] font-racing">{totalPoints}</span>
              </div>
              <div className="p-2 rounded-sm bg-[#15151E] border border-[#2E2E38]">
                <span className="text-[9px] text-[#9A9AA5] uppercase block">Podiums</span>
                <span className="text-xl font-black text-[#FFB800] font-racing">{podiumsCount}</span>
              </div>
              <div className="p-2 rounded-sm bg-[#15151E] border border-[#2E2E38]">
                <span className="text-[9px] text-[#9A9AA5] uppercase block">Wins</span>
                <span className="text-xl font-black text-white font-racing">{winsCount}</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] font-telemetry text-[#9A9AA5] pt-2 border-t border-[#2E2E38] mt-3">
            Theoretical maximum points ceiling: <b className="text-white">{KARTING_RATING_MAX_POINTS} pts</b>
          </div>
        </div>

        {/* Series Visibility Context */}
        <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-5 shadow-xl flex flex-col justify-between font-telemetry">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-[#9A9AA5] font-bold">
                Series Context
              </span>
              <Flag className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm font-black text-white uppercase font-racing mb-1">
              {seriesInfo.name}
            </div>
            <p className="text-xs text-[#9A9AA5] leading-relaxed mb-2">
              {seriesTier === 'local' &&
                'Grassroots visibility cap applied: Maximum unlocked tier is Midfield, regardless of points.'}
              {seriesTier === 'national' &&
                'National visibility unlocked: Midfield guaranteed, with an outside shot at Top Tier teams.'}
              {seriesTier === 'international' &&
                'Full uncapped international visibility: Top Tier teams actively scouted your results.'}
            </p>
          </div>
          <div className="text-[10px] pt-2 border-t border-[#2E2E38] text-[#9A9AA5]">
            Visibility Cap: <b className="text-white uppercase">{maxTierAllowed} Tier Max</b>
          </div>
        </div>
      </div>

      {/* 6-Round Timing Sheet Recap Table */}
      <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm shadow-xl overflow-hidden mb-8">
        <div className="p-3.5 border-b border-[#2E2E38] bg-[#15151E] flex items-center justify-between font-racing text-xs uppercase tracking-wider text-white">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D26A]"></span>
            Karting Season Results Recap (6 Rounds)
          </span>
          <span className="font-telemetry text-[11px] text-[#9A9AA5] font-normal">
            Total Points: {totalPoints}
          </span>
        </div>

        <div className="divide-y divide-[#2E2E38] font-telemetry">
          {roundResults.map((r) => {
            const isWinner = r.finishingPosition === 1;
            const isPodium = r.finishingPosition <= 3;
            const isPoints = r.finishingPosition <= 10;

            return (
              <div
                key={r.roundNumber}
                className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs hover:bg-[#20202B] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-9 h-7 rounded-sm border flex items-center justify-center font-racing font-bold text-xs ${
                      isWinner
                        ? 'bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/50'
                        : isPodium
                        ? 'bg-[#00D26A]/15 text-[#00D26A] border-[#00D26A]/50'
                        : isPoints
                        ? 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/40'
                        : 'bg-[#24242E] text-[#9A9AA5] border-[#2E2E38]'
                    }`}
                  >
                    P{r.finishingPosition}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#9A9AA5] uppercase font-bold">
                        R{r.roundNumber}
                      </span>
                      <span className="text-white font-medium">{r.circuitName}</span>
                      <span className="text-[#9A9AA5] text-[11px] hidden sm:inline">
                        ({r.circuitLocation})
                      </span>
                    </div>
                    {r.highlightLine ? (
                      <p className="text-[11px] italic text-[#C5C5D0] mt-0.5">
                        “{r.highlightLine}”
                      </p>
                    ) : (
                      <p className="text-[11px] text-[#9A9AA5] mt-0.5">{r.label}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <span className="font-bold text-white font-racing">
                    +{r.totalRoundPoints} <span className="text-[10px] text-[#9A9AA5]">PTS</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Temporary Diagnostic Panel: Detailed Round Calculation Breakdown */}
      <DebugRoundCalculationPanel
        seriesTier={seriesTier}
        coreStats={driverState.coreStats}
        roundResults={roundResults}
      />

      {/* Contract Offers Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="text-xs font-telemetry uppercase tracking-widest text-[#E10600] font-bold">
              Graduation Pathway
            </div>
            <h2 className="text-2xl font-black italic tracking-wide text-white uppercase font-racing">
              FIA Formula 4 Contract Offers ({offers.length} Received)
            </h2>
          </div>
          <span className="text-xs font-telemetry text-[#9A9AA5]">
            Based on your Rating of {kartingRating} and {seriesInfo.name} scouts
          </span>
        </div>

        {/* Offer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="radiogroup" aria-label="F4 Contract Offers">
          {offers.map((offer) => {
            const isSelected = selectedOfferId === offer.id;
            const tierStyle = getTierBadgeStyle(offer.tier);

            return (
              <div
                key={offer.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => setSelectedOfferId(offer.id)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setSelectedOfferId(offer.id);
                  }
                }}
                className={`rounded-sm border p-5 flex flex-col justify-between transition-all cursor-pointer relative shadow-lg ${
                  isSelected
                    ? 'bg-[#24242E] border-2 border-[#E10600] ring-1 ring-[#E10600]/30'
                    : 'bg-[#1C1C25] border-[#2E2E38] hover:border-[#9A9AA5]/50 hover:bg-[#20202B]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-telemetry uppercase tracking-wider font-bold bg-[#E10600] text-white px-2 py-0.5 rounded-sm">
                    <CheckCircle2 className="w-3 h-3" /> Selected
                  </div>
                )}

                <div>
                  {/* Tier Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[10px] font-telemetry font-bold uppercase tracking-wider mb-2.5 ${tierStyle.bgClass} ${tierStyle.textClass}`}
                  >
                    <Award className="w-3 h-3" />
                    <span>{tierStyle.label}</span>
                  </div>

                  {/* Team Name */}
                  <h3 className="text-lg font-black uppercase text-white font-racing tracking-wide mb-3">
                    {offer.name}
                  </h3>

                  {/* Car Strength Rating */}
                  <div className="mb-4 bg-[#15151E] border border-[#2E2E38] p-3 rounded-sm font-telemetry">
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-[#9A9AA5] uppercase text-[10px] font-bold">
                        Car Strength Rating
                      </span>
                      <span className="font-bold text-white font-racing text-sm">
                        {offer.strengthRating} <span className="text-[#9A9AA5] text-xs">/ 100</span>
                      </span>
                    </div>
                    {/* Visual Strength Meter */}
                    <div className="w-full h-1.5 bg-[#24242E] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#E10600] rounded-full"
                        style={{ width: `${offer.strengthRating}%` }}
                      />
                    </div>
                  </div>

                  {/* Team Specs */}
                  <div className="space-y-1.5 font-telemetry text-xs text-[#9A9AA5] mb-5">
                    {offer.headquarters && (
                      <div className="flex justify-between">
                        <span>Base:</span>
                        <span className="text-white font-medium">{offer.headquarters}</span>
                      </div>
                    )}
                    {offer.chassis && (
                      <div className="flex justify-between">
                        <span>Chassis:</span>
                        <span className="text-white font-medium">{offer.chassis}</span>
                      </div>
                    )}
                    {offer.engineSupplier && (
                      <div className="flex justify-between">
                        <span>Engine:</span>
                        <span className="text-white font-medium">{offer.engineSupplier}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Offer Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOfferId(offer.id);
                  }}
                  className={`w-full py-2.5 px-3 rounded-sm font-racing text-xs uppercase tracking-wider font-bold transition-all ${
                    isSelected
                      ? 'bg-[#E10600] text-white shadow-md'
                      : 'bg-[#24242E] text-[#9A9AA5] border border-[#2E2E38] hover:text-white hover:border-[#9A9AA5]'
                  }`}
                >
                  {isSelected ? '✓ Offer Chosen' : 'Select Offer'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation & Primary Action Banner */}
      {!isContractConfirmed ? (
        <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-sm bg-[#24242E] border border-[#2E2E38] flex items-center justify-center text-[#00D26A] shrink-0 mt-0.5">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-telemetry uppercase tracking-widest text-[#9A9AA5] font-bold">
                Contract Acceptance
              </div>
              <div className="text-base font-bold text-white font-racing uppercase tracking-wide">
                Sign with: {currentSelectedTeam?.name} ({currentSelectedTeam?.tier} Tier)
              </div>
              <div className="text-xs text-[#9A9AA5] mt-0.5 font-telemetry">
                Car Strength {currentSelectedTeam?.strengthRating}/100 • Official FIA Formula 4 Driver Agreement
              </div>
            </div>
          </div>

          <button
            type="button"
            id="accept-contract-btn"
            onClick={handleSignContract}
            className="w-full sm:w-auto px-8 py-3.5 rounded-sm font-racing text-base sm:text-lg font-black uppercase tracking-wider text-white bg-[#E10600] hover:bg-[#b80500] shadow-lg shadow-black/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] shrink-0"
          >
            <FileSignature className="w-4 h-4" />
            <span>Sign F4 Contract</span>
          </button>
        </div>
      ) : (
        /* Celebratory Signed Confirmation Box */
        <div
          id="contract-signed-confirmation"
          className="bg-[#1C1C25] border-2 border-[#00D26A] rounded-sm p-6 shadow-2xl animate-fade-in"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-sm bg-[#00D26A]/20 border border-[#00D26A] flex items-center justify-center text-[#00D26A] shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-telemetry uppercase tracking-widest text-[#00D26A] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Official Contract Executed
                </div>
                <h3 className="text-2xl font-black italic tracking-wide text-white uppercase font-racing">
                  Welcome to {selectedTeam?.name}!
                </h3>
                <p className="text-xs sm:text-sm text-[#9A9AA5] font-telemetry mt-1">
                  Driver <b className="text-white">#{driverState.number} {driverState.lastName}</b> is officially registered on the FIA Formula 4 grid with <b className="text-white">{selectedTeam?.name}</b> ({selectedTeam?.tier} Tier, Strength {selectedTeam?.strengthRating}/100).
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <button
                type="button"
                id="restart-karting-btn"
                onClick={onRestartKarting}
                className="w-full sm:w-auto px-5 py-3 rounded-sm font-racing text-xs uppercase tracking-wider text-[#9A9AA5] hover:text-white bg-[#24242E] hover:bg-[#2E2E38] border border-[#2E2E38] transition-all cursor-pointer"
              >
                Re-simulate Karting
              </button>
              <button
                type="button"
                id="enter-f4-season-btn"
                onClick={() => {
                  const finalTeam = selectedTeam || currentSelectedTeam;
                  if (onEnterF4Season && finalTeam) {
                    onEnterF4Season(finalTeam);
                  }
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-sm font-racing text-sm sm:text-base font-black uppercase tracking-wider text-white bg-[#E10600] hover:bg-[#b80500] shadow-xl shadow-black/50 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
              >
                <span>Enter F4 Championship Season</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
