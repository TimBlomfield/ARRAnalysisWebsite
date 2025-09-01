import Link from 'next/link';


const Company = ({ styles }) => (
  <div className={styles.company}>
    <strong>ARR Analysis, LLC</strong>
    <div className={styles.addr}>
      <div>Email:</div>
      <Link className={styles.link} href="mailto:contact@arr-analysis.com">contact@arr-analysis.com</Link>
      <div>Address:</div>
      <div>
        219 West 81st street<br />
        New york, New York, 10024<br />
        US
      </div>
      <div>Phone:</div>
      <Link className={styles.link} href="tel:+16468875681">+1 (646) 887-5681</Link>
    </div>
  </div>
);


export default Company;
