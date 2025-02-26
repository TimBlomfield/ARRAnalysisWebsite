
const getObjectSize = obj => (new Blob([JSON.stringify(obj)])).size;

const heavilyReduce = subs => {
  const subscriptions = {};

  subscriptions.active = subs.active.map(sx => {
    const { id, quantity, status, start_date, created, current_period_start, current_period_end, plan, kProduct, kUpcoming, kInvoices: invoices } = sx;
    const { id: prodId, name } = kProduct;
    const { id: planId, interval } = plan;
    const { amount_due, subtotal, total_excluding_tax, total } = kUpcoming;

    const lines = kUpcoming.lines.data.map(line => {
      const { id, period, quantity, unit_amount_excluding_tax, amount } = line;
      return { id, period, quantity, unit_amount_excluding_tax, amount };
    });

    const kInvoices = invoices.data.map(inv => {
      const { id, amount_paid, currency, status, number, customer_email, created } = inv;
      return { id, amount_paid, currency, status, number, customer_email, created };
    });

    return {
      id,
      quantity,
      status,
      start_date,
      created,
      current_period_start,
      current_period_end,
      plan: { id: planId, interval },
      kProduct: { id: prodId, name },
      kUpcoming: { amount_due, subtotal, total_excluding_tax, total, lines },
      kInvoices,
    };
  });

  subscriptions.ended = [...subs.ended];

  // const sizeBefore = getObjectSize(subs);
  // const sizeAfter = getObjectSize(subscriptions);
  // const str = `Size reduced from ${sizeBefore} to ${sizeAfter} bytes`;
  // console.info(str);

  return subscriptions;
};


export default heavilyReduce;
