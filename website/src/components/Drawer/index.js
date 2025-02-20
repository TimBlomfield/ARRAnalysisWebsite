'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
// Styles
import styles from './styles.module.scss';


const Drawer = ({initiallyCollapsed = true, wrapperClass = null, header, children, ...attr}) => {
  const refContents = useRef();
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  const [hideChildren, setHideChildren] = useState(initiallyCollapsed); // Prevent TAB navigation to hidden contents

  const expandCollapse = useCallback(() => setCollapsed(prev => !prev), []);

  useEffect(() => {
    const elem = refContents.current;
    if (!elem) return;

    const onTransitionStart = evt => { setHideChildren(false); };

    const onTransitionEnd = evt => {
      const finalValue = window.getComputedStyle(evt.target).gridTemplateRows;
      if (finalValue === '0px')
        setHideChildren(true);
    };

    elem.addEventListener('transitionend', onTransitionEnd);
    elem.addEventListener('transitionstart', onTransitionStart);

    return () => {
      if (elem != null) {
        elem.removeEventListener('transitionend', onTransitionEnd);
        elem.removeEventListener('transitionstart', onTransitionStart);
      }
    };
  }, []);

  return (
    <div className={wrapperClass ?? styles.wrap}>
      {React.cloneElement(header, { collapsed, expandCollapse })}
      <div className={cn(styles.contentArea, {[styles.expanded]: !collapsed})} ref={refContents} {...attr}>
        <div className={cn(styles.cell, { [styles.hide]: hideChildren })}>
          {children}
        </div>
      </div>
    </div>
  );
};


export default Drawer;
