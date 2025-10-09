import { notFound } from 'next/navigation';
import CheckLoggedIn from '@/utils/server/logged-in-check';
import { listAllFiles } from '@/utils/server/s3';
// Components
import UploadOverviewClientPage from '@/components/forms/UploadOverviewClientPage';


const OverviewPage = async () => {
  await CheckLoggedIn(true);

  let files;
  try {
    files = await listAllFiles(process.env.CLOUDCUBE_TOP_FOLDER);
    files.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error('Error listing objects: ', err);
    notFound();
  }

  return <UploadOverviewClientPage files={files}
                                   topFolder={process.env.CLOUDCUBE_TOP_FOLDER || 'Error'}
                                   installsFolder={process.env.CLOUDCUBE_INSTALLS_FOLDER || 'Error'} />;
};


export default OverviewPage;
