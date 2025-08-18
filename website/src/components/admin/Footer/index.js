import cn from 'classnames';
import Link from 'next/link';
import { DateTime } from 'luxon';
// Styles
import styles from './styles.module.scss';


const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.copyright}>© {DateTime.now().year} ARR Analysis</div>
      <div className={styles.spacer} />
      <Link href="/help-center" className={cn(styles.link, styles.mr16)}>Help Center</Link>
      <Link href="/privacy" className={cn(styles.link, styles.mr16)}>Privacy Policy</Link>
      <Link href="/terms" className={styles.link}>Terms of Use</Link>
    </div>
  );
};


export default Footer;
