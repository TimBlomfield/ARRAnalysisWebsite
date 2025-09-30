import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import axios from 'axios';
import { getACU_Ids, isAuthTokenValid } from '@/utils/server/common';
import { authOptions } from '@/utils/server/auth';
import { listFiles } from '@/utils/server/s3';
import db from '@/utils/server/db';
// Components
import DownloadFilesPage from '@/components/forms/DownloadFilesPage';


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

  return (
    <div>
      Uploads
    </div>
  );
};


export default UploadPage;
