
const PaymentSuccessPage = async ({ searchParams }) => {
// return_url: `${redirectBase}/purchase/checkout/success?scid=${stripeCustomerId}?secret=${secret}`,
  const { scid: id_stripeCustomer, secret } = searchParams;
  return (
    <div>
      Success! You are subscribed now
    </div>
  );
};


export default PaymentSuccessPage;
