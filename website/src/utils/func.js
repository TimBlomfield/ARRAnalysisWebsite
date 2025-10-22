const generateUniqueId = (prefix = '') => `${prefix}-${Date.now()}-${Math.floor(Math.random()*1_000_000)}`;

const convertToSuburrency = (amount, factor = 100) => Math.round(amount * factor);

// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
const getFunction_StripDiacritics = () =>  typeof ''.normalize === 'function'
  ? string => string.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  : string => string;

const mkFix = name => name.toLowerCase().includes('macedonia') ? 'Macedonia' : name;

const capitalizeFirstLetter = val => String(val).charAt(0).toUpperCase() + String(val).slice(1);

// Helper to get UTF-8 byte length
const getByteLength = str => new TextEncoder().encode(str).length;

// Regex for safe characters (alphanumeric + common specials); extend as needed
const SAFE_CHAR_REGEX = /^[0-9a-zA-Z!\-_. '();\/+=,@]+$/u;  // /u flag for Unicode

// This is an AI generated function, so it might not comply 100% with the S3 AWS standards
const isValidS3Key = (key, options = { strictSafeChars: false }) => {
  if (typeof key !== 'string' || key.trim() === '') {
    return { valid: false, error: 'Key must be a non-empty string' };
  }

  const byteLength = getByteLength(key);
  if (byteLength > 1024) {
    return { valid: false, error: `Key exceeds 1,024 bytes (current: ${byteLength})` };
  }

  if (options.strictSafeChars && !SAFE_CHAR_REGEX.test(key)) {
    return { valid: false, error: 'Key contains unsafe characters; use only safe chars for compatibility' };
  }

  return { valid: true };
};

const isValidVersionNumber = verNum => {
  if (verNum == null || typeof verNum !== 'string') return false;
  if (verNum.length < 5) return false;

  const isNumeric = ch => ch !== ' ' && !isNaN(ch);

  const vNums = verNum.split('.');
  if (vNums.length !== 3) return false;

  for (const part of vNums) {
    if (part.length === 0 || part.length > 6) return false;
    if (part.length > 1 && part[0] === '0') return false;
    if (!part.split('').every(isNumeric)) return false;
  }

  return true;
};


export {
  generateUniqueId,
  convertToSuburrency,
  getFunction_StripDiacritics,
  mkFix,
  capitalizeFirstLetter,
  getByteLength,
  isValidS3Key,
  isValidVersionNumber,
};
