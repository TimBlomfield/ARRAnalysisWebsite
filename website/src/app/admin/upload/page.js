import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getACU_Ids, isAuthTokenValid } from '@/utils/server/common';
import { authOptions } from '@/utils/server/auth';


const UploadPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  const acuIds = await getACU_Ids(token.email);
  if (acuIds?.adminId == null)
    notFound();

  redirect('/admin/upload/overview');
};


export default UploadPage;
