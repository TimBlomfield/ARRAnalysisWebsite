import { notFound } from 'next/navigation';
import { TierNames } from '@/utils/common';
import CheckLoggedIn from '@/utils/server/logged-in-check';
import { compareVersions, listAllFiles } from '@/utils/server/s3';
// Components
import UploadVersionsClientPage from '@/components/forms/UploadVersionsClientPage';


const VersionsPage = async () => {
  await CheckLoggedIn(true);

  let files;
  let versions;
  const foulNames = [];
  const versionKeys = {};

  try {
    files = await listAllFiles(process.env.CLOUDCUBE_TOP_FOLDER);
    files.sort((a, b) => a.name.localeCompare(b.name));

    const prefix = `${process.env.CLOUDCUBE_TOP_FOLDER || 'Error'}${process.env.CLOUDCUBE_INSTALLS_FOLDER || 'Error'}`;
    files = files.reduce((acc, file) => {
      if (file.name.startsWith(prefix))
        acc.push(file);
      return acc;
    }, []);

    const fileNames = TierNames.toArray().map(name => `${name}.exe`);
    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      const parts = file.name.split('/');
      if (parts.length === 5 && ['tier01', 'tier02', 'tier03'].includes(parts[3]) && fileNames.includes(parts[4])) {
        if (versionKeys[parts[2]] == null)
          versionKeys[parts[2]] = [{ idx, tier: parts[3], fileName: parts[4], tierName: TierNames.toArray()[fileNames.indexOf(parts[4])] }];
        else
          versionKeys[parts[2]].push({ idx, tier: parts[3], fileName: parts[4], tierName: TierNames.toArray()[fileNames.indexOf(parts[4])] });
      } else
        foulNames.push(file.name);
    }

    versions = Object.keys(versionKeys);
    versions.sort((a, b) => compareVersions(b, a));
  } catch (err) {
    console.error('Error listing objects: ', err);
    notFound();
  }

  return <UploadVersionsClientPage files={files}
                                   versions={versions}
                                   versionKeys={versionKeys}
                                   foulNames={foulNames}
                                   topFolder={process.env.CLOUDCUBE_TOP_FOLDER || 'Error'}
                                   installsFolder={process.env.CLOUDCUBE_INSTALLS_FOLDER || 'Error'} />;
};


export default VersionsPage;
