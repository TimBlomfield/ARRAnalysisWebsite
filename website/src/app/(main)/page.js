import cn from 'classnames';
import Image from 'next/image';
import { K_Theme } from '@/utils/common';
// Components
import AnimateX from '@/components/AnimateX';
import LinkButton from '@/components/LinkButton';
import Footer from '@/components/Footer';
// Images
import imgQuart from '@/../public/Quarterly_Cohort-graph.jpg';
import imgArrWtfl from '@/../public/ARR_Waterfall-graph.jpg';
// Styles
import styles from './page.module.scss';


const LandingPage = () => {
  return (
    <AnimateX>
      <main className={styles.main}>
        <section className={styles.s1}>
          <div className={cn(styles.titleText, styles.mb10)} data-animated="text1">Automate your Revenue Analysis.</div>
          <div className={styles.titleText} data-animated="text1">Quickly, Acurately and Presentably</div>
          <div className={styles.spacer} />
          <div >
            <LinkButton theme={K_Theme.Light} href="/product" data-animated="text1" data-anim-delay=".5">
              Learn More
            </LinkButton>
          </div>
        </section>

        <section className={styles.s2}>
          <div className={cn(styles.part, styles.left)}>
            <div className={styles.txt1} data-animated="text1">Do you analyze recurring revenue?</div>
            <div className={styles.txt2} data-animated="text1">Generate your retention and churn analysis, cohort
              analysis, customer concentration, and ARR waterfalls with the click of a button
            </div>
          </div>
          <div className={cn(styles.part, styles.right)}>
            <Image alt="ARR Waterfall" src={imgArrWtfl} className={styles.img} data-animated="text1" />
          </div>
        </section>

        <section className={styles.s3}>
          <article className={styles.article} data-animated="text1">
            <p className={styles.title}>Save hours of time</p>
          </article>
          <article className={cn(styles.article, styles.f2)} data-animated="text1">
            <p className={cn(styles.text, styles.mt0)}>Are you a SaaS investor, SaaS CFO, or subscription revenue
              business owner that spends hours each month analyzing your recurring revenue? If so, our Excel add-in may
              be able to help you with some of your automated reporting.</p>
            <p className={styles.text}>Our Excel add-in automates your recurring revenue analysis, so you can make
              better decisions for your business, faster. Our add-in streamlines your analysis of recurring revenue and
              allows you to focus on growth, revenue and customer satisfaction.</p>
            <p className={styles.text}>With our add-in, you can conduct in-depth analyses, including:</p>
            <ul>
              <li>ARR analysis</li>
              <li>Retention analysis and churn analysis</li>
              <li>Cohort analysis</li>
              <li>ARR waterfalls (including by customer size and channel)</li>
            </ul>
            <p className={styles.text}>Our add-in simplifies your ARR analysis, allowing you to track your monthly,
              quarterly and yearly recurring revenue easily. You can analyze retention rates and take appropriate
              measures to retain customers, such as implementing customer loyalty programs or addressing customer
              concerns.</p>
          </article>
          <article className={cn(styles.article, styles.f2)} data-animated="text1">
            <p className={cn(styles.text, styles.mt0)}>With our add-in, you can also track churn rates, identify the
              customers who are at risk of leaving your business, and take steps to reduce customer churn. The tool also
              provides insights into customer lifetime value, helping you make informed decisions about pricing and
              promotions.</p>
            <p className={styles.text}>Cohort analysis is a powerful tool for understanding customer behavior over time.
              With our add-in, you can conduct cohort analysis to identify trends in customer behavior, such as churn
              rates, retention rates and revenue growth, and make data-driven decisions to improve your business.</p>
            <p className={styles.text}>Our ARR waterfall feature visually represents your monthly recurring revenue so
              that you can identify the drivers of revenue growth or decline. You can also see the impact of new sales,
              renewals, and churn on your monthly recurring revenue.</p>
            <p className={styles.text}>Our ARR waterfall-by-channel feature allows you to segment your revenue sources
              by channel so that you can see the impact of different marketing channels or customer segments on your
              revenue growth.</p>
          </article>
        </section>
        <section className={styles.s4}>
          <Image alt="Quarterly and Cohort" src={imgQuart} className={styles.img} priority data-animated="text1" />
        </section>
        <Footer />
      </main>
    </AnimateX>
  );
};


export default LandingPage;
