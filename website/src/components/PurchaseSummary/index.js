import { TierNames } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const PurchaseSummary = ({ tier, licenses, period }) => {
  const arrTiers = TierNames.toArray();
  const clampedTier = tier < 0 ? 0 : tier > arrTiers.length - 1 ? arrTiers.length - 1 : tier;

  const txtLicenses = licenses == null || licenses === 1 ? '1 License' : `${licenses} Licenses`;

  return (
    <div className={styles.purchaseSummary}>
      <div className={styles.txtSummary}>Purchase Summary</div>
      <div className={styles.gridSummary}>
        <div className={styles.cell1}>
          <div className={styles.line1}>ARR Analysis Excel Add-in</div>
          <div className={styles.line2}>{arrTiers[clampedTier]}</div>
        </div>
        <div className={styles.cell2}>
          <div className={styles.txtAmount}>{txtLicenses}</div>
        </div>
        <div className={styles.cell1}>
          <div className={styles.txtSubsType}>Subscription Type</div>
        </div>
        <div className={styles.cell2}>
          <div className={styles.txtPeriod}>{period === 0 ? 'Monthly' : 'Yearly'}</div>
        </div>
      </div>
    </div>
  );
};


export default PurchaseSummary;
