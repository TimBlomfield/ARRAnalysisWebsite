import localFont from 'next/font/local';
import dynamic from 'next/dynamic';
import cn from 'classnames';
import { ToastContainer } from 'react-toastify';
import { PORTAL_ID_MENU } from '@/utils/common';
// Components
const ScrollbarClientStyles = dynamic(() => import('@/components/admin/ScrollbarClientStyles'), { ssr: false });
// Styles
import 'normalize-css/normalize.css';
import 'reset-css/reset.css';
import '@/styles/globals.scss';


const aspekta750 = localFont({
  src: '../../../public/font/Aspekta-750.woff2',
  variable: '--font-aspekta-750',
  preload: true,
});

const aspekta250 = localFont({
  src: '../../../public/font/Aspekta-250.woff2',
  variable: '--font-aspekta-250',
  preload: true,
});


const MainLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={cn(aspekta750.variable, aspekta250.variable, 'g_fontPrimary')}>
        <ScrollbarClientStyles />
        {children}
        <ToastContainer position="bottom-left" stacked />
        <div style={{ width: 0, height: 0 }} id={PORTAL_ID_MENU} />
      </body>
    </html>
  );
};


const metadata = {
  title: 'Test Pages',
  description: 'ARR Analysis - Test Pages',
  icons: {
    icon: {
      rel: 'icon',
      url: '/arr-analysis.ico',
      type: 'image/x-icon',
    },
  },
};


export default MainLayout;
export { metadata };
