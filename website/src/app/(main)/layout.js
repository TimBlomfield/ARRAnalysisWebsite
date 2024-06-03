import { Inter } from 'next/font/google';
// Components
import Header from '@/components/Header';
// Styles
import 'normalize-css/normalize.css';
import 'reset-css/reset.css';


const inter = Inter({ subsets: ["latin-ext"] });


const MainLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
};


const metadata = {
  title: "ARR Analysis",
  description: "ARR Analysis",
  icons: {
    icon: {
      rel: 'icon',
      url: '/L8-favicon.png',
      type: 'image/png',
    },
  }
};


export default MainLayout;
export { metadata };
