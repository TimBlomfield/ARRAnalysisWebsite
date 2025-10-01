// Components
import PageSelector from '@/components/admin/PageSelector';
// Styles
import styles from './layout.module.scss';


const tabs = [
  {
    name: 'Overview',
    url: '/admin/upload/overview',
  },
  {
    name: 'Versions',
    url: '/admin/upload/versions',
  },
];


const HelpCenterLayout = ({ children }) => (
  <div className={styles.main}>
    <PageSelector tabs={tabs} />
    <div className={styles.content}>
      {children}
    </div>
  </div>
);


export default HelpCenterLayout;
