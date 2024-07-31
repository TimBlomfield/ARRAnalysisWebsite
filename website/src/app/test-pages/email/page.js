import { notFound } from 'next/navigation';
import db from '@/utils/db';
// Components
import AdminRegisterPage from './admin-register';


const EmailPage = async ({ searchParams }) => {
  const { token } = searchParams;

  if (token == null) notFound();

  const regLink = await db.adminRegistrationLink.findUnique({
    where: { token },
  });
  if (regLink == null || regLink.expiresAt <= new Date()) {
    if (regLink != null) {
      await db.adminRegistrationLink.delete({
        where: { id: regLink.id },
      });
    }
    notFound();
  }

  console.log(regLink);

  return (
    <AdminRegisterPage dbEmail={regLink.email || ''} />
  );
};


export default EmailPage;
