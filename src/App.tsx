/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DriverState, CreationStage, Nationality, F4Team } from './types';
import { BACKGROUND_QUESTIONS, calculateDriverStats, BASE_STATS } from './data/questions';
import { COUNTRIES } from './data/countries';
import { Header } from './components/Header';
import { IdentityStage } from './components/IdentityStage';
import { BackgroundStage } from './components/BackgroundStage';
import { SummaryStage } from './components/SummaryStage';
import { KartingStage } from './components/karting/KartingStage';
import { F4SeasonStage } from './components/f4/F4SeasonStage';
import { initializeF4Season } from './data/f4Data';

export default function App() {
  // Stage management
  const [currentStage, setCurrentStage] = useState<CreationStage>('identity');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Default driver state
  const [driverState, setDriverState] = useState<DriverState>({
    lastName: '',
    number: 10,
    nationality: null,
    backgroundAnswers: [null, null, null, null, null],
    coreStats: { ...BASE_STATS },
  });

  // Stage 1: Identity handlers
  const handleLastNameChange = (name: string) => {
    setDriverState((prev) => ({
      ...prev,
      lastName: name,
    }));
  };

  const handleNumberChange = (num: number) => {
    setDriverState((prev) => ({
      ...prev,
      number: num,
    }));
  };

  const handleNationalitySelect = (nationality: Nationality) => {
    setDriverState((prev) => ({
      ...prev,
      nationality,
    }));
  };

  const handleContinueToBackground = () => {
    if (driverState.lastName.trim() && driverState.nationality) {
      setCurrentStage('background');
    }
  };

  // Stage 2: Background handlers
  const handleSelectAnswer = (questionIndex: number, answerId: string) => {
    setDriverState((prev) => {
      const updatedAnswers = [...prev.backgroundAnswers];
      updatedAnswers[questionIndex] = answerId;
      const { stats } = calculateDriverStats(updatedAnswers);
      return {
        ...prev,
        backgroundAnswers: updatedAnswers,
        coreStats: stats,
      };
    });
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      // Returning from Question 1 goes back to Identity stage
      setCurrentStage('identity');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < BACKGROUND_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed all 5 questions -> go to Summary stage
      const { stats } = calculateDriverStats(driverState.backgroundAnswers);
      setDriverState((prev) => ({
        ...prev,
        coreStats: stats,
      }));
      setCurrentStage('summary');
    }
  };

  // Stage 3: Summary handlers
  const handleBackToBackground = () => {
    setCurrentStage('background');
    setCurrentQuestionIndex(BACKGROUND_QUESTIONS.length - 1); // Resume at last question with choices intact
  };

  const handleEditIdentity = () => {
    setCurrentStage('identity');
  };

  const handleStartCareer = () => {
    setCurrentStage('karting');
  };

  const handleEnterF4Season = (team: F4Team) => {
    setDriverState((prev) => {
      const existingF4 =
        prev.f4Season?.team.id === team.id
          ? prev.f4Season
          : initializeF4Season(team, prev.lastName);

      return {
        ...prev,
        f4Season: existingF4,
      };
    });
    setCurrentStage('f4');
  };

  const handleRestartKarting = () => {
    setDriverState((prev) => ({
      ...prev,
      kartingSeason: undefined,
      f4Season: undefined,
    }));
    setCurrentStage('karting');
  };

  const handleReset = () => {
    setDriverState({
      lastName: '',
      number: 10,
      nationality: null,
      backgroundAnswers: [null, null, null, null, null],
      coreStats: { ...BASE_STATS },
      kartingSeason: undefined,
      f4Season: undefined,
    });
    setCurrentQuestionIndex(0);
    setCurrentStage('identity');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#15151E] text-white selection:bg-[#E10600] selection:text-white">
      {/* Background Motorsport Texture / Carbon Ambient Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#2E2E38_1px,transparent_1px)] [background-size:20px_20px]" 
        aria-hidden="true"
      />

      {/* Persistent Navigation Header with Stepper */}
      <Header
        currentStage={currentStage}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={BACKGROUND_QUESTIONS.length}
        driverState={driverState}
      />

      {/* Main Interactive Stage Container */}
      <main className="flex-1 relative z-10">
        {currentStage === 'identity' && (
          <IdentityStage
            lastName={driverState.lastName}
            driverNumber={driverState.number}
            selectedNationality={driverState.nationality}
            onLastNameChange={handleLastNameChange}
            onNumberChange={handleNumberChange}
            onNationalitySelect={handleNationalitySelect}
            onContinue={handleContinueToBackground}
          />
        )}

        {currentStage === 'background' && (
          <BackgroundStage
            questions={BACKGROUND_QUESTIONS}
            currentQuestionIndex={currentQuestionIndex}
            driverState={driverState}
            onSelectAnswer={handleSelectAnswer}
            onPrevQuestion={handlePrevQuestion}
            onNextQuestion={handleNextQuestion}
          />
        )}

        {currentStage === 'summary' && (
          <SummaryStage
            driverState={driverState}
            questions={BACKGROUND_QUESTIONS}
            onBackToBackground={handleBackToBackground}
            onEditIdentity={handleEditIdentity}
            onReset={handleReset}
            onStartCareer={handleStartCareer}
          />
        )}

        {currentStage === 'karting' && (
          <KartingStage
            driverState={driverState}
            onUpdateDriverState={setDriverState}
            onEnterF4Season={handleEnterF4Season}
          />
        )}

        {currentStage === 'f4' && (
          <F4SeasonStage
            driverState={driverState}
            onUpdateDriverState={setDriverState}
            onRestartKarting={handleRestartKarting}
          />
        )}
      </main>

      {/* Clean Paddock Footer */}
      <footer className="w-full border-t border-[#2E2E38] bg-[#1C1C25] py-3.5 text-center text-xs text-[#9A9AA5] font-telemetry relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]"></span>
            <span className="text-white font-semibold">PODIUM PATH • Open-Wheel Driver Career Game</span>
          </div>
          <span>FIA Superlicence Protocol • Driver Creation Engine</span>
        </div>
      </footer>
    </div>
  );
}
