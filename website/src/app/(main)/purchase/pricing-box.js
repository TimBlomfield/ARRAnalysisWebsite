'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Components
import MultiToggle from '@/components/MultiToggle';
import PushButton from '@/components/PushButton';
// Styles
import styles from './pricing-box.module.scss';


const PricingBox = ({ tier, animDelay = 0 }) => {
  const router = useRouter();

  const [sel, setSel] = useState(0);

  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className={styles.main} data-animated="text1" data-anim-delay={animDelay}>
      <MultiToggle selected={sel} options={['Monthly', 'Yearly']} onSelect={x => setSel(x)} />
      <div className={styles.title}>{tier.Desc}</div>
      <div className={styles.price}>{USDollar.format((sel === 0 ? tier.Prices.Monthly : tier.Prices.Yearly) * 0.01)}</div>
      <div className={styles.evry}>Every {sel === 0 ? 'month' : 'year'}</div>
      <PushButton onClick={() => router.push(`/purchase/checkout?period=${window.btoa(sel === 0 ? 'Monthly' : 'Yearly')}&tier=${window.btoa(tier.Desc)}`)}>Sign up</PushButton>
    </div>
  );
};


export default PricingBox;
