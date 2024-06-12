import Image from 'next/image';
import AnimateX from '@/components/AnimateX';
import LinkButton from '@/components/LinkButton';
import SubmitForm from './submit-form';
import { K_Theme } from '@/utils/common';
// Images
import imgCol1 from '@/../public/ACV-over-time.jpg';
import imgCol2 from '@/../public/Cohort-analysis.jpg';
import imgCol3 from '@/../public/Rolling-unit-economics.jpg';
// Styles
import styles from './page.module.scss';


const ProductPage = () => {
  return (
    <AnimateX>
      <main className={styles.main}>
        <section className={styles.s1}>
          <div className={styles.centrer}>
            <div className={styles.titleText} data-animated="text1">For SaaS Investors, Software Executives, or anyone
              who works with subscription revenue analysis. The ARR Analysis Excel Plug-in reduces time in spreadsheets
              and helps you focus on what matters
            </div>
            <div className={styles.spacer} />
            <div data-animated="text1" data-anim-delay=".5">
              <LinkButton theme={K_Theme.Light} href="/purchase">
                Try it out
              </LinkButton>
            </div>
          </div>
        </section>

        <section className={styles.s2}>
          <div className={styles.centrer}>
            <div className={styles.titleText} data-animated="text1">All your revenue analysis requirements, automated, and in one place.</div>
            <div className={styles.grid}>
              <div className={styles.imgDesc} data-animated="text1">
                <Image alt="ACV Over Time" src={imgCol1} className={styles.img} priority />
                <div className={styles.desc}>ACV Over Time</div>
              </div>
              <div className={styles.imgDesc} data-animated="text1" data-anim-delay="0.2">
                <Image alt="Cohort Analysis" src={imgCol2} className={styles.img} priority />
                <div className={styles.desc}>Cohort Analysis</div>
              </div>
              <div className={styles.imgDesc} data-animated="text1" data-anim-delay="0.4">
                <Image alt="Rolling Unit Economics" src={imgCol3} className={styles.img} />
                <div className={styles.desc}>Rolling Unit Economics</div>
              </div>
            </div>
            <div className={styles.vesaire} data-animated="text1">And so much more</div>
          </div>
        </section>

        <section className={styles.s3}>
          <SubmitForm />
        </section>
      </main>
    </AnimateX>
  );
};


export default ProductPage;
