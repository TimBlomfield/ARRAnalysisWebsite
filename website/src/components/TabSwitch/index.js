'use client';

import React, { useRef, useEffect, useState } from 'react';
import cn from 'classnames';
import { K_Theme } from '@/utils/common';
import { checkPhoneOrTablet } from '@/utils/client/device';
import C from './const';
// Components
import ScrollButton from './ScrollButton';
// Images
import ArrowLeftSvg from '@/../public/ArrowLeft.svg';
// Styles
import styles from './styles.module.scss';


const TabSwitch = ({theme = K_Theme.Dark, extraClass = '', style, highlightTop = false, bold = true,
  options = C.emptyArr, getOptionLabel = C.getOptLabel, selected, onSelect, autoScrollButtons = true, forceTabWidth,
  maxTabWidth = 150, minTextWidth, stepMode = false, revealedSteps}) => {
  const refComp = useRef(), refTS = useRef(), refTabCont = useRef(), refPrevSel = useRef(-1);

  const [isPhoneOrTablet, setIsPhoneOrTablet] = useState(true);


  // Component state
  const [tabW, setTabW] = useState({});
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [hilitePos, setHilitePos] = useState(selected);
  const [showHilite, setShowHilite] = useState(false);
  const [hiliteHiddenAtTime, setHHAT] = useState(0);


  // Effects
  useEffect(() => {
    setIsPhoneOrTablet(checkPhoneOrTablet());
  }, []);

  useEffect(() => {
    const onResize = elements => {
      if (tabW.totalW != null) {
        const rcTS = elements[0].contentRect;
        setShowScrollButtons(tabW.totalW > rcTS.width);
      }
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(refTS.current);

    return () => {
      if (refTS.current) resizeObserver.unobserve(refTS.current);
    };
  }, [tabW]);

  useEffect(() => {
    if (refTabCont.current?.children?.length > 0) {
      const objW = { arrW: [], totalW: 0 };
      for (let i = 0; i < options.length; ++i) {
        const child = refTabCont.current.children[i];
        objW.totalW += child.offsetWidth;
        objW.arrW.push(objW.totalW);
      }
      setTabW(objW);
    }
  }, [extraClass, style, options, getOptionLabel, forceTabWidth, maxTabWidth, minTextWidth, bold, stepMode]);

  useEffect(() => {
    const onFocusIn = evt => {
      if (evt.target === refComp.current) setShowHilite(true);
    };

    const onFocusOut = evt => {
      if (evt.target === refComp.current) {
        if (showHilite) setHHAT(Date.now());
        setShowHilite(false);
      }
    };

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);

    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, [showHilite]);

  useEffect(() => {
    if (refPrevSel.current !== selected) {
      refPrevSel.current = selected;
      smoothScrollIntoView(selected);
    }
  });


  // Functions & handlers
  const bScrlBtns = (isPhoneOrTablet && autoScrollButtons) ? false : showScrollButtons;
  const wBtns = bScrlBtns ? 96 : 0;

  const fnScrollRight = () => {
    if (tabW.totalW != null) {
      const rightLimit = refComp.current.offsetWidth + refTS.current.scrollLeft - wBtns;

      // Find the element to scroll
      let pos = 0;
      while (pos < tabW.arrW.length && rightLimit > tabW.arrW[pos]) pos++;
      if (pos > 0) pos--;
      if (pos < tabW.arrW.length - 1 && Math.abs(tabW.arrW[pos] - refTS.current.scrollLeft) < 2) pos++;

      refTS.current.scrollTo({
        left: tabW.arrW[pos],
        behavior: 'smooth',
      });
    }
  };

  const fnScrollLeft = () => {
    if (tabW.totalW != null) {
      const frameWidth = refComp.current.offsetWidth - wBtns;

      // Find the first element that is partially or not visible
      let pos = tabW.arrW.length - 1;
      while (pos >= 0 && tabW.arrW[pos] >= refTS.current.scrollLeft) pos--;
      if (pos < tabW.arrW.length - 1) pos++;

      // Find the element to scroll to (its left edge)
      const lbound = tabW.arrW[pos] - frameWidth;
      let left = 0;
      if (lbound > 0) {
        while (pos >= 0 && tabW.arrW[pos] > lbound) pos--;
        left = tabW.arrW[pos + 1];
      }

      // Fix left if there is 0 scroll (must do a scroll)
      if (left > 0 && (refTS.current.scrollLeft <= left)) {
        left = pos >= 0 ? tabW.arrW[pos] : 0;
      }

      refTS.current.scrollTo({
        left,
        behavior: 'smooth',
      });
    }
  };

  const conditionalScroll = (leftDirection, pos) => {
    if (showScrollButtons && tabW.totalW != null) {
      // Border cases
      if (leftDirection && pos === 0) { refTS.current.scrollTo({ left: 0, behavior: 'auto' }); return; }
      if (!leftDirection && pos === options.length-1) { refTS.current.scrollTo({ left: 99999, behavior: 'auto' }); return; }

      const frameWidth = refComp.current.offsetWidth - wBtns;
      const itemLeft = pos > 0 ? tabW.arrW[pos - 1] : 0;
      const itemRight = tabW.arrW[pos];
      const itemWidth = itemRight - itemLeft;
      const theLeft = refTS.current.scrollLeft + 0.7 * itemWidth;
      const theRight = refTS.current.scrollLeft + frameWidth - 0.7 * itemWidth;

      if (itemLeft > theRight || itemRight < theLeft) {
        if (leftDirection) refTS.current.scrollTo({ left: itemLeft, behavior: 'auto' });
        else refTS.current.scrollTo({ left: itemRight - frameWidth, behavior: 'auto' });
      }
    }
  };

  const smoothScrollIntoView = pos => {
    if (showScrollButtons && tabW.totalW != null) {
      const frameWidth = refComp.current.offsetWidth - wBtns;
      const itemLeft = pos > 0 ? tabW.arrW[pos - 1] : 0;
      const itemRight = tabW.arrW[pos];
      const theLeft = refTS.current.scrollLeft;
      const theRight = refTS.current.scrollLeft + frameWidth;

      if (itemLeft < theLeft) refTS.current.scrollTo({ left: itemLeft, behavior: 'smooth' });
      else if (itemRight > theRight) refTS.current.scrollTo({ left: itemRight - frameWidth, behavior: 'smooth' });
    }
  };

  const handleKeyDown = evt => {
    const maxOptions = stepMode ? revealedSteps : options.length;

    switch (evt.code) {
      case 'ArrowLeft':
        evt.preventDefault();
        setShowHilite(true);
        if (hilitePos - 1 >= 0) {
          setHilitePos(hilitePos - 1);
          conditionalScroll(true, hilitePos - 1);
        }
        break;

      case 'ArrowRight':
        evt.preventDefault();
        setShowHilite(true);
        if (hilitePos + 1 < maxOptions) {
          setHilitePos(hilitePos + 1);
          conditionalScroll(false, hilitePos + 1);
        }
        break;

      case 'Home':
        evt.preventDefault();
        setShowHilite(true);
        setHilitePos(0);
        refTS.current.scrollTo({ left: 0, behavior: 'auto' });
        break;

      case 'End':
        evt.preventDefault();
        setShowHilite(true);
        setHilitePos(maxOptions - 1);
        conditionalScroll(false, maxOptions - 1);
        break;

      case 'Space':
      case 'Enter':
        if (showHilite) {
          evt.preventDefault();
          onSelect(hilitePos);
        }
        break;
    }
  };

  const handleTabClick = idx => {
    if (!stepMode || revealedSteps > idx) {
      onSelect(idx);
      setHilitePos(idx);
    }
  };

  const bDoRenderHilite = showHilite || (Date.now() - hiliteHiddenAtTime < 500);

  let lineStyle, rippleStyle, innerStyle;
  if (tabW.arrW != null) {
    lineStyle = { left: selected > 0 ? tabW.arrW[selected-1] : 0 };
    lineStyle.width = tabW.arrW[selected] - lineStyle.left;
    if (stepMode && selected < options.length - 1) lineStyle.width -= 23;
    rippleStyle = { left: hilitePos > 0 ? tabW.arrW[hilitePos-1] : 0 };
    rippleStyle.width = tabW.arrW[hilitePos] - rippleStyle.left;
    if (stepMode && hilitePos < options.length - 1) rippleStyle.width -= 23;
    const lesser = rippleStyle.width * 0.9;
    innerStyle = { left: 0.05 * rippleStyle.width, width: lesser, top: 24 - lesser * 0.5, height: lesser };
  }


  return (
    <div className={cn(styles.tsComponent, {[styles.dark]: theme === K_Theme.Dark, [styles.light]: theme === K_Theme.Light || theme === K_Theme.Danger})}
         tabIndex={0}
         ref={refComp}
         onClick={() => { setShowHilite(false); setHHAT(0); }}
         onKeyDown={handleKeyDown}>
      <div className={cn(styles.tabswitch, { [styles.mobile]: isPhoneOrTablet }, extraClass)} style={style} ref={refTS}>
        <div className={styles.tabcontainer} ref={refTabCont}>
          {options.map((opt, idx) => {
            const bLast = idx === options.length - 1;
            const bDisabled = stepMode && revealedSteps <= idx;
            const tabStyle = (forceTabWidth != null)
              ? { minWidth: `${forceTabWidth}px`, maxWidth: `${forceTabWidth}px`, width: `${forceTabWidth}px` }
              : { width: 'fit-content', maxWidth: `${Math.max(maxTabWidth, (minTextWidth || 1) + 41)}px` }; // 41 = 20+20+1 (padding and border)

            const text = getOptionLabel(options[idx]);
            const style = forceTabWidth != null ? { minWidth: `${minTextWidth}px` } : undefined;

            return (
              <div className={cn(styles.tab, {[styles.stepMode]: stepMode, [styles.disabled]: bDisabled})}
                   style={tabStyle}
                   onClick={() => handleTabClick(idx)}
                   key={idx}>
                <div className={cn(styles.txt, {[styles.sel]: (idx === selected) || stepMode, [styles.bold]: bold})} style={style} title={text}>{text}</div>
                {stepMode && !bLast && <ArrowLeftSvg className={styles.break} />}
              </div>
            );
          })}
          {bScrlBtns && <div className={styles.dummyTab} />}
          {tabW.arrW != null && <div className={cn(styles.line, highlightTop ? styles.top : styles.bottom, {[styles.stepMode]: stepMode})} style={lineStyle} />}
          {bDoRenderHilite &&
            <div className={styles.ripple} style={rippleStyle}>
              <div className={cn(styles.inner, showHilite ? styles.enter : styles.exit)} style={innerStyle}>
                <div className={cn(styles.pulsator, {[styles.noSel]: hilitePos !== selected})} />
              </div>
            </div>
          }
        </div>
      </div>
      {bScrlBtns &&
        <div className={cn(styles.lrbtns, {[styles.stepMode]: stepMode})}>
          <ScrollButton theme={theme} styles={styles} onClick={fnScrollLeft} />
          <ScrollButton theme={theme} styles={styles} right onClick={fnScrollRight} />
        </div>
      }
    </div>
  );
};


export default TabSwitch;
