const generateUniqueId = (prefix = '') => `${prefix}-${Date.now()}-${Math.floor(Math.random()*1_000_000)}`;

const convertToSuburrency = (amount, factor = 100) => Math.round(amount * factor);


export {
  generateUniqueId,
  convertToSuburrency,
};
