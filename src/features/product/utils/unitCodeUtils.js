const sanitizeUnitValue = (value = '') =>
  value
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, ' ')
    .trim();

export const generateUnitCode = (name = '') => {
  const words = sanitizeUnitValue(name).split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return '';
  }

  if (words.length === 1) {
    return words[0].slice(0, 3);
  }

  return words
    .map((word) => word[0])
    .join('')
    .slice(0, 3);
};
