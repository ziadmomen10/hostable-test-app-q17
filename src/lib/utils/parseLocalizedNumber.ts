/**
 * Locale-aware number parsing utility
 * Handles various number formats including Arabic numerals
 */

export function parseLocalizedNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  
  let str = String(value).trim();
  
  // Remove common currency symbols and whitespace
  str = str.replace(/[$€£¥₹₽₱₩\s]/g, "");
  
  // Handle Arabic numerals (٠١٢٣٤٥٦٧٨٩)
  const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(arabicNumerals[i], 'g'), String(i));
  }
  
  // Handle Persian numerals (۰۱۲۳۴۵۶۷۸۹)
  const persianNumerals = '۰۱۲۳۴۵۶۷۸۹';
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(persianNumerals[i], 'g'), String(i));
  }
  
  // Auto-detect decimal format (European uses comma, others use dot)
  const lastComma = str.lastIndexOf(",");
  const lastDot = str.lastIndexOf(".");
  const isCommaDecimal = lastComma > lastDot;

  if (isCommaDecimal) {
    // European format: 1.234,56 -> 1234.56
    str = str.replace(/\./g, "").replace(",", ".");
  } else {
    // Standard format: 1,234.56 -> 1234.56
    str = str.replace(/,/g, "");
  }

  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

export default parseLocalizedNumber;
