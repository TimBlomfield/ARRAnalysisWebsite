import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const Input = ({theme = K_Theme.Dark, errorText = '', ...attr}) => {
  const bHasError = !!errorText;

  return (
    <div className={styles.wrapper}>
      <input className={cn(styles.input, theme === K_Theme.Dark ? styles.dark : styles.light, {[styles.error]: bHasError})}
             {...attr} />
      {bHasError && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
};


export default Input;
