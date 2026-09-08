import React, { useState } from 'react';
import { DriverState, F4Team, KartingRoundResult, KartingSeasonState, KartingSeriesTier } from '../../types';
import { SeriesSelectionStep } from './SeriesSelectionStep';
import { SeasonSimulationStep } from './SeasonSimulationStep';
import { OffersStep } from './OffersStep';
import { calculateKartingRating } from '../../utils/raceSimulation';
import { generateF4Offers } from '../../data/f4Teams';

interface KartingStageProps {
  driverState: DriverState;
  onUpdateDriverState: (updater: (prev: DriverState) => DriverState) => void;
  onEnterF4Season?: (team: F4Team) => void;
}

type KartingSubStep = 'series' | 'simulation' | 'offers';

export const KartingStage: React.FC<KartingStageProps> = ({
  driverState,
  onUpdateDriverState,
  onEnterF4Season,
}) => {
  // Determine starting sub-step based on existing kartingSeason data
  const existingSeason = driverState.kartingSeason;
  const initialSubStep: KartingSubStep =
    existingSeason?.offersReceived && existingSeason.offersReceived.length > 0
      ? 'offers'
      : existingSeason?.seriesChosen
      ? 'simulation'
      : 'series';

  const [subStep, setSubStep] = useState<KartingSubStep>(initialSubStep);

  // 1. Player chooses karting series
  const handleSelectSeries = (series: KartingSeriesTier) => {
    onUpdateDriverState((prev) => ({
      ...prev,
      kartingSeason: {
        seriesChosen: series,
        roundResults: [],
        totalPoints: 0,
        kartingRating: 0,
        offersReceived: [],
        selectedTeam: null,
      },
    }));
    setSubStep('simulation');
  };

  // 2. All 6 rounds simulated -> aggregate season & generate offers
  const handleSeasonComplete = (results: KartingRoundResult[]) => {
    const seriesChosen = driverState.kartingSeason?.seriesChosen || 'national';
    const totalPoints = results.reduce((acc, r) => acc + r.totalRoundPoints, 0);
    const rating = calculateKartingRating(totalPoints);
    const generatedOffers = generateF4Offers(rating, seriesChosen);

    onUpdateDriverState((prev) => ({
      ...prev,
      kartingSeason: {
        seriesChosen,
        roundResults: results,
        totalPoints,
        kartingRating: rating,
        offersReceived: generatedOffers,
        selectedTeam: null,
      },
    }));

    setSubStep('offers');
  };

  // 3. Player accepts an F4 offer
  const handleAcceptOffer = (team: F4Team) => {
    onUpdateDriverState((prev) => ({
      ...prev,
      kartingSeason: prev.kartingSeason
        ? {
            ...prev.kartingSeason,
            selectedTeam: team,
          }
        : {
            seriesChosen: 'national',
            roundResults: [],
            totalPoints: 0,
            kartingRating: 0,
            offersReceived: [team],
            selectedTeam: team,
          },
    }));
  };

  // Restart karting season
  const handleRestartKarting = () => {
    onUpdateDriverState((prev) => ({
      ...prev,
      kartingSeason: undefined,
    }));
    setSubStep('series');
  };

  const kartingSeason = driverState.kartingSeason;
  const seriesTier = kartingSeason?.seriesChosen || 'national';

  return (
    <div id="karting-stage-container" className="w-full">
      {subStep === 'series' && (
        <SeriesSelectionStep
          driverState={driverState}
          onSelectSeries={handleSelectSeries}
        />
      )}

      {subStep === 'simulation' && (
        <SeasonSimulationStep
          driverState={driverState}
          seriesTier={seriesTier}
          initialResults={kartingSeason?.roundResults || []}
          onSeasonComplete={handleSeasonComplete}
        />
      )}

      {subStep === 'offers' && kartingSeason && (
        <OffersStep
          driverState={driverState}
          seriesTier={seriesTier}
          roundResults={kartingSeason.roundResults}
          totalPoints={kartingSeason.totalPoints}
          kartingRating={kartingSeason.kartingRating}
          offers={kartingSeason.offersReceived}
          selectedTeam={kartingSeason.selectedTeam}
          onAcceptOffer={handleAcceptOffer}
          onRestartKarting={handleRestartKarting}
          onEnterF4Season={onEnterF4Season}
        />
      )}
    </div>
  );
};
