'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
// Components
import AnimateX from '@/components/AnimateX';
import Footer from '@/components/Footer';
// Styles
import styles from './styles.module.scss';


const CheckInbox = () => {
  const searchParams = useSearchParams();

  const email = searchParams.get('email');

  return (
    <AnimateX>
      <div className={styles.main}>
        <section className={styles.titleArea}>
          <div className={styles.title}>Free Trial</div>
        </section>
        <section className={styles.s1}>
          <div className={styles.txtCheck}>Please check your inbox</div>
          <p>
            <span className={styles.txtDesc}>Thank you for your request. We have sent an email to <strong>{email}</strong> with further information</span>
          </p>
          <p>
            <span className={styles.txtDesc}>If you do not receive this email within 30 minutes please make sure that it has not been filtered by your spam protection system. In case it has been filtered, please add <em>&ldquo;support-team@dev.arr-analysis.com&rdquo;</em> to your white list and <Link href="/trial" className={styles.link}>post your request again</Link>.</span>
          </p>
        </section>
      </div>
      <Footer />
    </AnimateX>
  );
};


export default CheckInbox;
