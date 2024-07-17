const generateUniqueId = (prefix = '') => `${prefix}-${Date.now()}-${Math.floor(Math.random()*1_000_000)}`;

export {
  generateUniqueId,
};
