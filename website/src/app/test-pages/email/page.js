import { notFound } from 'next/navigation';
import { checkToken, TokenState } from '@/utils/server/common';
// Components
import AdminRegisterPage from './admin-register';


const EmailPage = async ({ searchParams }) => {
  const { token } = searchParams;

  const ret = await checkToken(token);
  if (ret.ts !== TokenState.Valid)
    notFound();

  return (
    <AdminRegisterPage dbEmail={ret.email || ''} />
  );
};


export default EmailPage;
