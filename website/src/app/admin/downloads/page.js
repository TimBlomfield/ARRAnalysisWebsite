import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { isAuthTokenValid } from '@/utils/server/common';
import { authOptions } from '@/utils/server/auth';
import { listFiles } from '@/utils/server/s3';
// Components
import DownloadFilesPage from '@/components/forms/DownloadFilesPage';


const DownloadsPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  let files;
  try {
    files = await listFiles(`${process.env.CLOUDCUBE_TOP_FOLDER}installers/`);
  } catch (err) {
    console.error('Error listing objects: ', err);
    notFound();
  }


  return <DownloadFilesPage files={files} />;
};


export default DownloadsPage;
