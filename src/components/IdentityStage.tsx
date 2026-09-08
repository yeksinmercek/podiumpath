import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Hash, Flag, User, AlertCircle, Check } from 'lucide-react';
import { Nationality } from '../types';
import { COUNTRIES } from '../data/countries';

interface IdentityStageProps {
  lastName: string;
  driverNumber: number;
  selectedNationality: Nationality | null;
  onLastNameChange: (name: string) => void;
  onNumberChange: (num: number) => void;
  onNationalitySelect: (nat: Nationality) => void;
  onContinue: () => void;
}

export const IdentityStage: React.FC<IdentityStageProps> = ({
  lastName,
  driverNumber,
  selectedNationality,
  onLastNameChange,
  onNumberChange,
  onNationalitySelect,
  onContinue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter countries by name or 3-letter code
  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const isValid = lastName.trim().length > 0 && selectedNationality !== null;

  return (
    <div id="identity-stage-container" className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center">
      {/* Stage Header Banner */}
      <div className="mb-4 sm:mb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#24242E] border border-[#2E2E38] text-[#E10600] text-xs font-telemetry uppercase tracking-widest font-bold mb-1.5">
          Stage 1 / 2 • Driver Registry
        </div>
        <h1 className="text-2xl sm:text-3xl font-black italic tracking-wide text-white uppercase font-racing leading-tight">
          Paddock Registration
        </h1>
        <p className="text-[#9A9AA5] text-xs sm:text-sm max-w-2xl mt-0.5 font-telemetry">
          Enter your racing credentials and register your nationality with the FIA steward office before proceeding to junior career background evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: Driver Credentials */}
        <div className="flex flex-col">
          <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-5 sm:p-6 shadow-xl shadow-black/40 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-white font-racing flex items-center gap-2 mb-4 pb-3 border-b border-[#2E2E38]">
                <User className="w-4 h-4 text-[#E10600]" />
                Driver Credentials
              </h2>

              {/* Last Name Input */}
              <div className="mb-5">
                <label
                  htmlFor="driver-last-name-input"
                  className="block text-xs font-bold uppercase tracking-wider text-[#9A9AA5] font-telemetry mb-1.5"
                >
                  Driver Last Name <span className="text-[#E10600]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="driver-last-name-input"
                    type="text"
                    maxLength={24}
                    value={lastName}
                    onChange={(e) => onLastNameChange(e.target.value.toUpperCase())}
                    placeholder="ROOKIE"
                    className="w-full bg-[#24242E] border border-[#2E2E38] focus:border-[#E10600] text-white placeholder-[#9A9AA5]/40 rounded-sm px-3.5 py-2 text-base sm:text-lg font-bold tracking-wider uppercase font-racing transition-colors outline-none"
                  />
                </div>
                <p className="text-[11px] text-[#9A9AA5] mt-1 font-telemetry">
                  Displayed on your steering wheel, timing tower, and rear wing.
                </p>
              </div>

              {/* Driver Number Selection (1-99) */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="driver-number-input"
                    className="block text-xs font-bold uppercase tracking-wider text-[#9A9AA5] font-telemetry"
                  >
                    Permanent Driver Number <span className="text-[#E10600]">*</span>
                  </label>
                  <span className="text-[11px] text-[#9A9AA5] font-telemetry uppercase tracking-wider">
                    Range: 1 – 99
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2.5 items-center">
                  {/* Number Input field */}
                  <div className="col-span-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#9A9AA5]">
                      <Hash className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="driver-number-input"
                      type="number"
                      min={1}
                      max={99}
                      value={driverNumber || ''}
                      placeholder="10"
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (isNaN(val)) {
                          onNumberChange(10);
                        } else {
                          const clamped = Math.min(99, Math.max(1, val));
                          onNumberChange(clamped);
                        }
                      }}
                      className="w-full bg-[#24242E] border border-[#2E2E38] focus:border-[#E10600] text-white placeholder-[#9A9AA5]/40 rounded-sm pl-8 pr-2.5 py-1.5 text-base font-bold font-telemetry transition-colors outline-none"
                    />
                  </div>

                  {/* Quick Presets / Selection */}
                  <div className="col-span-8 flex items-center gap-1 overflow-x-auto py-1 custom-scrollbar">
                    {[4, 10, 16, 27, 44, 55, 63, 77].map((num) => (
                      <button
                        key={num}
                        type="button"
                        id={`preset-number-${num}`}
                        onClick={() => onNumberChange(num)}
                        className={`px-2 py-1.5 rounded-sm text-xs font-telemetry font-bold transition-all shrink-0 cursor-pointer ${
                          driverNumber === num
                            ? 'bg-[#E10600] text-white border border-[#E10600]'
                            : 'bg-[#24242E] text-[#9A9AA5] border border-[#2E2E38] hover:border-[#9A9AA5] hover:text-white'
                        }`}
                      >
                        #{num}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-[#9A9AA5] mt-1 font-telemetry">
                  Select your signature number for open-wheel competition.
                </p>
              </div>
            </div>

            {/* Bottom Status strip to match the right panel's bottom action bar */}
            <div className="mt-5 pt-3.5 border-t border-[#2E2E38] flex items-center justify-between text-xs font-telemetry text-[#9A9AA5]">
              <span className="uppercase tracking-wider font-semibold text-[10px]">
                Registry Status
              </span>
              <span className="text-white font-bold text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" />
                {lastName.trim() ? `${lastName.trim()} (#${driverNumber || 10})` : 'Pending Name Entry'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Compact Nationality Roster (Height matched with Driver Credentials) */}
        <div className="flex flex-col">
          <div className="bg-[#1C1C25] border border-[#2E2E38] rounded-sm p-5 sm:p-6 shadow-xl shadow-black/40 h-full flex flex-col justify-between">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between pb-3 border-b border-[#2E2E38] mb-3">
                <h2 className="text-lg font-bold uppercase tracking-wider text-white font-racing flex items-center gap-2">
                  <Flag className="w-4 h-4 text-[#E10600]" />
                  Select Racing Nationality <span className="text-[#E10600]">*</span>
                </h2>
                <span className="text-xs text-[#9A9AA5] font-telemetry">
                  {COUNTRIES.length} Nations
                </span>
              </div>

              {/* Search Input */}
              <div className="relative mb-2.5">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9A9AA5]">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  id="nationality-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country or code (e.g. Spain, GBR, Italy)..."
                  className="w-full bg-[#24242E] border border-[#2E2E38] focus:border-[#E10600] text-white placeholder-[#9A9AA5]/50 rounded-sm pl-9 pr-3.5 py-1.5 text-xs sm:text-sm transition-colors outline-none font-telemetry"
                />
                {searchQuery && (
                  <button
                    type="button"
                    id="clear-nationality-search-btn"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#9A9AA5] hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Selected Nation Highlight Banner */}
              <div className="mb-2.5 min-h-[34px]">
                {selectedNationality ? (
                  <div className="px-2.5 py-1.5 rounded-sm bg-[#24242E] border border-[#E10600] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{selectedNationality.flagEmoji}</span>
                      <span className="font-bold text-white tracking-wide truncate">
                        {selectedNationality.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-[#E10600] text-white font-telemetry font-bold shrink-0">
                        {selectedNationality.code}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#00D26A] font-telemetry flex items-center gap-1 shrink-0 font-bold">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  </div>
                ) : (
                  <div className="px-2.5 py-1.5 rounded-sm bg-[#181820] border border-[#2E2E38] text-[11px] text-[#9A9AA5] font-telemetry flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                    <span>Choose a nationality from the roster below</span>
                  </div>
                )}
              </div>

              {/* Compact Roster / Lookup Table with internal scrolling */}
              <div className="flex-1 min-h-[140px] max-h-[175px] overflow-y-auto custom-scrollbar border border-[#2E2E38] rounded-sm bg-[#15151E] divide-y divide-[#2E2E38]/60">
                {filteredCountries.length === 0 ? (
                  <div className="py-6 text-center text-[#9A9AA5] text-xs font-telemetry">
                    No nationality matching &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  filteredCountries.map((country) => {
                    const isSelected = selectedNationality?.code === country.code;
                    return (
                      <button
                        key={country.code}
                        type="button"
                        id={`country-option-${country.code.toLowerCase()}`}
                        onClick={() => onNationalitySelect(country)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#24242E] border-l-2 border-l-[#E10600] text-white'
                            : 'hover:bg-[#24242E]/70 text-[#9A9AA5] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{country.flagEmoji}</span>
                          <span className="text-xs sm:text-sm font-medium truncate">
                            {country.name}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-telemetry shrink-0 px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                            isSelected
                              ? 'bg-[#E10600] text-white font-bold'
                              : 'bg-[#24242E] text-[#9A9AA5] border border-[#2E2E38]'
                          }`}
                        >
                          {country.code}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Validation & Continue Action */}
            <div className="mt-4 pt-3.5 border-t border-[#2E2E38] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs font-telemetry">
                {!lastName.trim() ? (
                  <span className="text-[#F5A623] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Enter last name
                  </span>
                ) : !selectedNationality ? (
                  <span className="text-[#F5A623] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Select nationality
                  </span>
                ) : (
                  <span className="text-[#00D26A] flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" /> Ready for background
                  </span>
                )}
              </div>

              <button
                id="identity-continue-btn"
                type="button"
                disabled={!isValid}
                onClick={onContinue}
                className={`w-full sm:w-auto px-5 py-2 rounded-sm font-racing text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isValid
                    ? 'bg-[#E10600] hover:bg-[#b80500] text-white shadow-md shadow-black/40 cursor-pointer active:scale-[0.99]'
                    : 'bg-[#24242E] text-[#9A9AA5] cursor-not-allowed border border-[#2E2E38]'
                }`}
              >
                <span>Continue to Background</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
