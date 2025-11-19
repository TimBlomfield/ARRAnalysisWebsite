const TrialExpiredPage = ({ searchParams }) => {
  const { email } = searchParams;
  return (
    <div>
      Trial Expired for email: {email}
    </div>
  );
};


export default TrialExpiredPage;
