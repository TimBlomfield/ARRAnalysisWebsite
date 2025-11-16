const K_Theme = {
  Dark: 0,
  Light: 1,
  Danger: 2,
  Trial: 3,
};

const PORTAL_ID_MENU = 'UNIQUE_ELEMENT_PORTAL_MENU_AC3C1A816472';

const TierNames = {
  Basic: 'Basic',
  SaaSAnalyst: 'SaaS Analyst',
  FullStackAnalyst: 'Full Stack Analyst',
  toArray: function() { return [this.Basic, this.SaaSAnalyst, this.FullStackAnalyst]; },
};

export {
  K_Theme,
  PORTAL_ID_MENU,
  TierNames,
};
