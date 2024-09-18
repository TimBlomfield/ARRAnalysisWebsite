import { Inter } from 'next/font/google';
import cn from 'classnames';
import { ToastContainer } from 'react-toastify';
import dynamic from 'next/dynamic';
// Components
import Header from '@/components/admin/Header';
import NavigationBar from '@/components/admin/NavigationBar';
const ScrollbarClientStyles = dynamic(() => import('@/components/admin/ScrollbarClientStyles'), { ssr: false });
// Styles
import 'normalize-css/normalize.css';
import 'reset-css/reset.css';
import 'react-toastify/dist/ReactToastify.min.css';
import styles from './layout.module.scss';


const inter = Inter({ subsets: ['latin-ext'] });


const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={cn(inter.className, styles.layoutBody)}>
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
      url: '/L8-favicon.png',
      type: 'image/png',
    },
  },
};


export default RootLayout;
export { metadata };
