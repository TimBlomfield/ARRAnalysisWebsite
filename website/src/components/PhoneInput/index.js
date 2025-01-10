'use client';

import { useCallback, useRef } from 'react';
import cn from 'classnames';
import parsePhoneNumber from 'libphonenumber-js';
import { K_Theme } from '@/utils/common';
// Styles
import styles from '../Input/styles.module.scss';


const PhoneInput = ({theme = K_Theme.Dark, extraClass = '', wrapperExtraClass = '', errorText = '', changeFn,
  errorPlaceholder = false, errorBorder = false, errorTextExtraClass = '', label = '', id = '', ...attr}) => {
  const refTemp = useRef({});
  const bHasError = !!errorText;
  const bHasLabel = !!label;
  const bDisabled = attr?.disabled === true;

  const onKeyDown = useCallback(evt => {
    const doCount = (nPos, str) => {
      // Count the numbers before nPos
      let nCount = 0;
      for (let t = nPos - 1; t >= 0; --t)
        if (str[t] >= '0' && str[t] <= '9')
          nCount++;
      refTemp.current.count = nCount;
    };

    // Handle special cases like selecting all text with Ctrl+A
    if (evt.ctrlKey || evt.metaKey) return;

    const input = evt.target;
    const { selectionStart, selectionEnd, value } = input;

    if (evt.key === '+') {
      if (value.length === 0) return;  // Allow a '+' at the beginning
      if (selectionStart === 0 && selectionEnd === value.length) return; // Replace everything with a "+"
    }

    if (evt.key === 'Backspace') {
      if (selectionStart !== selectionEnd) {
        doCount(selectionStart, value);
        return;
      }

      if (selectionStart === 0) { // Nothing to delete
        evt.preventDefault();
        return;
      }

      if (value[selectionStart-1] === '+' && value.length > 1) { // Nothing to delete
        evt.preventDefault();
        return;
      }

      // If we're trying to delete a space, move cursor one more position back
      if (value[selectionStart - 1] === ' ') {
        const newPosition = selectionStart - 2;
        const newValue = value.slice(0, newPosition) + value.slice(newPosition + 1); // Trigger change with the character at the new position removed
        doCount(newPosition, newValue);
        refTemp.current.value = newValue;
        return;
      }

      doCount(selectionStart - 1, value);
      return;
    }

    if (evt.key === 'Delete') {
      if (selectionStart !== selectionEnd) {
        doCount(selectionStart, value);
        return;
      }

      if (selectionStart === value.length || selectionStart === 0) { // Nothing to delete
        evt.preventDefault();
        return;
      }

      if (value[selectionStart] === ' ') {
        const newPosition = selectionStart + 1;
        const newValue = value.slice(0, newPosition) + value.slice(newPosition + 1); // Trigger change with the character at the new position removed
        doCount(newPosition, newValue);
        refTemp.current.value = newValue;
        return;
      }

      doCount(selectionStart, value);
      return;
    }

    const bIsNumeric = evt.key >= '0' && evt.key <= '9';
    if (bIsNumeric) {
      doCount(selectionStart, value);
      refTemp.current.count += 1;
      return;
    }

    // Only allow numbers, backspace, delete, arrow keys, etc.
    if (!bIsNumeric && !['ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(evt.key)) {
      evt.preventDefault();
    }
  }, []);

  const onTextChange = useCallback(evt => {
    const isNumeric = char => char >= '0' && char <= '9';

    const input = evt.target;

    let str = refTemp.current.value != null ? refTemp.current.value : input.value;
    refTemp.current.valuej = null;


    if (str.length > 0) {
      let strGood = '+';
      for (let i = 0; i < str.length; ++i)
        if (isNumeric(str[i])) {
          strGood += str[i];
          if (strGood.length > 25)
            break;
        }
      str = strGood;

      const phoneNumber = parsePhoneNumber(str);
      if (phoneNumber)
        str = phoneNumber.format('INTERNATIONAL');
    }

    changeFn(str);

    // Position the caret
    if (refTemp.current.count != null) {
      let nIdx = 0, nCount = refTemp.current.count;
      refTemp.current = {};
      while (nIdx < str.length) {
        if (str[nIdx] >= '0' && str[nIdx] <= '9')
          nCount--;
        nIdx++;
        if (nCount === 0) break;
      }
      setTimeout(() => input.setSelectionRange(nIdx, nIdx), 0);
    }
  }, [changeFn]);

  return (
    <div className={cn(styles.wrapper, wrapperExtraClass)}>
      {bHasLabel &&
        <label className={cn(styles.label, theme === K_Theme.Dark && styles.dark, {[styles.disabled]: bDisabled})} htmlFor={id}>
          {label}
        </label>
      }
      <input className={cn(styles.input, theme === K_Theme.Dark ? styles.dark : styles.light, {[styles.error]: bHasError, [styles.errorBorder]: errorBorder}, extraClass)}
             {...(id ? { id } : {})}
             onChange={onTextChange}
             onKeyDown={onKeyDown}
             {...attr} />
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


export default PhoneInput;
