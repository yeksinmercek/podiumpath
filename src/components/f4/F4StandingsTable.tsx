import React, { useState } from 'react';
import { Trophy, Swords, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { F4SeasonStandings, F4Team, F4Teammate, F4Track } from '../../types';

interface F4StandingsTableProps {
  standings: F4SeasonStandings;
  team: F4Team;
  teammate: F4Teammate;
  calendar: F4Track[];
  playerLastName: string;
}

export const F4StandingsTable: React.FC<F4StandingsTableProps> = ({
  standings,
  team,
  teammate,
  calendar,
  playerLastName,
}) => {
  const [showFullGrid, setShowFullGrid] = useState(false);
  const { drivers, roundsCompleted, playerHeadToHeadWins, teammateHeadToHeadWins } = standings;

  const playerStanding = drivers.find((d) => d.isPlayer);
  const teammateStanding = drivers.find((d) => d.isTeammate);

  const displayedDrivers = showFullGrid ? drivers : drivers.slice(0, 10);

  // If player or teammate isn't in top 10 and full grid isn't shown, include them
  const playerInTop10 = playerStanding && drivers.slice(0, 10).some((d) => d.isPlayer);
  const teammateInTop10 = teammateStanding && drivers.slice(0, 10).some((d) => d.isTeammate);

  return (
    <div className="space-y-6">
      {/* Teammate Rivalry Head-to-Head Banner */}
      <div
        id="teammate-rivalry-card"
        className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-4 sm:p-5 shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#E10600]/20 border border-[#E10600] flex items-center justify-center text-[#E10600] shrink-0">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-telemetry uppercase tracking-widest text-[#E10600] font-bold">
                Internal Garage Rivalry • {team.name}
              </div>
              <h3 className="text-lg font-black italic tracking-wide text-white uppercase font-racing">
                Head-to-Head: You vs {teammate.name}
              </h3>
            </div>
          </div>

          {/* Head-to-Head Score Pills */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#24242E] border border-[#2E2E38] px-4 py-2 rounded-sm">
              <div className="text-center">
                <div className="text-[10px] uppercase font-telemetry text-[#E10600] font-bold">
                  {playerLastName || 'YOU'}
                </div>
                <div className="text-2xl font-black font-racing text-white">
                  {playerHeadToHeadWins}
                </div>
              </div>

              <span className="text-[#9A9AA5] font-racing font-bold text-lg">-</span>

              <div className="text-center">
                <div className="text-[10px] uppercase font-telemetry text-[#9A9AA5] font-bold">
                  {teammate.name.split(' ')[1] || 'TEAMMATE'}
                </div>
                <div className="text-2xl font-black font-racing text-white">
                  {teammateHeadToHeadWins}
                </div>
              </div>
            </div>

            <div className="text-xs font-telemetry text-[#9A9AA5]">
              <div>Points: <b className="text-[#E10600]">{playerStanding?.points || 0}</b> vs <b className="text-white">{teammateStanding?.points || 0}</b></div>
              <div>Standing: <b className="text-white">P{standings.playerStandingPosition}</b> vs <b className="text-white">P{standings.teammateStandingPosition}</b></div>
            </div>
          </div>
        </div>
      </div>

      {/* Standings Table Section */}
      <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#E10600]" />
            <div>
              <h3 className="text-lg font-black italic tracking-wide text-white uppercase font-racing">
                FIA Formula 4 Drivers' Championship Standings
              </h3>
              <div className="text-xs font-telemetry text-[#9A9AA5]">
                {roundsCompleted} of 6 rounds completed • Official Championship Points
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFullGrid(!showFullGrid)}
            className="self-start sm:self-auto text-xs font-telemetry text-[#9A9AA5] hover:text-white bg-[#24242E] hover:bg-[#2E2E38] border border-[#2E2E38] px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{showFullGrid ? 'Show Top 10 Only' : 'Show All 22 Drivers'}</span>
            {showFullGrid ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {roundsCompleted === 0 ? (
          <div className="py-12 text-center text-[#9A9AA5] font-telemetry text-sm">
            No races completed yet. Start Round 1 at Monza to begin recording championship points!
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#2E2E38] rounded-sm">
            <table className="w-full text-left text-xs font-telemetry whitespace-nowrap">
              <thead className="bg-[#24242E] text-[#9A9AA5] uppercase text-[10px] border-b border-[#2E2E38]">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">POS</th>
                  <th className="py-2.5 px-3">DRIVER</th>
                  <th className="py-2.5 px-3">TEAM</th>
                  <th className="py-2.5 px-3 text-center">PTS</th>
                  <th className="py-2.5 px-3 text-center">WINS</th>
                  <th className="py-2.5 px-3 text-center">PODIUMS</th>
                  <th className="py-2.5 px-3 text-center">BEST</th>
                  {/* Round-by-round finishes */}
                  {calendar.map((track) => (
                    <th
                      key={track.round}
                      className="py-2.5 px-2 text-center w-10 text-[9px] text-[#9A9AA5]"
                      title={track.name}
                    >
                      R{track.round}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E2E38]/60 bg-[#1C1C25]">
                {displayedDrivers.map((driver, idx) => {
                  const position = idx + 1;
                  const isPlayerRow = driver.isPlayer;
                  const isTeammateRow = driver.isTeammate;

                  return (
                    <tr
                      key={driver.name}
                      className={`transition-colors ${
                        isPlayerRow
                          ? 'bg-[#E10600]/15 font-bold text-white border-l-4 border-l-[#E10600]'
                          : isTeammateRow
                          ? 'bg-[#24242E] font-medium text-white border-l-4 border-l-[#00D26A]'
                          : 'text-[#C5C5D0] hover:bg-[#20202A]'
                      }`}
                    >
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-block font-racing font-black ${
                            position === 1
                              ? 'text-amber-400'
                              : position <= 3
                              ? 'text-emerald-400'
                              : 'text-white'
                          }`}
                        >
                          P{position}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{driver.name}</span>
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
                      <td className="py-2 px-3 text-[#9A9AA5]">{driver.teamName}</td>
                      <td className="py-2 px-3 text-center font-bold text-white text-sm">
                        {driver.points}
                      </td>
                      <td className="py-2 px-3 text-center text-[#9A9AA5]">
                        {driver.wins > 0 ? (
                          <span className="text-amber-400 font-bold">{driver.wins}</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-2 px-3 text-center text-[#9A9AA5]">
                        {driver.podiums > 0 ? (
                          <span className="text-emerald-400 font-bold">{driver.podiums}</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-2 px-3 text-center text-[#9A9AA5]">
                        P{driver.bestFinish}
                      </td>

                      {/* Race history pills */}
                      {calendar.map((track, roundIdx) => {
                        const finish = driver.finishes[roundIdx];
                        return (
                          <td key={track.round} className="py-2 px-2 text-center">
                            {finish !== undefined ? (
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded-sm text-[10px] font-bold font-racing ${
                                  finish === 1
                                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                                    : finish <= 3
                                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                                    : finish <= 10
                                    ? 'bg-[#24242E] text-white border border-[#2E2E38]'
                                    : 'text-[#656575]'
                                }`}
                              >
                                P{finish}
                              </span>
                            ) : (
                              <span className="text-[#3E3E4A]">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* If Top 10 is shown and player is outside top 10, show a divider row + player */}
                {!showFullGrid && !playerInTop10 && playerStanding && (
                  <>
                    <tr className="bg-[#24242E]/50">
                      <td colSpan={7 + calendar.length} className="py-1 text-center text-[10px] text-[#9A9AA5]">
                        •••
                      </td>
                    </tr>
                    <tr className="bg-[#E10600]/15 font-bold text-white border-l-4 border-l-[#E10600]">
                      <td className="py-2 px-3 text-center font-racing font-black text-[#E10600]">
                        P{standings.playerStandingPosition}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{playerStanding.name}</span>
                          <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-sm bg-[#E10600] text-white">
                            YOU
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-[#9A9AA5]">{playerStanding.teamName}</td>
                      <td className="py-2 px-3 text-center font-bold text-white text-sm">
                        {playerStanding.points}
                      </td>
                      <td className="py-2 px-3 text-center text-[#9A9AA5]">
                        {playerStanding.wins || '-'}
                      </td>
                      <td className="py-2 px-3 text-center text-[#9A9AA5]">
                        {playerStanding.podiums || '-'}
                      </td>
                      <td className="py-2 px-3 text-center text-[#9A9AA5]">
                        P{playerStanding.bestFinish}
                      </td>
                      {calendar.map((track, roundIdx) => (
                        <td key={track.round} className="py-2 px-2 text-center">
                          {playerStanding.finishes[roundIdx] !== undefined ? (
                            <span className="text-white font-bold text-[10px]">
                              P{playerStanding.finishes[roundIdx]}
                            </span>
                          ) : (
                            <span className="text-[#3E3E4A]">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
