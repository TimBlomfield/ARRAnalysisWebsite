import { notFound } from 'next/navigation';
import { checkToken, TokenState } from '@/utils/server/common';
// Components
import PortalRegistrationPage from '@/components/forms/PortalRegistrationPage';


const EmailPage = async ({ searchParams }) => {
  const { token } = searchParams;

  const ret = await checkToken(token);
  if (ret.ts !== TokenState.Valid)
    notFound();

  return <PortalRegistrationPage dbEmail={ret.email || ''} roleStr={ret.roleStr} />;
};


export default EmailPage;
