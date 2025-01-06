import localFont from 'next/font/local';
import dynamic from 'next/dynamic';
import cn from 'classnames';
import { ToastContainer } from 'react-toastify';
// Components
import Header from '@/components/admin/Header';
import NavigationBar from '@/components/admin/NavigationBar';
const ScrollbarClientStyles = dynamic(() => import('@/components/admin/ScrollbarClientStyles'), { ssr: false });
// Styles
import 'normalize-css/normalize.css';
import 'reset-css/reset.css';
import 'react-toastify/dist/ReactToastify.min.css';
import '@/styles/globals.scss';
import styles from './layout.module.scss';


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


const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={cn(aspekta750.variable, aspekta250.variable, 'g_fontPrimary', styles.layoutBody)}>
        <ScrollbarClientStyles />
        <NavigationBar />
        <div className={styles.viewWithHeader}>
          <Header />
          <div className={styles.mainView}>
            {children}
          </div>
        </div>
        <ToastContainer position="bottom-left" stacked />
      </body>
    </html>
  );
};


const metadata = {
  title: 'ARR Analysis',
  description: 'ARR Analysis - Admin Section',
  icons: {
    icon: {
      rel: 'icon',
      url: '/arr-analysis.ico',
      type: 'image/x-icon',
    },
  },
};


export default RootLayout;
export { metadata };
