import { Inter } from 'next/font/google';
// Styles
import 'normalize-css/normalize.css';
import 'reset-css/reset.css';
import '@/styles/globals.scss';


const inter = Inter({ subsets: ['latin-ext'] });


const MainLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
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
