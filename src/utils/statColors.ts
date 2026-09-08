export interface StatSemanticStyle {
  colorHex: string;
  textColorClass: string;
  bgColorClass: string;
  borderColorClass: string;
  badgeClass: string;
  ratingLabel: 'Weak' | 'Average' | 'Strong';
}

/**
 * Returns dynamic semantic colors based on stat value range:
 * - Below 40: --stat-weak (#E10600)
 * - 40 to 59: --stat-average (#F5A623)
 * - 60 and above: --stat-strong (#00D26A)
 */
export function getStatSemanticStyle(val: number): StatSemanticStyle {
  if (val >= 60) {
    return {
      colorHex: '#00D26A',
      textColorClass: 'text-[#00D26A]',
      bgColorClass: 'bg-[#00D26A]',
      borderColorClass: 'border-[#00D26A]',
      badgeClass: 'text-[#00D26A] bg-[#00D26A]/10 border-[#00D26A]/40',
      ratingLabel: 'Strong',
    };
  }
  if (val >= 40) {
    return {
      colorHex: '#F5A623',
      textColorClass: 'text-[#F5A623]',
      bgColorClass: 'bg-[#F5A623]',
      borderColorClass: 'border-[#F5A623]',
      badgeClass: 'text-[#F5A623] bg-[#F5A623]/10 border-[#F5A623]/40',
      ratingLabel: 'Average',
    };
  }
  return {
    colorHex: '#E10600',
    textColorClass: 'text-[#E10600]',
    bgColorClass: 'bg-[#E10600]',
    borderColorClass: 'border-[#E10600]',
    badgeClass: 'text-[#E10600] bg-[#E10600]/10 border-[#E10600]/40',
    ratingLabel: 'Weak',
  };
}

/**
 * Delta badge styling for question choices (+ is green, - is red, 0 is neutral)
 */
export function getDeltaTagStyle(val: number): { text: string; className: string } {
  const sign = val > 0 ? `+${val}` : `${val}`;
  if (val > 0) {
    return {
      text: sign,
      className: 'text-[#00D26A] bg-[#00D26A]/10 border-[#00D26A]/40',
    };
  }
  if (val < 0) {
    return {
      text: sign,
      className: 'text-[#E10600] bg-[#E10600]/10 border-[#E10600]/40',
    };
  }
  return {
    text: sign,
    className: 'text-[#9A9AA5] bg-[#24242E] border-[#2E2E38]',
  };
}

/**
 * Formats a stat delta with name (e.g. "+2 PACE", "+1 RACECRAFT", "+0 CONSISTENCY")
 * with matching semantic coloring.
 */
export function formatStatDelta(val: number, statName: string): { label: string; className: string } {
  const sign = val > 0 ? `+${val}` : `${val}`;
  const label = `${sign} ${statName}`;
  if (val > 0) {
    return {
      label,
      className: 'text-[#00D26A] bg-[#00D26A]/10 border-[#00D26A]/40',
    };
  }
  if (val < 0) {
    return {
      label,
      className: 'text-[#E10600] bg-[#E10600]/10 border-[#E10600]/40',
    };
  }
  return {
    label,
    className: 'text-[#9A9AA5] bg-[#24242E] border-[#2E2E38]',
  };
}

