// Components
import Footer from '@/components/admin/Footer';
// Styles
import styles from './styles.module.scss';


const DashboardPage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.dashboard}>
        <div className={styles.tempText}>Dashboard Page</div>
      </div>
      <Footer />
    </div>
  );
};


export default DashboardPage;
