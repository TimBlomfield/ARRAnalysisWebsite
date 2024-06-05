import { Inter } from 'next/font/google';
// Styles
import 'normalize-css/normalize.css';
import 'reset-css/reset.css';


const inter = Inter({ subsets: ['latin-ext'] });


const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
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
      url: '/L8-favicon.png',
      type: 'image/png',
    },
  },
};


export default RootLayout;
export { metadata };
