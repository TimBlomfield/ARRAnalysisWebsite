const generateUniqueId = (prefix = '') => `${prefix}-${Date.now()}-${Math.floor(Math.random()*1_000_000)}`;

const convertToSuburrency = (amount, factor = 100) => Math.round(amount * factor);

// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
const getFunction_StripDiacritics = () =>  typeof ''.normalize === 'function'
  ? string => string.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  : string => string;


export {
  generateUniqueId,
  convertToSuburrency,
  getFunction_StripDiacritics,
};
