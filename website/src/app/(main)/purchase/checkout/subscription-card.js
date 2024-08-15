'use client';

import cn from 'classnames';
// Components
import PushButton from '@/components/PushButton';
// Styles
import styles from './subscription-card.module.scss';


const SubscriptionCard = ({ selected, onSelect, tier, monthly = false }) => {
  return (
    <div className={cn(styles.main, {[styles.selected]: selected})}>
      <div className={styles.title}>{tier.Desc}</div>
      <div className={styles.price}>${monthly ? tier.Prices.Monthly : tier.Prices.Yearly}
        <span className={styles.per}>&nbsp;/&nbsp;{monthly ? 'month' : 'year'}</span>
      </div>
      <div className={styles.line} />
      <PushButton extraClass={styles.pbXtra}
                  disabled={selected}
                  onClick={onSelect}>
        {selected ? 'Selected' : 'Select'}
      </PushButton>
    </div>
  );
};


export default SubscriptionCard;
