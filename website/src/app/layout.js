// Note: visiting /login/not-found or /test-pages/not-found or /admin/not-found produce an error unless this file is present


const MainLayout = ({ children }) => {
  return (
    <html lang="en">
      {children}
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
