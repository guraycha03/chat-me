/**
 * Renders interest badges as HTML string with spaces between badges.
 * @param {string[]} interests - Array of interest strings.
 * @returns {string} HTML string for the badges.
 */
export function renderInterestBadges(interests) {
  if (!interests || interests.length === 0) {
    return '<span class="no-interests">No interests</span>';
  }
  return interests.map(interest => `<span class="interest-badge selected">${interest}</span>`).join(' ');
}
