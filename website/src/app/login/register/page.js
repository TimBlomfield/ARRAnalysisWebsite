import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { checkRegToken, RegTokenState } from '@/utils/server/common';
import { Role } from '@prisma/client';
import { getLicenseData } from '@/utils/server/licenses';
// Components
import AdminRegistrationPage from '@/components/forms/AdminRegistrationPage';
import ExistingUserNewLicensePage from '@/components/forms/ExistingUserNewLicensePage';
import LoadingSSR from '@/components/LoadingSSR';
import UserRegistrationPage from '@/components/forms/UserRegistrationPage';
// Styles
import styles from './styles.module.scss';


const RegistrationPage = ({ searchParams }) => {
  const { token } = searchParams;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <AsyncPage token={token} />
    </Suspense>
  );
};


const AsyncPage = async ({ token }) => {
  const ret = await checkRegToken(token);
  if (ret.ts !== RegTokenState.Valid)
    notFound();

  switch (ret.role) {
    case Role.ADMIN:
      return <AdminRegistrationPage reglinkEmail={ret.email} />;

    case Role.USER:
      const ld = await getLicenseData(ret.userData?.licenseId);
      if (ld == null)
        notFound();
      return ret.userExists
        ? <ExistingUserNewLicensePage email={ret.email} licenseData={ld} />
        : <UserRegistrationPage email={ret.email} licenseData={ld} firstName={ret.firstName} lastName={ret.lastName} />;

    default:
      notFound();
      return null;
  }
};


const LoadingScreen = () => (
  <div className={styles.loadingScreen}>
    <LoadingSSR scale={1.5} /> {/* Note: Cannot use a client component here. */}
  </div>
);


export default RegistrationPage;
