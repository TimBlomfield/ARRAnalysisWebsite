
const getObjectSize = obj => (new Blob([JSON.stringify(obj)])).size;

const heavilyReduce = subs => {
  const subscriptions = subs.map(sx => {
    const { id, quantity, status, start_date, created, current_period_start, current_period_end, ended_at, plan, kProduct, kUpcoming, kInvoices: invoices } = sx;
    const { id: prodId, name } = kProduct;
    const { id: planId, interval } = plan;

    let upcm = null;
    if (kUpcoming != null) {
      const { amount_due, subtotal, total_excluding_tax, total } = kUpcoming;

      const lines = kUpcoming.lines.data.map(line => {
        const { id, period, quantity, unit_amount_excluding_tax, amount } = line;
        return { id, period, quantity, unit_amount_excluding_tax, amount };
      });

      upcm = { amount_due, subtotal, total_excluding_tax, total, lines };
    }

    const kInvoices = invoices.data.map(inv => {
      const { id, amount_paid, currency, status, number, customer_email, created } = inv;
      return { id, amount_paid, currency, status, number, customer_email, created };
    });

    const { cancel_at, cancel_at_period_end, canceled_at, cancellation_details: { comment, feedback, reason } } = sx;
    const kCancel = {
      cancel_at,
      cancel_at_period_end,
      canceled_at,
      details: {
        comment,
        feedback,
        reason,
      },
    };

    return {
      id,
      quantity,
      status,
      start_date,
      created,
      current_period_start,
      current_period_end,
      ended_at,
      plan: { id: planId, interval },
      kProduct: { id: prodId, name },
      kCancel,
      ...(upcm != null ? { kUpcoming: upcm } : {}),
      kInvoices,
    };
  });

  // const sizeBefore = getObjectSize(subs);
  // const sizeAfter = getObjectSize(subscriptions);
  // const str = `Size reduced from ${sizeBefore} to ${sizeAfter} bytes`;
  // console.info(str);

  return subscriptions;
};


export default heavilyReduce;
