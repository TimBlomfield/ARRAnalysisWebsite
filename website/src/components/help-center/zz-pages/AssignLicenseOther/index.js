import { HelpPageIndex, helpPages } from '@/utils/help-pages';
// Components
import AssignLicenseOtherClient from './AssignLicenseOtherClient';


const AssignLicenseOtherPage = () => {
  const arrLinks = [
    helpPages.indexer[HelpPageIndex.UserRole],
    helpPages.indexer[HelpPageIndex.ClaimLicense],
  ];

  return <AssignLicenseOtherClient links={arrLinks} />;
};


export default AssignLicenseOtherPage;
