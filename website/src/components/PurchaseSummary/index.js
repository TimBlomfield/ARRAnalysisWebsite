// Styles
import styles from './styles.module.scss';


const PurchaseSummary = ({ tier, licenses, period }) => {
  const tierDesc = tier === 0
    ? 'Basic'
    : tier === 1 ? 'Intermediate' : 'Advanced';

  const txtLicenses = licenses == null || licenses === 1 ? '1 License' : `${licenses} Licenses`;

  return (
    <div className={styles.purchaseSummary}>
      <div className={styles.txtSummary}>Purchase Summary</div>
      <div className={styles.gridSummary}>
        <div className={styles.cell1}>
          <div className={styles.line1}>ARR Analysis Excel Add-in</div>
          <div className={styles.line2}>Tier {tier + 1}&nbsp;&nbsp;&nbsp;({tierDesc})</div>
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
