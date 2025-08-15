
import Link from 'next/link';
import { DateTime } from 'luxon';
// Images
import LogoWhiteSvg from '@/../public/logo-white.svg';
// Styles
import styles from './styles.module.scss';


// Note: Unlike the <Header/> component, this component is not placed in the layout.js file.
// This is because the loading page looks better without the footer, and also the footer can be animated.
const Footer = () => {
  return (
    <div className={styles.footer}>
      <LogoWhiteSvg className={styles.logo} data-animated="elasticFadeIn" data-anim-delay="0.2" />
      <div className={styles.links1}>
        <Link href="/help-center" className={styles.link} data-animated="text1" data-anim-delay="0.3">Help Center</Link>
        <Link href="/contact" className={styles.link} data-animated="text1" data-anim-delay="0.4">Contact Us</Link>
      </div>
      <div className={styles.footerDivider} />
      <div className={styles.links2}>
        <div className={styles.copyright} data-animated="text1" data-anim-delay="0.5">© {DateTime.now().year} <span className={styles.company}>ARR Analysis</span></div>
        <Link href="/privacy" className={styles.link} data-animated="text1" data-anim-delay="0.6">Privacy Policy</Link>
        <Link href="/terms" className={styles.link} data-animated="text1" data-anim-delay="0.7">Terms of Use</Link>
      </div>
    </div>
  );
};


export default Footer;
