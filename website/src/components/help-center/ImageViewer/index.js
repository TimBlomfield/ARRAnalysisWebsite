'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import Image from 'next/image';
import { K_Theme } from '@/utils/common';
// Components
import IconButton from '@/components/IconButton';
// Images
import PlusSvg from '@/../public/Plus.svg';
// Styles
import styles from './styles.module.scss';


const MARGIN = 20;
const MAX_ZOOM = 3;
const MIN_ZOOM = .25;


const ImageViewer = ({ image, alt, notifyClosed }) => {
  const dlgId = useId();
  const refImg = useRef(), refInside = useRef(), refData = useRef({ zoom: 1, pan: { dx: 0, dy: 0 } });

  const calcSizeAndMid = () => {
    const scrSize = { w: refInside.current.clientWidth, h: refInside.current.clientHeight };
    const mid = {
      x: (scrSize.w - image.width * refData.current.zoom) * .5,
      y: (scrSize.h - image.height * refData.current.zoom) * .5,
    };
    return { scrSize, mid };
  };

  const closeDialog = useCallback(() => {
    const dialog = document.getElementById(dlgId);
    if (dialog != null)
      dialog.close();
  }, []);

  const limitPan = scrSize => {
    if (scrSize.w - image.width * refData.current.zoom < 2*MARGIN) {
      const boundary = (image.width * refData.current.zoom - scrSize.w + 2*MARGIN) * .5;
      refData.current.pan.dx = Math.min(boundary, Math.max(-boundary, refData.current.pan.dx));
    } else
      refData.current.pan.dx = 0;

    if (scrSize.h - image.height * refData.current.zoom < 2*MARGIN) {
      const boundary = (image.height * refData.current.zoom - scrSize.h + 2*MARGIN) * .5;
      refData.current.pan.dy = Math.min(boundary, Math.max(-boundary, refData.current.pan.dy));
    } else
      refData.current.pan.dy = 0;
  };

  const applyCssTransform = () => {
    const { scrSize, mid } = calcSizeAndMid();
    limitPan(scrSize);
    refImg.current.style.translate = `${(refData.current.pan.dx + mid.x) / refData.current.zoom}px ${(refData.current.pan.dy + mid.y) / refData.current.zoom}px`;
    refImg.current.style.zoom = refData.current.zoom;
  };

  useEffect(() => {
    let resizeObserver = null, bWheelEvent = false, viewportMeta = null, originalContent = null;

    const onMouseWheel = evt => {
      refData.current.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, refData.current.zoom + .1 * (evt.deltaY < 0 ? 1 : -1)));
      applyCssTransform();
    };

    if (image != null) {
      const dialog = document.getElementById(dlgId);
      dialog.addEventListener('close', notifyClosed);
      dialog.showModal();

      document.activeElement.blur();  // Prevent initial focus on the close button

      const onResize = () => {
        if (refInside.current != null && refImg.current != null) {
          const { scrSize } = calcSizeAndMid();

          let zoomH = 1, zoomV = 1;
          if (scrSize.w < 2*MARGIN + image.width)
            zoomH = (scrSize.w - 2*MARGIN) / image.width;
          if (scrSize.h < 2*MARGIN + image.height)
            zoomV = (scrSize.h - 2*MARGIN) / image.height;
          const zoomMin = Math.min(zoomH, zoomV);

          if (refData.current.zoom > zoomMin){
            refData.current.zoom = zoomMin;
            refData.current.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, refData.current.zoom));
          } else if (refData.current.zoom < zoomMin) {
            refData.current.zoom = zoomMin;
            refData.current.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, refData.current.zoom));
          }

          applyCssTransform();
        }
      };

      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(refInside.current);

      if (refInside.current != null && refImg.current != null) {
        refInside.current.addEventListener('wheel', onMouseWheel, { passive: false });
        bWheelEvent = true;
      }

      // Disallow zoom when the <dialog> element is opened
      viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta != null) {
        originalContent = viewportMeta.getAttribute('content');
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      const dialog = document.getElementById(dlgId);
      if (dialog != null)
        dialog.removeEventListener('close', notifyClosed);

      if (refInside.current != null) {
        if (resizeObserver !== null)
          resizeObserver.unobserve(refInside.current);
        if (bWheelEvent)
          refInside.current.removeEventListener('wheel', onMouseWheel, { passive: false });
      }

      if (refImg.current != null)
        refImg.current.style.transition = '';

      document.removeEventListener('keydown', handleKeyDown);

      if (viewportMeta && originalContent)
        viewportMeta.setAttribute('content', originalContent);

      refData.current = { zoom: 1, pan: { dx: 0, dy: 0 } };
    };
  }, [image]);

  const handleKeyDown = evt => {
    switch (evt.key) {
      case '+':
      case '=':
        setZoom('in');
        break;

      case '-':
        setZoom('out');
        break;

      case '0':
        setZoom('reset');
        break;
    }
  };

  const handleMove = (cx, cy) => {
    const { initial } = refData.current;

    refData.current.pan.dx = initial.pan.dx + cx - initial.cx;
    refData.current.pan.dy = initial.pan.dy + cy - initial.cy;

    applyCssTransform();
  };

  const handlePinch = (touch1, touch2) => {
    const { initial } = refData.current;

    const dist = getDist(touch1, touch2);
    const scale = dist / initial.dst;
    refData.current.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, initial.zoom * scale));

    applyCssTransform();
  };

  const onMouseMove = evt => handleMove(evt.clientX, evt.clientY);
  const onTouchMove = evt => {
    if (refData.current.initial?.dst != null) {
      handlePinch(evt.touches[0], evt.touches[1]);
    } else
      handleMove(evt.touches[0].clientX, evt.touches[0].clientY);

    evt.stopPropagation();
  };

  const onEndDrag = evt => {
    delete refData.current.initial;

    const bTouchEvent = evt.type !== 'mouseup';

    // Remove listeners
    if (bTouchEvent) {
      refInside.current.removeEventListener('touchmove', onTouchMove, { passive: true });
      refInside.current.removeEventListener('touchup', onEndDrag);
      refInside.current.removeEventListener('touchcancel', onEndDrag);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onEndDrag);
    }
  };

  const getDist = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx*dx + dy*dy);
  };

  const handleStartDrag = evt => {
    const bTouchEvent = evt.type === 'touchstart';
    let bDrag, bPinch = false, cx = 0, cy = 0, dst = 0;

    if (bTouchEvent) {
      bDrag = evt.touches.length === 1;
      bPinch = evt.touches.length === 2;
      if (bDrag) {
        cx = evt.touches[0].clientX;
        cy = evt.touches[0].clientY;
      } else if (bPinch) {
        dst = getDist(evt.touches[0], evt.touches[1]);
      }
    } else {
      bDrag = evt.button === 0;
      if (bDrag) {
        cx = evt.clientX;
        cy = evt.clientY;
      }
    }

    if (bDrag || bPinch) {
      refData.current.initial = {
        pan: { ...refData.current.pan },
        zoom: refData.current.zoom,
        ...(bDrag ? { cx, cy } : { dst }),
      };

      if (bTouchEvent) {
        refInside.current.addEventListener('touchmove', onTouchMove, { passive: true });
        refInside.current.addEventListener('touchend', onEndDrag);
        refInside.current.addEventListener('touchcancel', onEndDrag);
      } else if (bDrag) {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onEndDrag);
      }
    }

    if (!bTouchEvent) evt.preventDefault();
  };

  const setZoom = zoom => {
    switch (zoom) {
      case 'in': refData.current.zoom = Math.min(MAX_ZOOM, refData.current.zoom + .3); break;
      case 'out': refData.current.zoom = Math.max(MIN_ZOOM, refData.current.zoom - .3); break;
      case 'reset': refData.current.zoom = 1; break;
    }

    applyCssTransform();
  };

  if (image == null)
    return null;

  return (
    <dialog id={dlgId} className={styles.main} onClose={notifyClosed}>
      <div className={styles.inside} ref={refInside}>
        <Image src={image}
               alt={alt}
               ref={refImg}
               className={styles.img}
               onMouseDown={handleStartDrag}
               onTouchStart={handleStartDrag}
               onClick={evt => evt.stopPropagation()} />
        <IconButton theme={K_Theme.Dark}
                    extraClass={styles.closeBtn}
                    transparent
                    invertBkTheme
                    svg={PlusSvg}
                    svgClassName={styles.imgX}
                    svgScale={1.3}
                    onClick={evt => { evt.stopPropagation(); closeDialog(); }} />
        <div className={styles.zoomControls}>
          <button className={styles.zoomBtn} title="Zoom Out" onClick={() => setZoom('out')}>-</button>
          <button className={styles.zoomBtn} title="Zoom Reset" onClick={() => setZoom('reset')}>⌂</button>
          <button className={styles.zoomBtn} title="Zoom In" onClick={() => setZoom('in')}>+</button>
        </div>
      </div>
    </dialog>
  );
};


export default ImageViewer;
