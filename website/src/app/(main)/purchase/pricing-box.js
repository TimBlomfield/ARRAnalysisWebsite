'use client';

import { useState } from 'react';
import MultiToggle from '@/components/MultiToggle';
import PushButton from '@/components/PushButton';
// Styles
import styles from './pricing-box.module.scss';


const PricingBox = ({ tier, animDelay = 0 }) => {
  const [sel, setSel] = useState(0);

  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className={styles.main} data-animated="text1" data-anim-delay={animDelay}>
      <MultiToggle selected={sel} options={['Monthly', 'Yearly']} onSelect={x => setSel(x)} />
      <div className={styles.title}>{tier.Desc}</div>
      <div className={styles.price}>{USDollar.format(sel === 0 ? tier.Prices.Monthly : tier.Prices.Yearly)}</div>
      <div className={styles.evry}>Every {sel === 0 ? 'month' : 'year'}</div>
      <PushButton onClick={() => {}}>Sign up</PushButton>
    </div>
  );
};


export default PricingBox;
