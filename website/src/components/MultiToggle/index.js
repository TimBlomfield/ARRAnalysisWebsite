'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const MultiToggle = ({ theme = K_Theme.Dark, selected = 0, options = [], onSelect, disabled = false }) => {
  const refTopElem = useRef(), refData = useRef({ noTransit: true });


  // Local state
  const [hiliteStyle, setHiliteStyle] = useState({ left: 0, width: 0 });


  // Effects
  useEffect(() => {
    if (refData.current.noTransit && hiliteStyle.width !== 0)
      refData.current.noTransit = false;
  }, [hiliteStyle]);

  useEffect(() => {
    if (refTopElem.current != null) {
      const rcTop = refTopElem.current.getBoundingClientRect();
      const rcChild = refTopElem.current.children[selected].getBoundingClientRect();
      let left = rcChild.left - rcTop.left, width = rcChild.width;
      if (selected === 0) left -= 1;
      if (selected === options.length - 1) width += 1;
      if (left !== hiliteStyle.left || width !== hiliteStyle.width)
        setHiliteStyle({ left, width });
    }
  });


  // Handlers
  const handleKeyDown = useCallback(evt => {
    if (disabled) { evt.preventDefault(); return; }

    switch (evt.code) {
      case 'ArrowLeft':
        evt.preventDefault();
        if (selected > 0) onSelect(selected - 1);
        break;

      case 'ArrowRight':
        evt.preventDefault();
        if (selected < options.length - 1) onSelect(selected + 1);
        break;

      case 'Enter':
      case 'NumpadEnter':
      case 'Space':
        evt.preventDefault();
        const next = selected < options.length - 1 ? selected + 1 : 0;
        onSelect(next);
        break;
    }
  }, [disabled, selected, options.length]);

  const handleMouseDown = useCallback(evt => {
    if (disabled) evt.preventDefault();
  }, [disabled]);



  return (
    <div className={cn(styles.multiToggle, theme === K_Theme.Dark ? styles.dark : styles.light, {[styles.disabled]: disabled})}
         ref={refTopElem}
         { ...(disabled ? {} : { tabIndex: 0 }) }
         onMouseDown={handleMouseDown}
         onKeyDown={handleKeyDown}>
      {options.map((opt, idx) => (
        <div className={cn(styles.piece, {[styles.first]: idx === 0, [styles.last]: idx === options.length - 1})}
             key={idx}
             onClick={disabled ? undefined : () => onSelect(idx)}>
          <div className={cn(styles.txt, {[styles.selected]: idx === selected})}>{opt}</div>
        </div>
      ))}
      <div className={cn(styles.hilite, {[styles.noTransit]: refData.current.noTransit, [styles.first]: selected === 0, [styles.last]: selected === options.length - 1})} style={hiliteStyle} />
    </div>
  );
};


export default MultiToggle;
