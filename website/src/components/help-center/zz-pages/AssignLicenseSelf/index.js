import { HelpPageIndex, helpPages } from '@/utils/help-pages';
// Components
import AssignLicenseSelfClient from './AssignLicenseSelfClient';


const AssignLicenseSelfPage = () => {
  const arrLinks = [
    helpPages.indexer[HelpPageIndex.Installer],
    helpPages.indexer[HelpPageIndex.AddInActivation],
  ];

  return <AssignLicenseSelfClient links={arrLinks} />;
};


export default AssignLicenseSelfPage;
