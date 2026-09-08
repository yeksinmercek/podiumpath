import React, { useState } from 'react';
import { ArrowLeft, Play, Trophy, Zap, Target, Shield, CheckCircle2, RotateCcw, X } from 'lucide-react';
import { DriverState, BackgroundQuestion } from '../types';
import { calculateDriverStats, BASE_STATS } from '../data/questions';
import { getStatSemanticStyle } from '../utils/statColors';

interface SummaryStageProps {
  driverState: DriverState;
  questions: BackgroundQuestion[];
  onBackToBackground: () => void;
  onEditIdentity: () => void;
  onReset: () => void;
  onStartCareer?: () => void;
}

export const SummaryStage: React.FC<SummaryStageProps> = ({
  driverState,
  questions,
  onBackToBackground,
  onEditIdentity,
  onReset,
  onStartCareer,
}) => {
  const [showCareerModal, setShowCareerModal] = useState(false);

  const { stats, deltas } = calculateDriverStats(driverState.backgroundAnswers);

  const paceStyle = getStatSemanticStyle(stats.pace);
  const racecraftStyle = getStatSemanticStyle(stats.racecraft);
  const consistencyStyle = getStatSemanticStyle(stats.consistency);

  const handleStartCareer = () => {
    console.log('[Podium Path] Starting Career with Driver State:', {
      ...driverState,
      coreStats: stats,
    });
    if (onStartCareer) {
      onStartCareer();
      return;
    }
    setShowCareerModal(true);
  };

  return (
    <div id="summary-stage-container" className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#24242E] border border-[#2E2E38] text-[#E10600] text-xs font-telemetry uppercase tracking-widest font-bold mb-2">
            Driver Creation Dossier • FIA Superlicence
          </div>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-wide text-white uppercase font-racing leading-tight">
            Official Driver Dossier
          </h1>
          <p className="text-[#9A9AA5] text-xs sm:text-sm max-w-2xl mt-1">
            Review your driver registry and attributes derived from your karting pedigree before entering the paddock.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            id="summary-edit-identity-btn"
            onClick={onEditIdentity}
            className="px-3 py-2 rounded-sm border border-[#2E2E38] bg-[#24242E] hover:bg-[#2E2E38] text-[#9A9AA5] hover:text-white text-xs font-telemetry uppercase tracking-wider transition-all"
          >
            Edit Identity
          </button>
          <button
            type="button"
            id="summary-reset-all-btn"
            onClick={onReset}
            className="px-3 py-2 rounded-sm border border-[#2E2E38] bg-[#24242E] hover:bg-[#E10600]/20 hover:border-[#E10600]/40 text-[#9A9AA5] hover:text-[#E10600] text-xs font-telemetry uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Driver Superlicence ID Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-5 sm:p-6 shadow-xl shadow-black/40 relative overflow-hidden">
            {/* Watermark accent */}
            <div className="absolute -top-6 -right-6 select-none pointer-events-none opacity-[0.03] text-white font-black text-9xl font-racing italic">
              FIA
            </div>

            {/* Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2E2E38] mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-sm bg-[#E10600] flex items-center justify-center text-white font-racing font-bold text-sm">
                  P
                </div>
                <div>
                  <div className="text-xs font-black tracking-widest text-white uppercase font-racing">
                    PODIUM PATH
                  </div>
                  <div className="text-[9px] text-[#9A9AA5] uppercase tracking-widest font-telemetry">
                    FIA Superlicence Protocol
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-sm bg-[#24242E] border border-[#00D26A]/40 text-[#00D26A] text-[10px] font-bold font-telemetry uppercase tracking-wider">
                VALIDATED
              </span>
            </div>

            {/* Driver Number & Name Badge */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-sm bg-[#24242E] border-2 border-[#E10600] flex flex-col items-center justify-center shrink-0 shadow-inner">
                <span className="text-[9px] font-bold text-[#9A9AA5] font-telemetry leading-none">NO.</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-racing leading-none">
                  {driverState.number}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-[#9A9AA5] uppercase tracking-widest font-telemetry">
                  Driver Name
                </span>
                <h2 className="text-2xl font-black text-white uppercase italic font-racing tracking-wide truncate">
                  {driverState.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl">{driverState.nationality?.flagEmoji}</span>
                  <div className="min-w-0 flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">
                      {driverState.nationality?.name}
                    </span>
                    <span className="text-[10px] text-[#9A9AA5] font-telemetry">
                      [{driverState.nationality?.code}]
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Paddock Metadata Specs */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-sm bg-[#15151E] border border-[#2E2E38] text-xs font-telemetry mb-5">
              <div>
                <span className="text-[#9A9AA5] block text-[10px] uppercase">Class</span>
                <span className="font-bold text-white">Open-Wheel Rookie</span>
              </div>
              <div>
                <span className="text-[#9A9AA5] block text-[10px] uppercase">Pedigree</span>
                <span className="font-bold text-white">5 Decisions Recorded</span>
              </div>
              <div>
                <span className="text-[#9A9AA5] block text-[10px] uppercase">Base Rating</span>
                <span className="font-bold text-white">40 OVR Standard</span>
              </div>
              <div>
                <span className="text-[#9A9AA5] block text-[10px] uppercase">Career Status</span>
                <span className="font-bold text-[#E10600]">Paddock Ready</span>
              </div>
            </div>

            {/* Back to Background Option (Revisit answers) */}
            <button
              type="button"
              id="summary-back-to-background-btn"
              onClick={onBackToBackground}
              className="w-full py-2.5 rounded-sm border border-[#2E2E38] bg-[#24242E] hover:bg-[#2E2E38] text-white font-racing uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E10600]" />
              <span>Back to Background Questions</span>
            </button>
          </div>
        </div>

        {/* Right Column: Core Stats (Numeric + Horizontal Bars) & Start Career Action */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Core Stats Panel */}
          <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-5 sm:p-6 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E2E38] mb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white font-racing flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#E10600]" />
                  Core Attribute Ratings
                </h3>
                <p className="text-xs text-[#9A9AA5] font-telemetry">
                  Base 40 + career deltas (0 to 100 scale)
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#9A9AA5] uppercase tracking-widest font-telemetry block">
                  Cumulative Delta
                </span>
                <span className="text-xs font-bold font-telemetry text-[#00D26A]">
                  +{deltas.pace + deltas.racecraft + deltas.consistency} Total
                </span>
              </div>
            </div>

            {/* 3 Core Stats with Numeric Values, Semantic Color & Horizontal Bars */}
            <div className="space-y-4 mb-6">
              {/* PACE */}
              <div id="summary-stat-pace" className="p-3.5 rounded-sm bg-[#15151E] border border-[#2E2E38]">
                <div className="flex items-center justify-between mb-1.5 font-telemetry">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-sm bg-[#24242E] border border-[#2E2E38] flex items-center justify-center text-[#9A9AA5]">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white uppercase tracking-wide">Pace</span>
                      <span className="block text-[10px] text-[#9A9AA5]">
                        Raw qualifying speed and apex velocity
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className={`text-xl font-black font-racing ${paceStyle.textColorClass}`}>
                        {stats.pace}
                      </span>
                      <span className="text-[10px] text-[#9A9AA5] font-telemetry">/100</span>
                    </div>
                    <span className="text-[10px] font-telemetry text-[#9A9AA5]">
                      Base {BASE_STATS.pace} {deltas.pace >= 0 ? `+${deltas.pace}` : deltas.pace}
                    </span>
                  </div>
                </div>

                {/* Sleek Horizontal Progress Bar with Dynamic Semantic Color */}
                <div className="w-full h-2 bg-[#24242E] rounded-sm overflow-hidden border border-[#2E2E38]">
                  <div
                    className="h-full transition-all duration-500 rounded-sm"
                    style={{
                      width: `${Math.min(100, stats.pace)}%`,
                      backgroundColor: paceStyle.colorHex,
                    }}
                  />
                </div>
              </div>

              {/* RACECRAFT */}
              <div id="summary-stat-racecraft" className="p-3.5 rounded-sm bg-[#15151E] border border-[#2E2E38]">
                <div className="flex items-center justify-between mb-1.5 font-telemetry">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-sm bg-[#24242E] border border-[#2E2E38] flex items-center justify-center text-[#9A9AA5]">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white uppercase tracking-wide">Racecraft</span>
                      <span className="block text-[10px] text-[#9A9AA5]">
                        Overtaking instincts, defense, and wheel-to-wheel dueling
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className={`text-xl font-black font-racing ${racecraftStyle.textColorClass}`}>
                        {stats.racecraft}
                      </span>
                      <span className="text-[10px] text-[#9A9AA5] font-telemetry">/100</span>
                    </div>
                    <span className="text-[10px] font-telemetry text-[#9A9AA5]">
                      Base {BASE_STATS.racecraft} {deltas.racecraft >= 0 ? `+${deltas.racecraft}` : deltas.racecraft}
                    </span>
                  </div>
                </div>

                {/* Sleek Horizontal Progress Bar with Dynamic Semantic Color */}
                <div className="w-full h-2 bg-[#24242E] rounded-sm overflow-hidden border border-[#2E2E38]">
                  <div
                    className="h-full transition-all duration-500 rounded-sm"
                    style={{
                      width: `${Math.min(100, stats.racecraft)}%`,
                      backgroundColor: racecraftStyle.colorHex,
                    }}
                  />
                </div>
              </div>

              {/* CONSISTENCY */}
              <div id="summary-stat-consistency" className="p-3.5 rounded-sm bg-[#15151E] border border-[#2E2E38]">
                <div className="flex items-center justify-between mb-1.5 font-telemetry">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-sm bg-[#24242E] border border-[#2E2E38] flex items-center justify-center text-[#9A9AA5]">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white uppercase tracking-wide">Consistency</span>
                      <span className="block text-[10px] text-[#9A9AA5]">
                        Lap-time repeatability, error avoidance, and tyre management
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className={`text-xl font-black font-racing ${consistencyStyle.textColorClass}`}>
                        {stats.consistency}
                      </span>
                      <span className="text-[10px] text-[#9A9AA5] font-telemetry">/100</span>
                    </div>
                    <span className="text-[10px] font-telemetry text-[#9A9AA5]">
                      Base {BASE_STATS.consistency} {deltas.consistency >= 0 ? `+${deltas.consistency}` : deltas.consistency}
                    </span>
                  </div>
                </div>

                {/* Sleek Horizontal Progress Bar with Dynamic Semantic Color */}
                <div className="w-full h-2 bg-[#24242E] rounded-sm overflow-hidden border border-[#2E2E38]">
                  <div
                    className="h-full transition-all duration-500 rounded-sm"
                    style={{
                      width: `${Math.min(100, stats.consistency)}%`,
                      backgroundColor: consistencyStyle.colorHex,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Choice Recap: Compact chronological list of 5 decisions */}
            <div className="mb-6 p-3.5 rounded-sm bg-[#15151E] border border-[#2E2E38]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9A9AA5] font-telemetry mb-2.5">
                Career Decisions Log
              </h4>
              <div className="space-y-2">
                {questions.map((q, idx) => {
                  const ansId = driverState.backgroundAnswers[idx];
                  const choice = q.choices.find((c) => c.id === ansId);
                  return (
                    <div key={q.id} className="text-xs flex items-start gap-2.5 pb-2 border-b border-[#2E2E38]/60 last:border-b-0 last:pb-0">
                      <span className="w-4 h-4 rounded-sm bg-[#24242E] border border-[#2E2E38] text-[#9A9AA5] font-bold flex items-center justify-center shrink-0 font-telemetry text-[10px]">
                        {q.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[#9A9AA5] block text-[10px] truncate">{q.question}</span>
                        <span className="text-white font-medium text-xs">
                          {choice ? `${choice.label}: ${choice.text}` : 'Pending'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary Action: Start Career Button */}
            <div>
              <button
                type="button"
                id="start-career-btn"
                onClick={handleStartCareer}
                className="w-full py-3.5 px-6 rounded-sm font-racing text-xl font-black uppercase tracking-wider text-white bg-[#E10600] hover:bg-[#b80500] shadow-lg shadow-black/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Start Career</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Start Career Placeholder Confirmation Modal */}
      {showCareerModal && (
        <div
          id="career-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowCareerModal(false)}
        >
          <div
            id="career-modal"
            className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm max-w-md w-full p-6 shadow-2xl shadow-black/60 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              id="close-career-modal-btn"
              onClick={() => setShowCareerModal(false)}
              className="absolute top-4 right-4 text-[#9A9AA5] hover:text-white p-1 rounded-sm"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-sm bg-[#E10600]/15 border border-[#E10600]/40 flex items-center justify-center text-[#E10600] mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <span className="text-[10px] uppercase font-telemetry tracking-widest text-[#E10600] font-bold">
              FIA Registration Complete
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white font-racing mt-1 mb-2">
              Career Ready: #{driverState.number} {driverState.lastName}
            </h3>

            <p className="text-xs text-[#9A9AA5] mb-4 leading-relaxed">
              Driver #{driverState.number} representing {driverState.nationality?.name} {driverState.nationality?.flagEmoji} is officially licensed with starting ratings:
            </p>

            <div className="grid grid-cols-3 gap-2 p-3 bg-[#15151E] rounded-sm border border-[#2E2E38] text-center font-telemetry mb-5">
              <div>
                <span className="text-[9px] text-[#9A9AA5] uppercase block">Pace</span>
                <span className={`text-base font-bold ${paceStyle.textColorClass}`}>{stats.pace}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#9A9AA5] uppercase block">Racecraft</span>
                <span className={`text-base font-bold ${racecraftStyle.textColorClass}`}>{stats.racecraft}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#9A9AA5] uppercase block">Consistency</span>
                <span className={`text-base font-bold ${consistencyStyle.textColorClass}`}>{stats.consistency}</span>
              </div>
            </div>

            <div className="p-2.5 bg-[#24242E] rounded-sm border border-[#2E2E38] text-xs text-[#00D26A] mb-5">
              ✓ Character creation flow complete. Ready for paddock simulation modules.
            </div>

            <button
              type="button"
              id="confirm-modal-ok-btn"
              onClick={() => setShowCareerModal(false)}
              className="w-full py-2.5 rounded-sm font-racing text-base font-bold uppercase tracking-wider text-white bg-[#E10600] hover:bg-[#b80500] transition-colors cursor-pointer"
            >
              Close & Review Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
