'use client';

import styles from './styles.module.scss';


const CheckBox = ({checked = false, setChecked, text = ''}) => (
  <label className={styles.checkbox}>
    <input type="checkbox"
           className={styles.inputCb}
           checked={checked}
           onChange={e => setChecked(e.target.checked)} />
    <div className={styles.textCb}>{text}</div>
  </label>
);


export default CheckBox;
