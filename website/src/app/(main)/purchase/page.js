import { getPricingTiers } from '@/utils/server/prices';
import { notFound } from 'next/navigation';
// Components
import AnimateX from '@/components/AnimateX';
import Footer from '@/components/Footer';
import Pricing from './Pricing';
// Styles
import styles from './page.module.scss';


const PurchasePage = async () => {
  const tiers = await getPricingTiers();
  if (!tiers)
    notFound();

  return (
    <AnimateX>
      <main>

        <Pricing tiers={tiers} />

        <section className={styles.s2}>
          <div className={styles.inner}>
            <div className={styles.titleq} data-animated="text1">What people are saying</div>
            <div className={styles.saying}>
              <div className={styles.single} data-animated="text1">
                <div className={styles.say}>“This has probably saved me 100 hours in the past three months. The best
                  tool I use.”
                </div>
                <div className={styles.who}>— Analyst, Leading Growth Equity Firm</div>
              </div>
              <div className={styles.single} data-animated="text1" data-anim-delay="0.2">
                <div className={styles.say}>“This is now our firm standard. The tool generates analysis we hadn’t
                  previously considered when assessing investments.”
                </div>
                <div className={styles.who}>— Partner, Leading Software Private Equity Firm</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.s3}></section>

        <Footer />
      </main>
    </AnimateX>
  );
};


// Force dynamic rendering for this page (resolves FOUC)
export const dynamic = 'force-dynamic';
export default PurchasePage;
