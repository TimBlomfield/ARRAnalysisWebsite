import { HelpPageIndex, helpPages } from '@/utils/help-pages';
// Components
import ClaimLicenseClient from './ClaimLicenseClient';


const ClaimLicensePage = () => {
  const arrLinks = [
    helpPages.indexer[HelpPageIndex.Installer],
    helpPages.indexer[HelpPageIndex.AddInActivation],
  ];

  return <ClaimLicenseClient links={arrLinks} />;
};


export default ClaimLicensePage;
