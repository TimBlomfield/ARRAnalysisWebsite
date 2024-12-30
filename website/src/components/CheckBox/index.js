'use client';

import styles from './styles.module.scss';


const CheckBox = ({checked = false, setChecked, text = '', disabled = false}) => (
  <label className={styles.checkbox}>
    <input type="checkbox"
           className={styles.inputCb}
           checked={checked}
           disabled={disabled}
           onChange={e => setChecked(e.target.checked)} />
    <div className={styles.textCb}>{text}</div>
  </label>
);


export default CheckBox;
