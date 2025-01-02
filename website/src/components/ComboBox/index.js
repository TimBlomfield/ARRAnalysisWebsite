'use client';

import { forwardRef, useImperativeHandle } from 'react';
import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';
import PushButton from '@/components/PushButton';


const ComboBox = forwardRef(({theme = K_Theme.Dark, extraClass = '', wrapperExtraClass = '', errorText = '',
  errorPlaceholder = false, errorBorder = false, errorTextExtraClass = '', label = '', id = '', searchable = true,
  options = [], getOptionLabel, getOptionData, selected, onSelect, pageSize, disableListWrap, disableClearable,
  disableCloseOnSelect, clearOnEscape, disabled, debug, ...attr}, ref) => {
  const bHasError = !!errorText;
  const bHasLabel = !!label;

  useImperativeHandle(ref, () => ({
    comboFocus: () => refInput.current.focus(),
  }));

  return (
    <div className={cn(styles.wrapper, wrapperExtraClass)}>
      {bHasLabel &&
        <label className={cn(styles.label, theme === K_Theme.Dark && styles.dark)} htmlFor={id}>
          {label}
        </label>
      }
      <div className={cn(styles.wrapper, theme === K_Theme.Dark ? styles.dark : styles.light, {
        [styles.error]: bHasError,
        [styles.errorBorder]: errorBorder,
      }, wrapperExtraClass)}>
        <input className={cn(styles.input, extraClass)}
               id={id}
               {...attr} />
      </div>
      {(bHasError || errorPlaceholder) && <div className={cn(styles.errorText, errorTextExtraClass)}>{errorText}</div>}
    </div>
  );
});

ComboBox.displayName = 'ComboBox';


export default ComboBox;
