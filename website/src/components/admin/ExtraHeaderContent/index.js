'use client';

import { usePathname } from 'next/navigation';
// Components
import UploadOverview_HeaderExtra from '@/components/forms/UploadOverviewClientPage/UploadOverview_HeaderExtra';


const ExtraHeaderContent = () => {
  const pathname = usePathname();

  if (pathname === '/admin/upload/overview')
    return <UploadOverview_HeaderExtra />;

  return null;
};


export default ExtraHeaderContent;
