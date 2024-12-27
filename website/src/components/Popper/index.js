// Node modules
import React, { useRef } from 'react';
// Utils
import useForceUpdate from '@/utils/client/useForceUpdate';


const Popper = ({className = '', style = {}, anchorEl, anchor = Popper.Anchor.Bottom, alignment = Popper.Alignment.Start,
  matchWidth = false, autoFlipAnchor = false, neverCover = false, limiter, bForceLimits = false, limiterOffset,
  limiterClip, children, ...props}) => {
  const refStyle = useRef({ visibility: 'hidden' }), topRef = useRef(), refID = useRef({ elem: null, count: 250 });
  const forceUpdate = useForceUpdate();

  const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;  // Line copied from material-ui

  useEnhancedEffect(() => {
    let handle;

    const animFn = () => {
      if (anchorEl) {
        const rfSt = refStyle.current;
        const { Anchor, Alignment, Clip } = Popper;
        let nextLeft = rfSt.left, nextTop = rfSt.top, nextWidth = rfSt.width, nextClipPath = rfSt.clipPath;

        // Visible Area width + height
        const visWidth  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const visHeight = window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight;

        // Get the limiter element if the ID is provided
        const bUsingLimiterID = typeof limiter === 'string';
        if (bUsingLimiterID) {
          refID.current.count++;
          const countLimit = refID.current.elem == null ? 80 : 250;
          if (refID.current.count >= countLimit) {  // Prevents calling getElementById() too often
            refID.current.elem = document.getElementById(limiter);
            refID.current.count = 0;
          }
        }

        // Rects
        const theAnchorElement = typeof anchorEl === 'function' ? anchorEl() : anchorEl;
        if (theAnchorElement == null) {
          console.error('Popper: Could not extract anchor element! ', anchorEl);
          return;
        }
        const rcAnchorEl = theAnchorElement.getBoundingClientRect();
        const rcThis = topRef.current.getBoundingClientRect();
        const theLimiter = bUsingLimiterID ? refID.current.elem : limiter;
        const rcLimiter = theLimiter ? theLimiter.getBoundingClientRect() : { left: 0, top: 0, bottom: visHeight, right: visWidth };


        let finalAnchor = anchor;
        if (autoFlipAnchor) {
          const bottomSpace = Math.min(rcLimiter.bottom, visHeight) - rcAnchorEl.bottom;
          const topSpace = rcAnchorEl.top - Math.max(rcLimiter.top, 0);
          const leftSpace = rcAnchorEl.left - Math.max(rcLimiter.left, 0);
          const rightSpace = Math.min(rcLimiter.right, visWidth) - rcAnchorEl.right;

          if (anchor === Anchor.Bottom && rcThis.height > bottomSpace && topSpace > bottomSpace) finalAnchor = Anchor.Top;
          else if (anchor === Anchor.Top && rcThis.height > topSpace && bottomSpace > topSpace) finalAnchor = Anchor.Bottom;
          else if (anchor === Anchor.Left && rcThis.width > leftSpace && rightSpace > leftSpace) finalAnchor = Anchor.Right;
          else if (anchor === Anchor.Right && rcThis.width > rightSpace && leftSpace > rightSpace) finalAnchor = Anchor.Left;
        }

        if (finalAnchor === Anchor.Bottom || finalAnchor === Anchor.Top) {
          nextTop = (finalAnchor === Anchor.Bottom) ? rcAnchorEl.bottom : rcAnchorEl.top - rcThis.height;
          switch (alignment) {
            case Alignment.Start: nextLeft = rcAnchorEl.left; break;
            case Alignment.Center: nextLeft = rcAnchorEl.left + (rcAnchorEl.width - rcThis.width) * 0.5; break;
            case Alignment.End: nextLeft = rcAnchorEl.left + rcAnchorEl.width - rcThis.width; break;
          }
        }

        if (finalAnchor === Anchor.Left || finalAnchor === Anchor.Right) {
          nextLeft = (finalAnchor === Anchor.Right) ? rcAnchorEl.right : rcAnchorEl.left - rcThis.width;
          switch (alignment) {
            case Alignment.Start: nextTop = rcAnchorEl.top; break;
            case Alignment.Center: nextTop = rcAnchorEl.top + (rcAnchorEl.height - rcThis.height) * 0.5; break;
            case Alignment.End: nextTop = rcAnchorEl.top + rcAnchorEl.height - rcThis.height; break;
          }
        }

        if (matchWidth && rcAnchorEl.width !== rfSt.width) nextWidth = rcAnchorEl.width;
        else if (!matchWidth && rfSt.width != null) nextWidth = undefined;

        if (bForceLimits || theLimiter != null) {
          const topLimit = rcLimiter.top + (limiterOffset?.top || 0);
          const bottomLimit = rcLimiter.bottom - (limiterOffset?.bottom || 0);
          const leftLimit = rcLimiter.left + (limiterOffset?.left || 0);
          const rightLimit = rcLimiter.right - (limiterOffset?.right || 0);

          let clipLeft = 0, clipRight = 0, clipBottom = 0, clipTop = 0;

          // Left (clip or reposition)
          if ((limiterClip & Clip.Left) !== 0) {
            const dist = leftLimit - rcThis.left;
            if (dist > 0) clipLeft = `${dist}px`;
          } else {
            if (nextLeft < leftLimit) nextLeft = leftLimit;
          }
          // Right (clip or reposition)
          if ((limiterClip & Clip.Right) !== 0) {
            const dist = rcThis.right - rightLimit;
            if (dist > 0) clipRight = `${dist}px`;
          } else {
            if (nextLeft + rcThis.width > rightLimit) nextLeft = rightLimit - rcThis.width;
          }
          // Top (clip or reposition)
          if ((limiterClip & Clip.Top) !== 0) {
            const dist = topLimit - rcThis.top;
            if (dist > 0) clipTop = `${dist}px`;
          } else {
            if (nextTop < topLimit) nextTop = topLimit;
          }
          // Bottom (clip or reposition)
          if ((limiterClip & Clip.Bottom) !== 0) {
            const dist = rcThis.bottom - bottomLimit;
            if (dist > 0) clipBottom = `${dist}px`;
          } else {
            if (nextTop + rcThis.height > bottomLimit) nextTop = bottomLimit - rcThis.height;
          }

          nextClipPath = `inset(${clipTop} ${clipRight} ${clipBottom} ${clipLeft})`;
        }

        if (neverCover) {
          if (finalAnchor === Anchor.Bottom) nextTop = rcAnchorEl.bottom;
          else if (finalAnchor === Anchor.Top) nextTop = rcAnchorEl.top - rcThis.height;
          else if (finalAnchor === Anchor.Right) nextLeft = rcAnchorEl.right;
          else /* if (finalAnchor === Anchor.Left) */ nextLeft = rcAnchorEl.left - rcThis.width;
        }

        let bUpdate = false;
        if (rfSt.visibility !== 'visible') { bUpdate = true; rfSt.visibility = 'visible'; }
        if (rfSt.left !== nextLeft) { bUpdate = true; rfSt.left = nextLeft; }
        if (rfSt.top !== nextTop) { bUpdate = true; rfSt.top = nextTop; }
        if (rfSt.width !== nextWidth) { bUpdate = true; rfSt.width = nextWidth; }
        if (rfSt.clipPath !== nextClipPath) { bUpdate = true; rfSt.clipPath = nextClipPath; }

        if (bUpdate) forceUpdate();
      }

      handle = window.requestAnimationFrame(animFn);
    };
    handle = window.requestAnimationFrame(animFn);

    return () => {
      window.cancelAnimationFrame(handle);
      // refStyle.current = { visibility: 'hidden' }; // Creates flicker when used with <Outlet />. Guess: something async happens. <Outlet/> is from react-router-dom which is not used in this project.
    };
  }, [className, style, anchorEl, anchor, alignment, matchWidth, autoFlipAnchor, neverCover, limiter,
    limiterOffset?.top, limiterOffset?.bottom, limiterOffset?.left, limiterOffset?.right, limiterClip, children]);

  return (
    <div ref={topRef}
         className={className}
         style={{...style, ...refStyle.current, position: 'fixed'}}
         {...props}>
      {children}
    </div>
  );
};


Popper.Anchor = {
  Left: 0,
  Top: 1,
  Right: 2,
  Bottom: 3,
};

Popper.Alignment = {
  Start: 0,
  Center: 1,
  End: 2,
};

Popper.Clip = {
  None:   0,
  Left:   1,
  Top:    2,
  Right:  4,
  Bottom: 8,
  All:    15,
};


/*
 * Prop description:
 *
 * className
 * style
 * anchorEl - Anchor Element (Object or Function)
 * anchor - One of Popper.Anchor,
 * alignment - One of Popper.Alignment,
 * matchWidth - Match the width of the anchor element
 * autoFlipAnchor
 * neverCover - Never cover the anchor element
 * limiter - HTML element within which the popper will be limited to appear, or HTML element's id
 * bForceLimits - Apply limiterOffset and limiterClip even when limiter == null
 * limiterOffset: { left,  top,  right, bottom } - Offset for the limiter
 * limiterClip - Clip instead of reposition within limiter. Combine one or more values from Popper.Clip
 * children - Required!
 */


export default Popper;
