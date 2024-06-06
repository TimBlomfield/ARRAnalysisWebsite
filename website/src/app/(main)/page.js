import cn from 'classnames';
import LinkButton from '@/components/LinkButton';
import { LinkButton_Theme } from '@/utils/common';
// Styles
import styles from './page.module.scss';


const LandingPage = () => {
  return (
    <main className={styles.main}>
      {/*Array.from({ length: 25 }).map((item, idx) =>
        <div className={styles.item} key={idx}>
          <div>Sample item #{idx}</div>
          <LinkButton theme={idx % 2 === 0 ? LinkButton_Theme.Dark : LinkButton_Theme.Light} href="/product">Learn More</LinkButton>
        </div>
      )*/}
      <section className={styles.s1}>
        <div className={cn(styles.titleText, styles.mb10)}>Automate your Revenue Analysis.</div>
        <div className={styles.titleText}>Quickly, Acurately and Presentably</div>
        <div className={styles.spacer} />
        <LinkButton theme={LinkButton_Theme.Light} href="/about">Learn More</LinkButton>
      </section>

      <section className={styles.s2}>
        <div className={cn(styles.part, styles.left)}>
          <div className={styles.txt1}>Do you analyze recurring revenue?</div>
          <div className={styles.txt2}>Generate your retention and churn analysis, cohort analysis, customer concentration, and ARR waterfalls with the click of a button</div>
        </div>
        <div className={cn(styles.part, styles.right)}>
          <img src="/ARR_Waterfall-graph.jpg" />
        </div>
      </section>

      <section className={styles.s3}>
        <article className={styles.article}/>
        <div className={styles.group}>
          <article className={styles.article}/>
          <article className={styles.article}/>
        </div>
      </section>
    </main>
  );
};


export default LandingPage;
