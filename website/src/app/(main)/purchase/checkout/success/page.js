
const PaymentSuccessPage = ({ searchParams }) => {
  return (
    <div>
      Success! You paid: {searchParams.amount}
    </div>
  );
};


export default PaymentSuccessPage;
