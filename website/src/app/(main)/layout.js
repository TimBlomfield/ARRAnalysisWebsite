import localFont from 'next/font/local';
import cn from 'classnames';
import { ToastContainer } from 'react-toastify';
// Components
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
    <html lang="en">
      <body className={cn(aspekta750.variable, aspekta250.variable, 'g_fontPrimary')}>
        <Header />
        {children}
        <ToastContainer position="bottom-left" stacked />
      </body>
    </html>
  );
};


const metadata = {
  title: 'ARR Analysis',
  description: 'ARR Analysis',
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
