import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import axios from 'axios';
import db from '@/utils/server/db';
import { isAuthTokenValid } from '@/utils/server/common';
import { authOptions } from '@/utils/server/auth';
import { ListFiles } from '@/utils/server/s3';
// Components
import UserLicenseItem from '@/components/UserLicenseItem';
// Styles
import styles from '@/app/admin/licenses/styles.module.scss';


const DownloadsPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  const files = await ListFiles(`${process.env.CLOUDCUBE_TOP_FOLDER}installers/`);
  console.log(files);

  return (<div>Downloads</div>);
};


export default DownloadsPage;
