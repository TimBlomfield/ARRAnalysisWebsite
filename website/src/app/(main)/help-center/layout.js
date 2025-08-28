// Components
import AnimateX from '@/components/AnimateX';
import Breadcrumbs from '@/components/help-center/Breadcrumbs';
import Footer from '@/components/Footer';
import TableOfContents from '@/components/help-center/TableOfContents';
// Styles
import styles from './layout.module.scss';


const HelpCenterLayout = ({ children }) => (
  <div className={styles.main}>
    <div className={styles.titleArea}>
      <div className={styles.title}>Help Center</div>
    </div>
    <div className={styles.contentArea}>
      <div className={styles.content}>
        <Breadcrumbs />
        <div className={styles.book}>
          <div className={styles.toc}>
            <TableOfContents />
          </div>
          <div className={styles.contents}>
            {children}
          </div>
        </div>
      </div>
    </div>
    <AnimateX>
      <Footer />
    </AnimateX>
  </div>
);


export default HelpCenterLayout;
