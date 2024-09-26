import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
// Styles
import 'normalize-css/normalize.css';
import 'reset-css/reset.css';
import 'react-toastify/dist/ReactToastify.min.css';


const inter = Inter({ subsets: ['latin-ext'] });


const MainLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
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
