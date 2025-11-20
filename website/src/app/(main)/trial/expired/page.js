// Components
import AnimateX from '@/components/AnimateX';
import Footer from '@/components/Footer';
import LinkButton from '@/components/LinkButton';
// Styles
import styles from './page.module.scss';


const TrialExpiredPage = ({ searchParams }) => {
  const { email } = searchParams;
  return (
    <AnimateX>
      <div className={styles.main}>
        <section className={styles.titleArea}>
          <div className={styles.title}>Trial Expired</div>
        </section>
        <section className={styles.s1}>
          <div className={styles.txtExpired}>Your Free Trial Has Expired</div>
          <p>A trial has already been used with this email address: <em>{email}</em></p>
          <p>Thanks for trying our product! Your trial period has ended, but the journey doesn&apos;t have to stop
            here.</p>
          <div className={styles.txtContinue}>Continue enjoying these features:</div>
          <div className={styles.benefits}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitText}>Full access to all premium features</div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitText}>Priority customer support</div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitText}>Regular updates and improvements</div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitText}>No limitations or restrictions</div>
            </div>
          </div>
          <LinkButton href="/purchase" extraClass={styles.lnk}>
            View Pricing & Subscribe
          </LinkButton>
        </section>
      </div>
      <Footer />
    </AnimateX>
  );
};


export default TrialExpiredPage;
