import localFont from 'next/font/local';
import cn from 'classnames';
import { ToastContainer } from 'react-toastify';
// Styles
import 'normalize-css/normalize.css';
import 'reset-css/reset.css';
import 'react-toastify/dist/ReactToastify.min.css';
import '@/styles/globals.scss';


const aspekta750 = localFont({
  src: '../../../public/font/Aspekta-750.woff2',
  variable: '--font-aspekta-750',
  preload: true,
})

const aspekta250 = localFont({
  src: '../../../public/font/Aspekta-250.woff2',
  variable: '--font-aspekta-250',
  preload: true,
})


const MainLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={cn(aspekta750.variable, aspekta250.variable, 'g_fontPrimary')}>
        {children}
        <ToastContainer position="bottom-left" stacked />
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
      url: '/L8-favicon.png',
      type: 'image/png',
    },
  },
};


export default MainLayout;
export { metadata };
