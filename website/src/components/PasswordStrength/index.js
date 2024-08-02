'use client';


import zxcvbn from 'zxcvbn';
import cn from 'classnames';
// Styles
import styles from './styles.module.scss';


const PasswordStrength = ({password = '', extraClass = ''}) => {
  let pwdStrength = 'Too short', barStyle = styles.veryWeak, arr = [];
  if (password.length > 3) {
    const res = zxcvbn(password);
    switch (res.score) {
      case 0: pwdStrength = 'Very weak'; break;
      case 1: pwdStrength = 'Weak'; barStyle = styles.weak; break;
      case 2: pwdStrength = 'Fair'; barStyle = styles.fair; break;
      case 3: pwdStrength = 'Good'; barStyle = styles.good; break;
      default: pwdStrength = 'Strong'; barStyle = styles.strong;
    }
    arr = Array(res.score + 1).fill(0);
  }

  return (
    <div className={cn(styles.main, extraClass)}>
      <div className={styles.desc}>Password Strength: {pwdStrength}</div>
      <div className={cn(styles.bars, barStyle)}>
        {arr.map((_, idx) => <div key={idx} className={styles.bar} />)}
      </div>
    </div>
  );
};


export default PasswordStrength;
