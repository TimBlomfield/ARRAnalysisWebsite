import 'server-only';

import Stripe from 'stripe';
// import db from '@/utils/server/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const getPricingTiers = async () => {
  const reducePrice = price => ({
    id: price.id,
    lookup_key: price.lookup_key,
    productId: price.product,
    metadata: { ...price.metadata },
    nickname: price.nickname,
    amount: price.unit_amount,
  });

  try {
    const prices = await stripe.prices.list({ active: true });

    const tiers = {
      One: {
        Prices: {
          Monthly: -1,
          Yearly: -1,
        },
        Desc: 'ARR Analysis Excel Add-in',
      },
      Two: {
        Prices: {
          Monthly: -1,
          Yearly: -1,
        },
        Desc: 'ARR Analysis + Segmentation',
      },
      Three: {
        Prices: {
          Monthly: -1,
          Yearly: -1,
        },
        Desc: 'Enterprise',
      },
    };

    const tier1_monthly = prices.data.find(price => price.lookup_key === 'standard_monthly_tier1');
    if (tier1_monthly == null) return null;
    const tier1_yearly = prices.data.find(price => price.lookup_key === 'standard_yearly_tier1');
    if (tier1_yearly == null) return null;
    const tier2_monthly = prices.data.find(price => price.lookup_key === 'standard_monthly_tier2');
    if (tier2_monthly == null) return null;
    const tier2_yearly = prices.data.find(price => price.lookup_key === 'standard_yearly_tier2');
    if (tier2_yearly == null) return null;
    const tier3_monthly = prices.data.find(price => price.lookup_key === 'standard_monthly_tier3');
    if (tier3_monthly == null) return null;
    const tier3_yearly = prices.data.find(price => price.lookup_key === 'standard_yearly_tier3');
    if (tier3_yearly == null) return null;

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
/*
  const now = new Date();

  const pms = await db.pricingModel.findMany({
    where: {
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: {
      startDate: 'desc',
    },
  });

  // Find the pricing model whose startDate is largest and if there are multiple pricing models with
  // the same largest startDate then pick the one with the smallest duration
  let pm = null;
  if (Array.isArray(pms)) {
    pm = pms[0];
    pm.duration = pm.endDate - pm.startDate;
    for (let i = 1; i < pms.length; ++i) {
      const pmTemp = pms[i];
      if (pmTemp.startDate < pm.startDate)
        break;
      pmTemp.duration = pmTemp.endDate - pmTemp.startDate;
      if (pmTemp.duration < pm.duration)
        pm = pmTemp;
    }
  }

  if (!pm) return null;

  return ({
    One: {
      Prices: {
        Monthly: pm.monthly_tier01,
        Yearly: pm.yearly_tier01,
      },
      Desc: 'ARR Analysis Excel Add-in',
    },
    Two: {
      Prices: {
        Monthly: pm.monthly_tier02,
        Yearly: pm.yearly_tier02,
      },
      Desc: 'ARR Analysis + Segmentation',
    },
    Three: {
      Prices: {
        Monthly: pm.monthly_tier03,
        Yearly: pm.yearly_tier03,
      },
      Desc: 'Enterprise',
    },
  });
*/
};


export {
  getPricingTiers,
};
