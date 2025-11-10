import localFont from 'next/font/local';
import cn from 'classnames';
import { ToastContainer } from 'react-toastify';
// Components
import CookiebotManager from '@/components/CookiebotManager';
import Header from '@/components/Header';
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
    <body className={cn(aspekta750.variable, aspekta250.variable, 'g_fontPrimary')}>
      <Header />
      {children}
      <ToastContainer position="bottom-left" stacked />
      <CookiebotManager domainGroupId={process.env.COOKIEBOT_DOMAIN_GROUP_ID} isLocal={process.env.K_ENVIRONMENT === 'Local'} />
    </body>
  );
};


export default MainLayout;
