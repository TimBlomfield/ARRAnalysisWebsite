import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
// Components
import Loading from '@/components/help-center/Loading';


const routes = {
  '/help-center': dynamic(() => import('@/components/help-center/zz-pages/HelpCenter'), { loading: () => <Loading />}),
  '/help-center/purchasing-subscriptions': dynamic(() => import('@/components/help-center/zz-pages/PurchasingSubscriptions'), { loading: () => <Loading />}),
  '/help-center/admin-section': dynamic(() => import('@/components/help-center/zz-pages/AdminSection'), { loading: () => <Loading />}),
  '/help-center/admin-section/customer': dynamic(() => import('@/components/help-center/zz-pages/CustomerRole'), { loading: () => <Loading />}),
  '/help-center/admin-section/customer/assign-license-self': dynamic(() => import('@/components/help-center/zz-pages/AssignLicenseSelf'), { loading: () => <Loading />}),
  '/help-center/admin-section/customer/assign-license-other': dynamic(() => import('@/components/help-center/zz-pages/AssignLicenseOther'), { loading: () => <Loading />}),
  '/help-center/admin-section/customer/manage-license-users': dynamic(() => import('@/components/help-center/zz-pages/ManageLicenseUsers'), { loading: () => <Loading />}),
  '/help-center/admin-section/customer/subscriptions': dynamic(() => import('@/components/help-center/zz-pages/ManageSubscriptions'), { loading: () => <Loading />}),
  '/help-center/admin-section/user': dynamic(() => import('@/components/help-center/zz-pages/UserRole'), { loading: () => <Loading />}),
  '/help-center/admin-section/user/claim-license': dynamic(() => import('@/components/help-center/zz-pages/ClaimLicense'), { loading: () => <Loading />}),
  '/help-center/admin-section/installer': dynamic(() => import('@/components/help-center/zz-pages/Installer'), { loading: () => <Loading />}),
  '/help-center/admin-section/profile': dynamic(() => import('@/components/help-center/zz-pages/Profile'), { loading: () => <Loading />}),
  '/help-center/admin-section/purchase-more': dynamic(() => import('@/components/help-center/zz-pages/PurchaseMore'), { loading: () => <Loading />}),
  '/help-center/excel-addin': dynamic(() => import('@/components/help-center/zz-pages/ExcelAddin'), { loading: () => <Loading />}),
  '/help-center/excel-addin/activation': dynamic(() => import('@/components/help-center/zz-pages/ActivateExcelAddin'), { loading: () => <Loading />}),
  '/help-center/excel-addin/usage': dynamic(() => import('@/components/help-center/zz-pages/UseExcelAddin'), { loading: () => <Loading />}),
};


const HelpCenterPage = ({ params }) => {
  const slug = ['/help-center', ...(params?.slug ?? [])];
  const slugPath = slug.join('/');

  const Component = routes[slugPath];

  if (Component == null)
    notFound();

  return <Component />;
};


export default  HelpCenterPage;
