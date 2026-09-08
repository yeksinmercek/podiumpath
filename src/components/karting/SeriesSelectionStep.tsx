import React, { useState } from 'react';
import { Flag, ShieldAlert, Award, ArrowRight, Eye, Gauge, Check } from 'lucide-react';
import { DriverState, KartingSeriesTier } from '../../types';
import { KARTING_SERIES_OPTIONS } from '../../data/kartingData';
import { getStatSemanticStyle } from '../../utils/statColors';

interface SeriesSelectionStepProps {
  driverState: DriverState;
  onSelectSeries: (series: KartingSeriesTier) => void;
}

export const SeriesSelectionStep: React.FC<SeriesSelectionStepProps> = ({
  driverState,
  onSelectSeries,
}) => {
  const [selectedSeries, setSelectedSeries] = useState<KartingSeriesTier>('national');

  const paceStyle = getStatSemanticStyle(driverState.coreStats.pace);
  const racecraftStyle = getStatSemanticStyle(driverState.coreStats.racecraft);
  const consistencyStyle = getStatSemanticStyle(driverState.coreStats.consistency);

  const currentOption = KARTING_SERIES_OPTIONS.find((s) => s.id === selectedSeries)!;

  return (
    <div id="karting-series-selection" className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#2E2E38] mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-telemetry uppercase tracking-widest text-[#E10600] font-bold mb-1">
            <Flag className="w-3.5 h-3.5" />
            Karting Phase • Step 1 of 3
          </div>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-wide text-white uppercase font-racing">
            Championship Series Selection
          </h1>
          <p className="text-[#9A9AA5] text-xs sm:text-sm max-w-2xl mt-1 font-telemetry">
            Choose your single-season karting championship. Tougher series pit you against faster AI fields, but scouts will only offer Top Tier F4 seats if you prove yourself on prestigious stages.
          </p>
        </div>

        {/* Driver Dossier Quick Readout */}
        <div className="flex items-center gap-3 bg-[#1C1C25] border border-[#2E2E38] px-4 py-2.5 rounded-sm shadow-xl shrink-0">
          <div className="w-10 h-10 rounded-sm bg-[#24242E] border-2 border-[#E10600] flex flex-col items-center justify-center font-racing">
            <span className="text-[7px] text-[#9A9AA5] font-telemetry">NO.</span>
            <span className="text-lg font-black text-white leading-none">{driverState.number}</span>
          </div>
          <div className="text-left font-telemetry">
            <div className="text-[9px] text-[#9A9AA5] uppercase tracking-widest">Entry Candidate</div>
            <div className="text-sm font-black text-white uppercase font-racing truncate max-w-[140px]">
              {driverState.lastName}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#9A9AA5] mt-0.5">
              <span>PAC <b className={paceStyle.textColorClass}>{driverState.coreStats.pace}</b></span>
              <span>RAC <b className={racecraftStyle.textColorClass}>{driverState.coreStats.racecraft}</b></span>
              <span>CON <b className={consistencyStyle.textColorClass}>{driverState.coreStats.consistency}</b></span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Series Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8" role="radiogroup" aria-label="Karting Series Options">
        {KARTING_SERIES_OPTIONS.map((option) => {
          const isSelected = selectedSeries === option.id;

          return (
            <div
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => setSelectedSeries(option.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setSelectedSeries(option.id);
                }
              }}
              className={`rounded-sm border p-5 flex flex-col justify-between transition-all cursor-pointer relative shadow-lg ${
                isSelected
                  ? 'bg-[#24242E] border-2 border-[#E10600] ring-1 ring-[#E10600]/30'
                  : 'bg-[#1C1C25] border-[#2E2E38] hover:border-[#9A9AA5]/50 hover:bg-[#20202B]'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-telemetry uppercase tracking-wider font-bold bg-[#E10600] text-white px-2 py-0.5 rounded-sm">
                  <Check className="w-3 h-3" /> Selected
                </div>
              )}

              <div>
                {/* Category Pill */}
                <div className="flex items-center gap-2 mb-2 font-telemetry text-xs">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: option.badgeColor }}
                  />
                  <span className="text-[#9A9AA5] uppercase tracking-wider text-[10px] font-bold">
                    {option.subtitle}
                  </span>
                </div>

                {/* Series Title */}
                <h3 className="text-xl font-black uppercase text-white font-racing tracking-wide mb-3">
                  {option.name}
                </h3>

                {/* Plain-Language Tradeoff Description */}
                <p className="text-xs text-[#9A9AA5] leading-relaxed mb-5 min-h-[72px]">
                  {option.description}
                </p>

                {/* Mechanics Specs Grid */}
                <div className="space-y-2.5 pt-3 border-t border-[#2E2E38] font-telemetry text-xs mb-5">
                  {/* AI Difficulty */}
                  <div className="flex items-center justify-between p-2 rounded-sm bg-[#15151E] border border-[#2E2E38]">
                    <span className="flex items-center gap-1.5 text-[#9A9AA5]">
                      <Gauge className="w-3.5 h-3.5 text-[#9A9AA5]" />
                      Grid Strength:
                    </span>
                    <span className="font-bold text-white uppercase text-[11px]">
                      {option.opponentStrengthLabel}
                    </span>
                  </div>

                  {/* Scout Visibility */}
                  <div className="flex items-center justify-between p-2 rounded-sm bg-[#15151E] border border-[#2E2E38]">
                    <span className="flex items-center gap-1.5 text-[#9A9AA5]">
                      <Eye className="w-3.5 h-3.5 text-[#9A9AA5]" />
                      Scout Visibility:
                    </span>
                    <span
                      className={`font-bold uppercase text-[11px] ${
                        option.id === 'international'
                          ? 'text-[#00D26A]'
                          : option.id === 'national'
                          ? 'text-[#38BDF8]'
                          : 'text-[#E10600]'
                      }`}
                    >
                      {option.visibilityLabel}
                    </span>
                  </div>

                  {/* Max Offer Tier */}
                  <div className="flex items-center justify-between p-2 rounded-sm bg-[#15151E] border border-[#2E2E38]">
                    <span className="flex items-center gap-1.5 text-[#9A9AA5]">
                      <Award className="w-3.5 h-3.5 text-[#9A9AA5]" />
                      F4 Offer Ceiling:
                    </span>
                    <span
                      className={`font-bold uppercase text-[11px] ${
                        option.id === 'local' ? 'text-[#E10600]' : 'text-white'
                      }`}
                    >
                      {option.maxOfferTierText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Radio Selector State Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSeries(option.id);
                }}
                className={`w-full py-2.5 px-3 rounded-sm font-racing text-xs uppercase tracking-wider font-bold transition-all ${
                  isSelected
                    ? 'bg-[#E10600] text-white shadow-md'
                    : 'bg-[#24242E] text-[#9A9AA5] border border-[#2E2E38] hover:text-white hover:border-[#9A9AA5]'
                }`}
              >
                {isSelected ? '✓ Series Chosen' : 'Select Series'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation & Primary Action Banner */}
      <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-sm bg-[#24242E] border border-[#2E2E38] flex items-center justify-center text-[#E10600] shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-telemetry uppercase tracking-widest text-[#9A9AA5] font-bold">
              Confirmation Checklist
            </div>
            <div className="text-base font-bold text-white font-racing uppercase tracking-wide">
              Entering: {currentOption.name}
            </div>
            <div className="text-xs text-[#9A9AA5] mt-0.5 font-telemetry">
              6 rounds • 20-car grid • P1 through P20 finish rankings determine your season rating.
            </div>
          </div>
        </div>

        <button
          type="button"
          id="confirm-series-btn"
          onClick={() => onSelectSeries(selectedSeries)}
          className="w-full sm:w-auto px-8 py-3.5 rounded-sm font-racing text-base sm:text-lg font-black uppercase tracking-wider text-white bg-[#E10600] hover:bg-[#b80500] shadow-lg shadow-black/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] shrink-0"
        >
          <span>Begin Season Simulation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
