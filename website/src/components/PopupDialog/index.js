'use client';


import { useRef, useEffect, useLayoutEffect, forwardRef } from 'react';
import cn from 'classnames';
// import { PORTAL_ID_DIALOG } from '@/utils/common';
// Components
import Gateway from '@/components/Gateway';
// import IconButton from 'elements/IconButton';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Local & Common files
// import { ReactComponent as CloseSvg } from 'images/vector/monochrome/Close.svg';
// import { ReactComponent as ArrowBackSvg } from 'images/vector/monochrome/ArrowBack.svg';
import styles from './styles.module.scss';
const IconButton = () => (<div></div>);


const PopupDialog = forwardRef(({portalId /*= PORTAL_ID_DIALOG*/, focusClass = '', focusFooterButton = -1, className = '',
  extraClass = '', title, acceptText, rejectText, canAccept = true, canReject = true, canClose = true, processing = false,
  processingMessage, callback, bodyStyle, closeOnEscape = true, footerSeparatorLine = false, hasBackButton = false,
  onBackButtonClick, children, ...props}, ref) => {
  const refDialog = useRef(), refProcessingOverlay = useRef(), refBody = useRef(), refClose = useRef(),
    refAccept = useRef(), refSecretFocus = useRef(), refData = useRef({ firstTime: true });

  const hasFooter = acceptText || rejectText;

  let bShifted = false, bTab = false;
  const onTabKey = evt => {
    if (evt.code === 'Tab') {
      bShifted = evt.shiftKey;
      bTab = true;
    }
  };

  const onFocusIn = evt => {
    if (processing) {
      if (refSecretFocus.current) refSecretFocus.current.focus();
      evt.preventDefault();
      evt.stopPropagation();
      return;
    }

    if (focusClass === '') return;
    if (evt.target) {
      if (!bTab && evt.target === refClose.current) return;   // Do nothing if clicking the close button (not using Tab key)
      bTab = false;

      const bFocusedX = evt.target === refClose.current;
      if (!bFocusedX && evt.target.classList.contains(focusClass)) return;  // Focusing a valid element

      const foc = refDialog.current.querySelectorAll('.' + focusClass);
      const focusables = [];
      for (let i = 0; i < foc.length; ++i) if (foc[i].tabIndex >= 0) focusables.push(foc[i]);
      if (focusables.length === 0) return;

      let posX = -1;  // Position of the close button (the X button)
      if (refClose.current) {
        for (let i = 0; i < focusables.length; ++i)
          if (focusables[i] === refClose.current) {
            posX = i;
            break;
          }
      }

      let next;
      if (bShifted) {
        next = bFocusedX
          ? posX === 0
            ? focusables.length - 1
            : posX - 1
          : focusables.length - 1;
        if (next === posX) next = next === 0 ? focusables.length - 1 : next - 1;
      } else {
        next = bFocusedX
          ? posX + 1 < focusables.length
            ? posX + 1
            : 0
          : 0;
        if (next === posX) next = next === focusables.length - 1 ? 0 : next + 1;
      }

      focusables[next].focus();
    }
  };

  useLayoutEffect(() => {
    // Use a small timeout to ensure the DOM has been updated
    const timer = setTimeout(() => {
      document.addEventListener('focusin', onFocusIn);
      document.addEventListener('keydown', onTabKey);

      if (processing) {
        if (refSecretFocus.current) refSecretFocus.current.focus();
      } else {
        if (refData.current.firstTime) {
          refData.current.firstTime = false;
          const shouldAutoFocus = (canReject && rejectText && focusFooterButton === 1)
            || (canAccept && acceptText && focusFooterButton === 2);
          if (!shouldAutoFocus) {
            const focusables = refDialog.current.querySelectorAll('.' + focusClass);
            if (focusables.length > 0) {
              let pos = (focusables.length > 1 && focusables[0] === refClose.current) ? 1 : 0;
              focusables[pos].focus();
            }
          }
        } else {
          if (refAccept.current) refAccept.current.focus();
        }
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('keydown', onTabKey);
    };
  }, [processing, hasBackButton, focusClass]);

  useEffect(() => {
    const onEscape = evt => { if (evt.code === 'Escape') callback(PopupDialog.Reject); };
    if (closeOnEscape) {
      document.addEventListener('keydown', onEscape);
    }

    return () => {
      if (closeOnEscape) {
        document.removeEventListener('keydown', onEscape);
      }
    };
  }, [closeOnEscape]);

  // Set processing overlay position. It's best to set it this way because <.title> and <.footer> can be customized
  // to have variable heights and <.body> can contain a scrollbar (because it has the style "overflow: auto" }
  const setOverlayCSS = () => {
    if (refProcessingOverlay.current && refBody.current) {
      const bod = refBody.current;
      const newCssText = `position: absolute; left: ${bod.offsetLeft}px; top: ${bod.offsetTop}px; width: ${bod.offsetWidth}px; height: ${bod.offsetHeight}px;`;
      if (refProcessingOverlay.current.style.cssText !== newCssText) {
        refProcessingOverlay.current.style.cssText = newCssText;
      }
    }
    if (processing && refDialog.current) {
      window.requestAnimationFrame(setOverlayCSS);
    }
  };

  if (processing) {
    window.requestAnimationFrame(setOverlayCSS);
  }

  return (
    <Gateway portalId={portalId}>
      <div className={styles.overlay} ref={ref}>
        {processing && <div className={styles.focusator} tabIndex={0} ref={refSecretFocus} />}
        <div className={styles.focusator} tabIndex={0} />
        <div ref={refDialog} className={cn(className || styles.dialog, extraClass)} {...props}>

          {/* DIALOG TITLE */}
          <div className={styles.title}>
            {hasBackButton &&
              <IconButton scale={0.85}
                          svgScale={1.1}
                          disabled={processing}
                          focusClass={processing ? '' : focusClass}
                          extraClass={styles.bkBtnXtra}
                          onClick={onBackButtonClick} />
            }
            <div className={styles.titleWrapper}>
              <div className={styles.txt} title={title}>title</div>
            </div>
            {canClose &&
              <IconButton // ref={refClose}
                          svgStroke
                          svgFill={false}
                          scale={0.75}
                          focusClass={focusClass}
                          autoFocus
                          renderFocus={false}
                          onClick={() => callback(PopupDialog.Close)} />
            }
          </div>

          {/* DIALOG BODY */}
          <div className={cn(styles.body, {[styles.roundBottom]: !hasFooter})} style={bodyStyle} ref={refBody}>
            {children}
          </div>

          {/* DIALOG FOOTER */}
          {hasFooter &&
            <div className={cn(styles.footer, {[styles.separator]: footerSeparatorLine})}>
              {!processing && footerActions}
              <div className={styles.buttons}>
                {rejectText &&
                  <PushButton extraClass={focusClass}
                              autoFocus={focusFooterButton === 1}
                              disabled={!canReject || processing}
                              onClick={() => callback(PopupDialog.Reject)}>
                    {rejectText}
                  </PushButton>
                                                                                                      }
                {acceptText && <PushButton theme={redAccept
                  ? PushButton.Theme.Tertiary.Destructive
                  : PushButton.Theme.Tertiary.Primary}
                                           ref={refAccept}
                                           focusClass={focusClass}
                                           autoFocus={focusFooterButton === 2}
                                           text={acceptText}
                                           disabled={!canAccept || processing}
                                           onClick={() => callback(PopupDialog.Accept)} />}
              </div>
            </div>
          }

          {/* PROCESSING OVERLAY */}
          {processing &&
            <div className={styles.processing} ref={refProcessingOverlay}>
              <Loading text={processingMessage} />
            </div>
          }
        </div>
        <div className={styles.focusator} tabIndex={0} />
      </div>
    </Gateway>
  );
});


PopupDialog.Accept = '_accept_';
PopupDialog.Reject = '_reject_';
PopupDialog.Close = '_close_';


export default PopupDialog;
