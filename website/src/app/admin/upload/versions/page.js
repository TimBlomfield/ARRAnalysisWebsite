import CheckLoggedIn from '@/utils/server/logged-in-check';
// Components
import Footer from '@/components/admin/Footer';


const VersionsPage = async () => {
  await CheckLoggedIn(true);

  return (
    <>
      <div style={{ flex: 1 }}>
        Versions
      </div>
      <Footer />
    </>
  );
};


export default VersionsPage;
