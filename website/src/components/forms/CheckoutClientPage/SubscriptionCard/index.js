'use client';

import cn from 'classnames';
// Components
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';
import PlusMinusButton from '@/components/PlusMinusButton';


const SubscriptionCard = ({ selected, onSelect, tier, processing, licenceCount, setLicenseCount = null, monthly = false }) => {
  return (
    <div className={cn(styles.main, {[styles.selected]: selected})}>
      <div className={styles.title}>{tier.Desc}</div>
      <div className={styles.price}>${(monthly ? tier.Prices.Monthly : tier.Prices.Yearly) / 100}
        <span className={styles.per}>&nbsp;/&nbsp;{monthly ? 'month' : 'year'}</span>
      </div>
      <div className={styles.line} />
      {(setLicenseCount === null || !selected) &&
        <PushButton extraClass={styles.pbXtra}
                    disabled={selected || processing}
                    onClick={onSelect}>
          {selected ? 'Selected' : 'Select'}
        </PushButton>
      }
      {setLicenseCount !== null && selected &&
        <div className={styles.licenses}>
          <div className={styles.c1}>
            <div className={styles.txt}>{licenceCount}</div>
            <div className={styles.txt}>{licenceCount === 1 ? 'license' : 'licenses'}</div>
          </div>
          <div className={styles.c2}>
            <PlusMinusButton extraBtnClass={styles.xtraBtn}
                             onMore={() => setLicenseCount(prev => prev < 300 ? prev + 1 : 300)}
                             onLess={() => setLicenseCount(prev => prev > 1 ? prev - 1 : 1)} />
          </div>
        </div>
      }
    </div>
  );
};


export default SubscriptionCard;
