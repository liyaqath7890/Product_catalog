const SKU_FALLBACK_CATEGORY = 'PRD';
const SKU_FALLBACK_NAME = 'GEN';
const BARCODE_PREFIX = '89012024';

const sanitizeAlphaNumeric = (value = '') =>
  value
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, ' ')
    .trim();

const buildCategoryCode = (category) => {
  const compact = sanitizeAlphaNumeric(category).replace(/\s+/g, '');
  return (compact || SKU_FALLBACK_CATEGORY).slice(0, 3).padEnd(3, 'X');
};

const buildNameCode = (name) => {
  const words = sanitizeAlphaNumeric(name).split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return SKU_FALLBACK_NAME;
  }

  const initials = words.map((word) => word[0]).join('');
  const compact = words.join('');

  return `${initials}${compact}`.slice(0, 3).padEnd(3, 'X');
};

const getMatchingProducts = (products = [], currentProductId) =>
  products.filter((product) => String(product.id) !== String(currentProductId ?? ''));

export const generateProductSku = ({ name = '', category = '', existingProducts = [], currentProductId } = {}) => {
  const categoryCode = buildCategoryCode(category);
  const nameCode = buildNameCode(name);
  const skuBase = `${categoryCode}-${nameCode}`;

  const nextSequence =
    getMatchingProducts(existingProducts, currentProductId)
      .map((product) => product.sku)
      .map((sku) => {
        const match = sku?.match(new RegExp(`^${skuBase}-(\\d+)$`));
        return match ? Number(match[1]) : 0;
      })
      .reduce((max, value) => Math.max(max, value), 0) + 1;

  return `${skuBase}-${String(nextSequence).padStart(3, '0')}`;
};

export const generateProductBarcode = ({ existingProducts = [], currentProductId } = {}) => {
  const nextSequence =
    getMatchingProducts(existingProducts, currentProductId)
      .map((product) => String(product.barcode ?? ''))
      .map((barcode) => {
        const match = barcode.match(new RegExp(`^${BARCODE_PREFIX}(\\d+)$`));
        return match ? Number(match[1]) : 0;
      })
      .reduce((max, value) => Math.max(max, value), 0) + 1;

  return `${BARCODE_PREFIX}${String(nextSequence).padStart(4, '0')}`;
};
