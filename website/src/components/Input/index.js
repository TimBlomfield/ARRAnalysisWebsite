import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const Input = ({theme = K_Theme.Dark, extraClass = '', wrapperExtraClass = '', errorText = '', errorPlaceholder = false,
  errorBorder = false, errorTextExtraClass = '', label = '', id = '', multiline = false, ...attr}) => {
  const bHasError = !!errorText;
  const bHasLabel = !!label;
  const bDisabled = attr?.disabled === true;

  return (
    <div className={cn(styles.wrapper, wrapperExtraClass)}>
      {bHasLabel &&
        <label className={cn(styles.label, theme === K_Theme.Dark && styles.dark, {[styles.disabled]: bDisabled})} htmlFor={id}>
          {label}
        </label>
      }
      {multiline
        ? <textarea className={cn(styles.input, theme === K_Theme.Dark ? styles.dark : styles.light, {[styles.error]: bHasError, [styles.errorBorder]: errorBorder}, extraClass)}
                    {...(id ? { id } : {})}
                    {...attr} />
        : <input className={cn(styles.input, theme === K_Theme.Dark ? styles.dark : styles.light, {[styles.error]: bHasError, [styles.errorBorder]: errorBorder}, extraClass)}
                 {...(id ? { id } : {})}
                 {...attr} />
      }
      {(bHasError || errorPlaceholder) &&
        <div className={cn(styles.errorText,
                        theme === K_Theme.Dark ? styles.dkError : styles.ltError,
                        {[styles.disabled]: bDisabled},
                        errorTextExtraClass)}>
          {errorText}
        </div>
      }
    </div>
  );
};


export default Input;
