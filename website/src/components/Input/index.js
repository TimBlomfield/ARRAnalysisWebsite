import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const Input = ({theme = K_Theme.Dark, errorText = '', errorPlaceholder = false, label = '', id='', multiline = false,
  ...attr}) => {
  const bHasError = !!errorText;
  const bHasLabel = !!label;

  return (
    <div className={styles.wrapper}>
      {bHasLabel &&
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      }
      {multiline
        ? <textarea className={cn(styles.input, theme === K_Theme.Dark ? styles.dark : styles.light, {[styles.error]: bHasError})}
                    id={id}
                    {...attr} />
        : <input className={cn(styles.input, theme === K_Theme.Dark ? styles.dark : styles.light, {[styles.error]: bHasError})}
                 id={id}
                 {...attr} />
      }

      {(bHasError || errorPlaceholder) && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
};


export default Input;
