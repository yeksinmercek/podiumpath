import React from 'react';
import { Flag, Trophy, UserCheck, ShieldCheck, Check } from 'lucide-react';
import { CreationStage, DriverState } from '../types';

interface HeaderProps {
  currentStage: CreationStage;
  currentQuestionIndex: number;
  totalQuestions: number;
  driverState: DriverState;
}

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  currentQuestionIndex,
  totalQuestions,
  driverState,
}) => {
  const isIdentityActive = currentStage === 'identity';
  const isIdentityDone =
    currentStage === 'background' ||
    currentStage === 'summary' ||
    currentStage === 'karting' ||
    currentStage === 'f4';

  const isBackgroundActive = currentStage === 'background';
  const isBackgroundDone =
    currentStage === 'summary' ||
    currentStage === 'karting' ||
    currentStage === 'f4';

  const isSummaryActive = currentStage === 'summary';
  const isSummaryDone = currentStage === 'karting' || currentStage === 'f4';

  const isKartingActive = currentStage === 'karting';
  const isKartingDone = currentStage === 'f4';

  const isF4Active = currentStage === 'f4';

  const overallRating = Math.round(
    (driverState.coreStats.pace + driverState.coreStats.racecraft + driverState.coreStats.consistency) / 3
  );
  const displayName = driverState.lastName.trim() ? driverState.lastName.trim() : 'ROOKIE';

  return (
    <header id="app-header" className="w-full border-b border-[#2E2E38] bg-[#1C1C25]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#E10600] flex items-center justify-center shadow-md shadow-black/40 border border-[#E10600]">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black italic tracking-wider text-white font-racing uppercase leading-none">
                PODIUM <span className="text-[#E10600]">PATH</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-widest bg-[#24242E] border border-[#2E2E38] text-[#9A9AA5] rounded-sm font-telemetry">
                FIA Career
              </span>
            </div>
            <p className="text-[11px] text-[#9A9AA5] tracking-wide hidden sm:block">
              Open-Wheel Driver Career Simulator
            </p>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-telemetry">
          {/* Stage 1: Identity */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm border transition-all ${
              isIdentityActive
                ? 'bg-[#24242E] border-[#E10600] text-white shadow-sm'
                : isIdentityDone
                ? 'bg-[#1C1C25] border-[#2E2E38] text-white'
                : 'bg-[#1C1C25] border-[#2E2E38] text-[#9A9AA5]'
            }`}
          >
            {isIdentityDone ? (
              <Check className="w-3.5 h-3.5 text-[#00D26A]" />
            ) : (
              <UserCheck className={`w-3.5 h-3.5 ${isIdentityActive ? 'text-[#E10600]' : 'text-[#9A9AA5]'}`} />
            )}
            <span className="hidden sm:inline">1.</span>
            <span className="font-semibold uppercase tracking-wider">Identity</span>
            {isIdentityDone && (
              <span className="text-[10px] text-[#00D26A] font-bold">✓</span>
            )}
          </div>

          <div className="w-2 h-px bg-[#2E2E38]"></div>

          {/* Stage 2: Background */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm border transition-all ${
              isBackgroundActive
                ? 'bg-[#24242E] border-[#E10600] text-white shadow-sm'
                : isBackgroundDone
                ? 'bg-[#1C1C25] border-[#2E2E38] text-white'
                : 'bg-[#1C1C25] border-[#2E2E38] text-[#9A9AA5]'
            }`}
          >
            {isBackgroundDone ? (
              <Check className="w-3.5 h-3.5 text-[#00D26A]" />
            ) : (
              <Flag className={`w-3.5 h-3.5 ${isBackgroundActive ? 'text-[#E10600]' : 'text-[#9A9AA5]'}`} />
            )}
            <span className="hidden sm:inline">2.</span>
            <span className="font-semibold uppercase tracking-wider">
              Background
              {isBackgroundActive && (
                <span className="ml-1 text-[#E10600] font-bold">
                  ({currentQuestionIndex + 1}/{totalQuestions})
                </span>
              )}
            </span>
          </div>

          <div className="w-2 h-px bg-[#2E2E38]"></div>

          {/* Stage 3: Summary */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm border transition-all ${
              isSummaryActive
                ? 'bg-[#24242E] border-[#E10600] text-white shadow-sm'
                : isSummaryDone
                ? 'bg-[#1C1C25] border-[#2E2E38] text-white'
                : 'bg-[#1C1C25] border-[#2E2E38] text-[#9A9AA5]'
            }`}
          >
            {isSummaryDone ? (
              <Check className="w-3.5 h-3.5 text-[#00D26A]" />
            ) : (
              <ShieldCheck className={`w-3.5 h-3.5 ${isSummaryActive ? 'text-[#E10600]' : 'text-[#9A9AA5]'}`} />
            )}
            <span className="hidden sm:inline">3.</span>
            <span className="font-semibold uppercase tracking-wider">Summary</span>
          </div>

          <div className="w-2 h-px bg-[#2E2E38]"></div>

          {/* Stage 4: Karting */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm border transition-all ${
              isKartingActive
                ? 'bg-[#24242E] border-[#E10600] text-white shadow-sm'
                : isKartingDone
                ? 'bg-[#1C1C25] border-[#2E2E38] text-white'
                : 'bg-[#1C1C25] border-[#2E2E38] text-[#9A9AA5]'
            }`}
          >
            {isKartingDone ? (
              <Check className="w-3.5 h-3.5 text-[#00D26A]" />
            ) : (
              <Trophy className={`w-3.5 h-3.5 ${isKartingActive ? 'text-[#E10600]' : 'text-[#9A9AA5]'}`} />
            )}
            <span className="hidden sm:inline">4.</span>
            <span className="font-semibold uppercase tracking-wider">Karting</span>
            {isKartingActive && driverState.kartingSeason?.roundResults?.length !== undefined && (
              <span className="text-[10px] text-[#E10600] font-bold">
                ({driverState.kartingSeason.roundResults.length}/6)
              </span>
            )}
            {isKartingDone && <span className="text-[10px] text-[#00D26A] font-bold">✓</span>}
          </div>

          <div className="w-2 h-px bg-[#2E2E38]"></div>

          {/* Stage 5: F4 Championship */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm border transition-all ${
              isF4Active
                ? 'bg-[#24242E] border-[#E10600] text-white shadow-sm'
                : 'bg-[#1C1C25] border-[#2E2E38] text-[#9A9AA5]'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isF4Active ? 'text-[#E10600]' : 'text-[#9A9AA5]'}`} />
            <span className="hidden sm:inline">5.</span>
            <span className="font-semibold uppercase tracking-wider">F4</span>
            {isF4Active && driverState.f4Season?.raceResults?.length !== undefined && (
              <span className="text-[10px] text-[#E10600] font-bold">
                ({driverState.f4Season.raceResults.length}/6)
              </span>
            )}
          </div>
        </div>

        {/* Header Driver ID Badge: Number, Last Name, Flag/Code, and Overall Rating */}
        <div
          id="header-driver-badge"
          className="flex items-center gap-2 sm:gap-2.5 bg-[#24242E] border border-[#2E2E38] px-2.5 py-1.5 rounded-sm text-xs font-telemetry shadow-sm"
        >
          {/* Driver Number */}
          <span className="w-6 h-6 rounded-sm bg-[#E10600]/15 border border-[#E10600]/40 text-[#E10600] font-black flex items-center justify-center font-racing text-xs shrink-0">
            #{driverState.number || 10}
          </span>

          {/* Last Name */}
          <span className="font-bold text-white uppercase tracking-wider text-xs truncate max-w-[85px] sm:max-w-[120px]">
            {displayName}
          </span>

          {/* Nationality Flag / Code */}
          <div className="flex items-center gap-1 shrink-0">
            {driverState.nationality ? (
              <>
                <span className="text-sm leading-none" title={driverState.nationality.name}>
                  {driverState.nationality.flagEmoji}
                </span>
                <span className="text-[10px] font-bold text-[#C5C5D0] uppercase tracking-wider bg-[#1C1C25] border border-[#2E2E38] px-1 py-0.2 rounded-sm">
                  {driverState.nationality.code}
                </span>
              </>
            ) : (
              <span className="text-[10px] text-[#9A9AA5]/60 uppercase tracking-wider font-mono">
                [--]
              </span>
            )}
          </div>

          <div className="w-px h-3.5 bg-[#2E2E38] shrink-0" />

          {/* Overall Rating */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[9px] uppercase tracking-widest text-[#9A9AA5] font-bold">
              OVR
            </span>
            <span className="font-racing font-black text-xs text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.2 rounded-sm">
              {overallRating}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
