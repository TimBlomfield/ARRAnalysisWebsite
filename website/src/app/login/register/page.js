import { notFound } from 'next/navigation';
import { checkRegToken, RegTokenState } from '@/utils/server/common';
import { Role } from '@prisma/client';
// Components
import AdminRegistrationPage from '@/components/forms/AdminRegistrationPage';
import ExistingUserNewLicensePage from '@/components/forms/ExistingUserNewLicensePage';
import UserRegistrationPage from '@/components/forms/UserRegistrationPage';

// TODO: Wrap with <Suspense fallback={<LoadingScreen />}> and fetch the licensing data from LicenseSpring for Role.USER,
//  and pass that data to <ExistingUserNewLicensePage> or <UserRegistrationPage>. See ChatGPT conversation.
const RegistrationPage = async ({ searchParams }) => {
  const { token } = searchParams;

  const ret = await checkRegToken(token);
  if (ret.ts !== RegTokenState.Valid)
    notFound();

  switch (ret.role) {
    case Role.ADMIN:
      return <AdminRegistrationPage reglinkEmail={ret.email} />;

    case Role.USER:
      return ret.userExists
        ? <ExistingUserNewLicensePage email={ret.email} licenseId={ret.licenseId} />
        : <UserRegistrationPage email={ret.email} licenseId={ret.licenseId} firstName={ret.firstName} lastName={ret.lastName} />;

    default:
      notFound();
      return null;
  }
};


export default RegistrationPage;
