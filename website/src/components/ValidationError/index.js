'use client';

// Images
import TriangleSvg from '@/../public/exclamation-triangle.svg';
// Styles
import styles from './styles.module.scss';


const ValidationError = ({ onClose, children }) => {
  return (
    <div className={styles.main}>
      <TriangleSvg className={styles.imgExclamation} />
      {children}
      <div className={styles.spacer} />
      <button class={styles.close} onClick={evt => {
        evt.preventDefault(); // Because this button might be inside of a <form> element
        onClose();
      }}>×</button>
    </div>
  );
};


export default ValidationError;
