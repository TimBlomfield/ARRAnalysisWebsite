import CheckLoggedIn from '@/utils/server/logged-in-check';
// Components
import Footer from '@/components/admin/Footer';


const OverviewPage = async () => {
  await CheckLoggedIn(true);

  return (
    <>
      <div style={{ flex: 1 }}>
        Overview
        <div style={{ width: 20, height: 1500, backgroundColor: 'red' }} />
      </div>
      <Footer />
    </>
  );
};


export default OverviewPage;
