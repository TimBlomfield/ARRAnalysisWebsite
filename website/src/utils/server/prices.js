import 'server-only';
import Stripe from 'stripe';
import { TierNames } from '@/utils/common';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const getPricingTiers = async () => {
  try {
    const prices = await stripe.prices.list({ active: true });

    const tiers = {
      One: {
        Prices: {
          Monthly: -1,
          Yearly: -1,
        },
        Desc: TierNames.Basic,
      },
      Two: {
        Prices: {
          Monthly: -1,
          Yearly: -1,
        },
        Desc: TierNames.SaaSAnalyst,
      },
      Three: {
        Prices: {
          Monthly: -1,
          Yearly: -1,
        },
        Desc: TierNames.FullStackAnalyst,
      },
    };

    const tier1_monthly = prices.data.find(price => price.lookup_key === 'standard_monthly_tier1');
    if (tier1_monthly == null) {
      console.error('Could not fetch price for Tier-1 Monthly subscription');
      return null;
    }
    const tier1_yearly = prices.data.find(price => price.lookup_key === 'standard_yearly_tier1');
    if (tier1_yearly == null) {
      console.error('Could not fetch price for Tier-1 Yearly subscription');
      return null;
    }
    const tier2_monthly = prices.data.find(price => price.lookup_key === 'standard_monthly_tier2');
    if (tier2_monthly == null) {
      console.error('Could not fetch price for Tier-2 Monthly subscription');
      return null;
    }
    const tier2_yearly = prices.data.find(price => price.lookup_key === 'standard_yearly_tier2');
    if (tier2_yearly == null) {
      console.error('Could not fetch price for Tier-2 Yearly subscription');
      return null;
    }
    const tier3_monthly = prices.data.find(price => price.lookup_key === 'standard_monthly_tier3');
    if (tier3_monthly == null) {
      console.error('Could not fetch price for Tier-3 Monthly subscription');
      return null;
    }
    const tier3_yearly = prices.data.find(price => price.lookup_key === 'standard_yearly_tier3');
    if (tier3_yearly == null) {
      console.error('Could not fetch price for Tier-3 Yearly subscription');
      return null;
    }

    tiers.One.Prices.Monthly = tier1_monthly.unit_amount;
    tiers.One.Prices.Yearly = tier1_yearly.unit_amount;
    tiers.Two.Prices.Monthly = tier2_monthly.unit_amount;
    tiers.Two.Prices.Yearly = tier2_yearly.unit_amount;
    tiers.Three.Prices.Monthly = tier3_monthly.unit_amount;
    tiers.Three.Prices.Yearly = tier3_yearly.unit_amount;

    return tiers;
  } catch (err) {
    console.error(err);
    return null;
  }
};


export {
  getPricingTiers,
};
