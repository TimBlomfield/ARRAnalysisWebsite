'use client';

import { usePathname } from 'next/navigation';
// Components
import UploadOverview_HeaderExtra from '@/components/forms/UploadOverviewClientPage/UploadOverview_HeaderExtra';
import UploadVersions_HeaderExtra from '@/components/forms/UploadVersionsClientPage/UploadVersions_HeaderExtra';


const ExtraHeaderContent = () => {
  const pathname = usePathname();

  if (pathname === '/admin/upload/overview')
    return <UploadOverview_HeaderExtra />;

  if (pathname === '/admin/upload/versions')
    return <UploadVersions_HeaderExtra />;

  return null;
};


export default ExtraHeaderContent;
