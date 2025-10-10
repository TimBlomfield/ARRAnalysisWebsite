'use client';

import { useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import { TierNames } from '@/utils/common';
// Components
import MultiToggle from '@/components/MultiToggle';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const mtOptions = ['Monthly', 'Yearly'];


const Pricing = ({ tiers }) => {
  const router = useRouter();

  const [period, setPeriod] = useState(0);

  return (
    <section className={styles.main}>
      <div className={styles.vflex}>
        <div className={styles.title} data-animated="text1">ARR Analysis Add-in</div>
        <div className={styles.subtitle} data-animated="text1" data-anim-delay=".2">Choose the perfect plan for your analysis needs</div>
        <div className={styles.mtWrap} data-animated="text1" data-anim-delay=".3">
          <MultiToggle extraClass={styles.multiToggleExtra}
                       options={mtOptions}
                       selected={period}
                       onSelect={setPeriod} />
        </div>
        <div className={styles.grid}>
          <div className={styles.pbox} data-animated="text1" data-anim-delay={.4}>
            <div className={styles.tierName}>Basic</div>
            <div className={styles.tierDesc}>Perfect for individuals getting started with ARR analysis and basic reporting needs.</div>
            <div className={styles.priceContainer}>
              <span className={styles.price}>${tiers.One.Prices[period === 0 ? 'Monthly' : 'Yearly'] / 100}</span>
              <span className={styles.period}>/ {period === 0 ? 'month' : 'year'}</span>
            </div>
            <ul className={styles.features}>
              <li>Core ARR analysis (monthly, quarterly, annual)</li>
              <li>Upsell, downsell, churn and net-new ARR tracking</li>
              <li>Customer rankings and cohort overviews</li>
              <li>ARR waterfall generation (time-based, logos, bookings, churn)</li>
              <li>Rolling Monthly, Quarterly, TTM ARR trends with automatic chart outputs</li>
            </ul>
            <div className={styles.spacer} />
            <PushButton extraClass={styles.btn}
                        onClick={() => router.push(`/purchase/checkout?period=${window.btoa(period === 0 ? 'Monthly' : 'Yearly')}&tier=${window.btoa(TierNames.Basic)}`)}>
              Buy Now
            </PushButton>
          </div>
          <div className={cn(styles.pbox, styles.featured)} data-animated="text1" data-anim-delay={.6}>
            <div className={styles.tierName}>SaaS Analyst</div>
            <div className={styles.tierDesc}>Ideal for SaaS professionals who need advanced analytics and cohort analysis capabilities.</div>
            <div className={styles.priceContainer}>
              <span className={styles.price}>${tiers.Two.Prices[period === 0 ? 'Monthly' : 'Yearly'] / 100}</span>
              <span className={styles.period}>/ {period === 0 ? 'month' : 'year'}</span>
            </div>
            <ul className={styles.features}>
              <li>Everything in Basic</li>
              <li>Detailed quarterly cohort analytics</li>
              <li>Customer size distribution tables and histograms</li>
              <li>Churn by tenure tables and charts</li>
              <li>Enhanced visualizations for ARR growth and retention metrics</li>
            </ul>
            <div className={styles.spacer} />
            <PushButton extraClass={styles.btn}
                        onClick={() => router.push(`/purchase/checkout?period=${window.btoa(period === 0 ? 'Monthly' : 'Yearly')}&tier=${window.btoa(TierNames.SaaSAnalyst)}`)}>
              Buy Now
            </PushButton>
          </div>
          <div className={styles.pbox} data-animated="text1" data-anim-delay={.8}>
            <div className={styles.tierName}>Full Stack Analyst</div>
            <div className={styles.tierDesc}>Complete analytics suite for teams requiring comprehensive insights and advanced integrations.</div>
            <div className={styles.priceContainer}>
              <span className={styles.price}>${tiers.Three.Prices[period === 0 ? 'Monthly' : 'Yearly'] / 100}</span>
              <span className={styles.period}>/ {period === 0 ? 'month' : 'year'}</span>
            </div>
            <ul className={styles.features}>
              <li>Everything in SaaS Analyst</li>
              <li>Top churn analysis (customers, $ size, tenure)</li>
              <li>Unit economics (LTV, CAC, margins)</li>
              <li>Segment-level ARR waterfalls (by industry, region, product, etc.)</li>
              <li>ARR and logo distribution by customer size buckets</li>
              <li>Automated presentation and proofing tools (PowerPoint export)</li>
            </ul>
            <div className={styles.spacer} />
            <PushButton extraClass={styles.btn}
                        onClick={() => router.push(`/purchase/checkout?period=${window.btoa(period === 0 ? 'Monthly' : 'Yearly')}&tier=${window.btoa(TierNames.FullStackAnalyst)}`)}>
              Buy Now
            </PushButton>
          </div>
        </div>
      </div>
    </section>
  );
};


export default Pricing;
