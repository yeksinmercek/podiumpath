import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Zap, Shield, Target, Flag, Check, User } from 'lucide-react';
import { BackgroundQuestion, DriverState } from '../types';
import { calculateDriverStats, BASE_STATS } from '../data/questions';
import { getStatSemanticStyle, formatStatDelta } from '../utils/statColors';

interface BackgroundStageProps {
  questions: BackgroundQuestion[];
  currentQuestionIndex: number;
  driverState: DriverState;
  onSelectAnswer: (questionIndex: number, answerId: string) => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
}

export const BackgroundStage: React.FC<BackgroundStageProps> = ({
  questions,
  currentQuestionIndex,
  driverState,
  onSelectAnswer,
  onPrevQuestion,
  onNextQuestion,
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswerId = driverState.backgroundAnswers[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Calculate live cumulative stats including choices so far
  const { stats: liveStats, deltas: liveDeltas } = calculateDriverStats(
    driverState.backgroundAnswers
  );

  const paceStyle = getStatSemanticStyle(liveStats.pace);
  const racecraftStyle = getStatSemanticStyle(liveStats.racecraft);
  const consistencyStyle = getStatSemanticStyle(liveStats.consistency);

  return (
    <div id="background-stage-container" className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center">
      {/* Stage Header Banner matching Identity screen */}
      <div className="mb-4 sm:mb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#24242E] border border-[#2E2E38] text-[#E10600] text-xs font-telemetry uppercase tracking-widest font-bold mb-1.5">
          Stage 2 / 2 • Junior Career Background
        </div>
        <h1 className="text-2xl sm:text-3xl font-black italic tracking-wide text-white uppercase font-racing leading-tight">
          Origin Story &amp; Driver DNA
        </h1>
        <p className="text-[#9A9AA5] text-xs sm:text-sm max-w-2xl mt-0.5 font-telemetry">
          Select your karting origin and junior development path. Each decision impacts your core rookie attributes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Main Question & Answer Choices Section */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-4 sm:p-5 shadow-xl shadow-black/40">
            {/* Step Progress Indicator - FIRST item visible at top of card, directly above question text */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2E2E38] mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-telemetry font-bold uppercase tracking-wider text-white bg-[#24242E] border border-[#2E2E38] px-2.5 py-1 rounded-sm">
                  QUESTION <span className="text-[#E10600] font-black">{currentQuestionIndex + 1}</span> OF {totalQuestions}
                </span>

                {/* Numbered Step Indicators */}
                <div className="flex gap-1 items-center">
                  {questions.map((q, idx) => {
                    const isAnswered = driverState.backgroundAnswers[idx] !== null;
                    const isCurrent = idx === currentQuestionIndex;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => onSelectAnswer(idx, driverState.backgroundAnswers[idx] || '')}
                        title={`Question ${idx + 1}`}
                        className={`h-5 w-5 rounded-sm flex items-center justify-center text-[10px] font-telemetry font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#E10600] text-white border border-[#E10600] shadow-sm'
                            : isAnswered
                            ? 'bg-[#24242E] text-[#00D26A] border border-[#00D26A]/40 hover:border-[#00D26A]'
                            : 'bg-[#15151E] text-[#9A9AA5] border border-[#2E2E38] hover:border-[#9A9AA5]/40'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <span className="text-xs font-telemetry uppercase tracking-widest text-[#9A9AA5] font-semibold">
                {selectedAnswerId ? (
                  <span className="text-[#00D26A] flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" /> CHOICE RECORDED
                  </span>
                ) : (
                  <span className="text-[#F5A623]">SELECT 1 PATH</span>
                )}
              </span>
            </div>

            {/* Question Text - directly below the progress indicator */}
            <h3 className="text-lg sm:text-xl font-black text-white font-racing tracking-wide mb-3.5 leading-snug">
              &quot;{currentQuestion.question}&quot;
            </h3>

            {/* Answer Choices List styled with panel visual weight & sharp corners */}
            <div className="space-y-2.5" role="radiogroup" aria-label={currentQuestion.question}>
              {currentQuestion.choices.map((choice) => {
                const isSelected = selectedAnswerId === choice.id;
                const paceDelta = formatStatDelta(choice.delta.pace, 'PACE');
                const racecraftDelta = formatStatDelta(choice.delta.racecraft, 'RACECRAFT');
                const consistencyDelta = formatStatDelta(choice.delta.consistency, 'CONSISTENCY');

                return (
                  <button
                    key={choice.id}
                    type="button"
                    id={`choice-${choice.id.toLowerCase()}`}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onSelectAnswer(currentQuestionIndex, choice.id)}
                    className={`w-full text-left p-3 sm:p-3.5 rounded-sm border transition-all cursor-pointer relative shadow-md ${
                      isSelected
                        ? 'bg-[#24242E] border-2 border-[#E10600] text-white ring-1 ring-[#E10600]/30'
                        : 'bg-[#1C1C25] border-[#2E2E38] hover:bg-[#24242E] hover:border-[#9A9AA5]/50 text-[#9A9AA5] hover:text-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Choice Label Letter Badge */}
                      <div
                        className={`w-7 h-7 rounded-sm flex items-center justify-center font-racing font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#E10600] text-white border border-[#E10600] shadow-sm'
                            : 'bg-[#15151E] border border-[#2E2E38] text-[#9A9AA5]'
                        }`}
                      >
                        {choice.label}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Narrative Answer Text */}
                        <p className="text-xs sm:text-sm font-medium text-white mb-2 leading-relaxed">
                          {choice.text}
                        </p>

                        {/* Visible Stat Deltas with Small-Caps Labels & Semantic Color Coding */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#2E2E38]">
                          <span className="text-[9px] font-telemetry font-bold uppercase tracking-widest text-[#9A9AA5] mr-1">
                            EFFECT:
                          </span>

                          <div className="flex flex-wrap items-center gap-1">
                            <span
                              className={`text-[10px] font-telemetry font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-sm border ${paceDelta.className}`}
                            >
                              {paceDelta.label}
                            </span>
                            <span
                              className={`text-[10px] font-telemetry font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-sm border ${racecraftDelta.className}`}
                            >
                              {racecraftDelta.label}
                            </span>
                            <span
                              className={`text-[10px] font-telemetry font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-sm border ${consistencyDelta.className}`}
                            >
                              {consistencyDelta.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="shrink-0 flex items-center gap-1 text-[#E10600] pt-0.5">
                          <span className="hidden sm:inline text-[9px] font-telemetry uppercase tracking-widest font-bold bg-[#E10600]/15 border border-[#E10600]/40 px-1 py-0.2 rounded-sm">
                            ACTIVE
                          </span>
                          <CheckCircle2 className="w-4 h-4 fill-[#E10600]/20" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="mt-4 pt-3.5 border-t border-[#2E2E38] flex items-center justify-between gap-3">
              <button
                type="button"
                id="background-prev-btn"
                onClick={onPrevQuestion}
                className="px-3.5 py-2 rounded-sm border border-[#2E2E38] bg-transparent hover:bg-[#24242E] hover:border-[#9A9AA5]/40 text-white font-racing uppercase tracking-wider text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#E10600]" />
                <span>{currentQuestionIndex === 0 ? 'Back to Identity' : 'Previous'}</span>
              </button>

              <button
                type="button"
                id="background-next-btn"
                disabled={!selectedAnswerId}
                onClick={onNextQuestion}
                className={`px-5 py-2 rounded-sm font-racing text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  selectedAnswerId
                    ? 'bg-[#E10600] hover:bg-[#b80500] text-white border border-[#E10600] shadow-md shadow-black/40 cursor-pointer active:scale-[0.99]'
                    : 'bg-[#24242E] text-[#9A9AA5] cursor-not-allowed border border-[#2E2E38]'
                }`}
              >
                <span>{isLastQuestion ? 'Review Summary' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Driver Profile & Telemetry Stats */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Driver Profile Card */}
          <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-4 sm:p-4.5 shadow-xl shadow-black/40">
            <h3 className="text-base font-bold uppercase tracking-wider text-white font-racing flex items-center justify-between pb-2.5 border-b border-[#2E2E38] mb-3">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#E10600]" />
                CANDIDATE PROFILE
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-[#24242E] border border-[#2E2E38] text-[#9A9AA5] font-telemetry uppercase font-bold">
                40 OVR BASE
              </span>
            </h3>

            <div className="flex items-center gap-3 mb-3.5 p-2.5 rounded-sm bg-[#15151E] border border-[#2E2E38]">
              <div className="w-10 h-10 rounded-sm bg-[#24242E] border-2 border-[#E10600] flex flex-col items-center justify-center text-white font-racing shrink-0 shadow-inner">
                <span className="text-[7px] font-bold text-[#9A9AA5] font-telemetry leading-none">NO.</span>
                <span className="text-lg font-black text-white leading-none">
                  {driverState.number}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[8px] text-[#9A9AA5] uppercase tracking-widest font-telemetry">
                  Official Entry
                </div>
                <div className="text-base font-black text-white uppercase font-racing truncate tracking-wide">
                  {driverState.lastName || 'ROOKIE'}
                </div>
                <div className="flex items-center gap-1 text-xs text-[#9A9AA5] mt-0.5">
                  <span className="text-sm">{driverState.nationality?.flagEmoji}</span>
                  <span className="truncate font-semibold text-white text-xs">{driverState.nationality?.name}</span>
                  <span className="text-[9px] text-[#9A9AA5] font-telemetry">
                    [{driverState.nationality?.code}]
                  </span>
                </div>
              </div>
            </div>

            {/* Core Stats Progress Bars with Dynamic Semantic Coloring */}
            <div className="space-y-3 pt-0.5">
              <div className="flex items-center justify-between text-xs font-telemetry pb-1 border-b border-[#2E2E38]">
                <span className="font-bold uppercase tracking-wider text-[#9A9AA5] text-[10px]">
                  Live Attributes
                </span>
                <span className="text-[9px] text-[#9A9AA5] uppercase tracking-wider font-semibold">
                  0 - 100 Scale
                </span>
              </div>

              {/* PACE */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-telemetry">
                  <span className="flex items-center gap-1 font-bold text-white uppercase tracking-wide text-xs">
                    <Zap className="w-3 h-3 text-[#9A9AA5]" /> Pace
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#9A9AA5]">
                      ({BASE_STATS.pace} {liveDeltas.pace >= 0 ? `+${liveDeltas.pace}` : liveDeltas.pace})
                    </span>
                    <span className={`font-black text-xs sm:text-sm font-racing ${paceStyle.textColorClass}`}>
                      {liveStats.pace}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#24242E] rounded-sm overflow-hidden border border-[#2E2E38]">
                  <div
                    className="h-full transition-all duration-300 rounded-sm"
                    style={{
                      width: `${Math.min(100, liveStats.pace)}%`,
                      backgroundColor: paceStyle.colorHex,
                    }}
                  />
                </div>
              </div>

              {/* RACECRAFT */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-telemetry">
                  <span className="flex items-center gap-1 font-bold text-white uppercase tracking-wide text-xs">
                    <Target className="w-3 h-3 text-[#9A9AA5]" /> Racecraft
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#9A9AA5]">
                      ({BASE_STATS.racecraft} {liveDeltas.racecraft >= 0 ? `+${liveDeltas.racecraft}` : liveDeltas.racecraft})
                    </span>
                    <span className={`font-black text-xs sm:text-sm font-racing ${racecraftStyle.textColorClass}`}>
                      {liveStats.racecraft}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#24242E] rounded-sm overflow-hidden border border-[#2E2E38]">
                  <div
                    className="h-full transition-all duration-300 rounded-sm"
                    style={{
                      width: `${Math.min(100, liveStats.racecraft)}%`,
                      backgroundColor: racecraftStyle.colorHex,
                    }}
                  />
                </div>
              </div>

              {/* CONSISTENCY */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1 font-telemetry">
                  <span className="flex items-center gap-1 font-bold text-white uppercase tracking-wide text-xs">
                    <Shield className="w-3 h-3 text-[#9A9AA5]" /> Consistency
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#9A9AA5]">
                      ({BASE_STATS.consistency} {liveDeltas.consistency >= 0 ? `+${liveDeltas.consistency}` : liveDeltas.consistency})
                    </span>
                    <span className={`font-black text-xs sm:text-sm font-racing ${consistencyStyle.textColorClass}`}>
                      {liveStats.consistency}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#24242E] rounded-sm overflow-hidden border border-[#2E2E38]">
                  <div
                    className="h-full transition-all duration-300 rounded-sm"
                    style={{
                      width: `${Math.min(100, liveStats.consistency)}%`,
                      backgroundColor: consistencyStyle.colorHex,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Background Answers Stepper Mini Map */}
          <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-3.5 text-xs font-telemetry shadow-xl shadow-black/40">
            <span className="text-[#9A9AA5] block mb-2 uppercase tracking-widest font-bold text-[10px]">
              DOSSIER PROGRESS
            </span>
            <div className="space-y-1">
              {questions.map((q, idx) => {
                const ansId = driverState.backgroundAnswers[idx];
                const choice = ansId ? q.choices.find((c) => c.id === ansId) : null;
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      onSelectAnswer(idx, ansId || '');
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-sm flex items-center justify-between transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-[#24242E] border-l-2 border-l-[#E10600] text-white shadow-sm'
                        : choice
                        ? 'bg-[#15151E] text-[#9A9AA5] hover:text-white border border-[#2E2E38]'
                        : 'bg-[#15151E]/40 text-[#9A9AA5]/50 border border-transparent'
                    }`}
                  >
                    <span className="truncate max-w-[190px] text-[11px]">
                      {q.id}. {choice ? `${choice.label}: ${choice.text.substring(0, 20)}...` : 'Pending Decision'}
                    </span>
                    <span
                      className={`shrink-0 text-[9px] font-bold uppercase tracking-wider ${
                        choice ? 'text-[#00D26A]' : 'text-[#9A9AA5]'
                      }`}
                    >
                      {choice ? '✓ Set' : `Q${q.id}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

