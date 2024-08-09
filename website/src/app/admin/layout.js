import { Inter } from 'next/font/google';
import cn from 'classnames';
import { ToastContainer } from 'react-toastify';
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
      {children}
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
