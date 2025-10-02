import { redirect } from 'next/navigation';
import CheckLoggedIn from '@/utils/server/logged-in-check';


const UploadPage = async () => {
  await CheckLoggedIn(true);

  redirect('/admin/upload/overview');
};


export default UploadPage;
