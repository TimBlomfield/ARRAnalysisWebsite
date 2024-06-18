// Styles
import styles from './styles.module.scss';

const LabelReq = ({ text = '' }) => {
  return (
    <>
      <div className={styles.lblMr}>{text}</div>
      <div className={styles.lblClr}>(required)</div>
    </>
  );
};


export default LabelReq;
