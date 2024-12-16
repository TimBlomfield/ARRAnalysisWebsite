'use client';


import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const ComboBox = ({theme = K_Theme.Dark, extraClass = '', wrapperExtraClass = '', errorText = '', errorPlaceholder = false,
  errorBorder = false, errorTextExtraClass = '', label = '', id = '', searchable = true, options = [], getOptionLabel,
  getOptionData, selected, onSelect, pageSize, disableListWrap, disableClearable, disableCloseOnSelect, clearOnEscape,
  disabled, debug, ...attr}) => {
  const bHasError = !!errorText;
  const bHasLabel = !!label;

  return (
    <div className={cn(styles.wrapper, wrapperExtraClass)}>
      {bHasLabel &&
        <label className={cn(styles.label, theme === K_Theme.Dark && styles.dark)} htmlFor={id}>
          {label}
        </label>
      }
      <input className={cn(styles.input, theme === K_Theme.Dark ? styles.dark : styles.light, {
          [styles.error]: bHasError,
          [styles.errorBorder]: errorBorder,
        }, extraClass)}
             id={id}
             {...attr} />
      {(bHasError || errorPlaceholder) && <div className={cn(styles.errorText, errorTextExtraClass)}>{errorText}</div>}
    </div>
  );
};


export default ComboBox;
