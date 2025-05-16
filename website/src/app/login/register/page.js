import { notFound } from 'next/navigation';
import { checkRegToken, RegTokenState } from '@/utils/server/common';
import { Role } from '@prisma/client';
import { getLicenseData } from '@/utils/server/licenses';
// Components
import AdminRegistrationPage from '@/components/forms/AdminRegistrationPage';
import UserRegistrationPage from '@/components/forms/UserRegistrationPage';


const RegistrationPage = async ({ searchParams }) => {
  const { token } = searchParams;

  const ret = await checkRegToken(token);
  if (ret.ts !== RegTokenState.Valid)
    notFound();

  switch (ret.role) {
    case Role.ADMIN:
      return <AdminRegistrationPage reglinkEmail={ret.email} />;

    case Role.USER:
      if (ret.userExists) // User must not exist
        notFound();
      const ld = await getLicenseData(ret.userData?.licenseId);
      if (ld == null)
        notFound();
      return <UserRegistrationPage email={ret.email} licenseData={ld} />;

    default:
      notFound();
      return null;
  }
};


export default RegistrationPage;
