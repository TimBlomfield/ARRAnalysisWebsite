import { useEffect, useCallback, useRef } from 'react';


const ClickAwayListener = ({bClickAway = true, bEscapeKey = true, bFocusLost = true, others, actionFn = () => {},
  actionClickAway, actionFocusLost, actionEscapeKey, children}) => {
  const refIgnoreWithin = useRef(false);  // Prevent the click-away action if the click (mousedown) was initiated inside the children element

  const handleClickEnter = useCallback(() => {
    refIgnoreWithin.current = true;
  });

  const handleClickAway = useCallback(evt => {
    if (bClickAway) {
      let isInside = evt.composedPath().indexOf(children.ref.current) > -1;
      if (refIgnoreWithin.current) {
        isInside = true;
        refIgnoreWithin.current = false;
      }
      if (!isInside && others && Array.isArray(others)) {
        for (let i = 0; (i < others.length) && !isInside; ++i) {
          isInside = evt.composedPath().indexOf(others[i]) > -1;
        }
      }

      if (!isInside) {
        actionFn();
        if (actionClickAway) actionClickAway();
      }
    }
  }, [bClickAway, actionFn, actionClickAway]);

  const handleKeyDown = useCallback(evt => {
    if (bEscapeKey && evt.code === 'Escape') {
      actionFn();
      if (actionEscapeKey) actionEscapeKey();
    }
  }, [bEscapeKey, actionFn, actionEscapeKey]);

  const handleFocusChange = useCallback(evt => {
    if (bFocusLost) {
      let notLost = children.ref.current.contains(evt.target);
      if (!notLost && others && Array.isArray(others)) {
        for (let i = 0; (i < others.length) && !notLost; ++i) {
          notLost = others[i].contains(evt.target);
        }
      }

      if (!notLost) {
        actionFn();
        if (actionFocusLost) actionFocusLost();
      }
    }
  }, [bFocusLost, actionFn, actionFocusLost]);


  useEffect(() => {
    const clickAwayEvent = (('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch)) ? 'touchend' : 'mouseup';
    const clickEnterEvent = (('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch)) ? 'touchstart' : 'mousedown';

    document.addEventListener(clickAwayEvent, handleClickAway);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusChange);
    children.ref.current.addEventListener(clickEnterEvent, handleClickEnter);

    return () => {
      document.removeEventListener(clickAwayEvent, handleClickAway);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusChange);
      if (children.ref.current) children.ref.current.removeEventListener(clickEnterEvent, handleClickEnter);
    };
  });


  return children;
};


export default ClickAwayListener;
