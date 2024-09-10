import 'server-only';
import db from '@/utils/server/db';


const getPricingTiers = async () => {
  const now = new Date();

  const pms = await db.pricingModel.findMany({
    where: {
      startDate: { lte: now },
      endDate: { gte: now },
    },
  });
  let pm = null;
  if (Array.isArray(pms)) {
    pms.forEach(item => item.duration = item.endDate - item.startDate);
    pm = pms.reduce((min, cur) => cur.duration < min.duration ? cur : min);
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
};


export {
  getPricingTiers,
};
