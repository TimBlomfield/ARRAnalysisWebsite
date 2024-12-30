'use client';

// Node modules
import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import * as d3 from 'd3';
// Local & Common files
import styles from './styles.module.scss';


const Slider = ({ small = false, vertical = false, disabled = false, selected = 0, onSelect, ticks, min = 0, max = 1,
  tot = 3, showValue = Slider.ValueBehavior.Auto, valuePos = Slider.ValuePosition.Above }) => {
  const refGlobal = useRef({ noTransit: true }), refMain = useRef();

  // Local state
  const [defaultLocale, setDefaultLocale] = useState('en-US');
  const [bisector] = useState(() => d3.bisector(t => t.offset).center);
  const [moving, setMoving] = useState(false);
  const [positions, setPositions] = useState(null);


  // Effects
  useEffect(() => { setDefaultLocale(navigator?.language || 'en-US'); }, []);

  useEffect(() => {
    let processed;
    const fmtNum = new Intl.NumberFormat(defaultLocale, { maximumFractionDigits: 2 });

    if (Array.isArray(ticks) && ticks.length > 0) {
      processed = ticks.map(tick => ({
        value: tick.value,
        text: tick.text || fmtNum.format(tick.value),
        offset: tick.offset,
      }));
    } else {
      const fnValueText = val => fmtNum.format(val);
      processed = new Array(tot).fill({});
      processed[0] = { value: min, text: fnValueText(min), offset: 0 };
      processed[tot - 1] = { value: max, text: fnValueText(max), offset: 100 };

      for (let k = 1; k < tot - 1; ++k) {
        const value = min + (max - min)*k/(tot - 1);
        processed[k] = { value, text: fnValueText(value) };
      }
    }

    let start = 0, end;
    while (start < processed.length - 1) {
      end = start + 1;
      while (end < processed.length && processed[end].offset == null) ++end;
      if (end - start > 1) {
        const range = processed[end].offset - processed[start].offset;
        for (let k = start + 1; k < end; ++k) {
          processed[k].offset = processed[start].offset + range * (k - start) / (end - start);
        }
      }
      start = end;
    }

    setPositions(processed);
  }, [min, max, tot, defaultLocale]);


  // Other functions
  const onHit = useCallback((x, y, noTransit = true) => {
    if (positions == null || onSelect == null) return;

    refGlobal.current.noTransit = noTransit;
    const percentage = vertical
      ? (refGlobal.current.rcMain.bottom - y)/refGlobal.current.rcMain.height * 100
      : (x - refGlobal.current.rcMain.left)/refGlobal.current.rcMain.width * 100;

    onSelect(bisector(positions, percentage));
  }, [positions, onSelect]);

  const onMouseMove = useCallback(evt => onHit(evt.clientX, evt.clientY), [onHit]);
  const onTouchMove = useCallback(evt => onHit(evt.touches[0].clientX, evt.touches[0].clientY), [onHit]);

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    setMoving(false);
  };

  const onTouchUpCancel = () => {
    refMain.current.removeEventListener('touchmove', onTouchMove, true);
    refMain.current.removeEventListener('touchend', onTouchUpCancel, true);
    refMain.current.removeEventListener('touchcancel', onTouchUpCancel, true);
    setMoving(false);
  };

  const handleMouseDown = useCallback(evt => {
    if (!disabled && evt.button === 0) {
      refGlobal.current.rcMain = refMain.current.getBoundingClientRect();
      evt.preventDefault();
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      onHit(evt.clientX, evt.clientY, false);
      setMoving(true);
      refMain.current.focus();
    }
  }, [disabled, positions, onHit]);

  const handleTouchStart = useCallback(evt => {
    if (!disabled && evt.touches.length === 1) {
      refGlobal.current.rcMain = refMain.current.getBoundingClientRect();
      refMain.current.addEventListener('touchmove', onTouchMove, true);
      refMain.current.addEventListener('touchend', onTouchUpCancel, true);
      refMain.current.addEventListener('touchcancel', onTouchUpCancel, true);
      onHit(evt.touches[0].clientX, evt.touches[0].clientY, false);
      refGlobal.current.transit = true;
      setMoving(true);
      refMain.current.focus();
    }
  }, [disabled, positions]);

  const handleKeyDown = useCallback(evt => {
    if (disabled) return;

    const tenPercent = Math.max(10, Math.ceil(positions.length / 10));

    switch (evt.code) {
      case 'ArrowLeft':
      case 'ArrowDown':
        evt.preventDefault();
        refGlobal.current.noTransit = true;
        if (selected > 0) onSelect(selected - 1);
        break;

      case 'ArrowRight':
      case 'ArrowUp':
        evt.preventDefault();
        refGlobal.current.noTransit = true;
        if (selected < positions.length - 1) onSelect(selected + 1);
        break;

      case 'PageUp':
        evt.preventDefault();
        refGlobal.current.noTransit = false;
        if (selected < positions.length - 1) onSelect(Math.min(positions.length - 1, selected + tenPercent));
        break;

      case 'PageDown':
        evt.preventDefault();
        refGlobal.current.noTransit = false;
        if (selected > 0) onSelect(Math.max(0, selected - tenPercent));
        break;

      case 'Home':
        evt.preventDefault();
        refGlobal.current.noTransit = false;
        if (selected > 0) onSelect(0);
        break;

      case 'End':
        evt.preventDefault();
        refGlobal.current.noTransit = false;
        if (selected < positions.length - 1) onSelect(positions.length - 1);
        break;
    }
  }, [disabled, positions, selected]);


  const thumbStyle = positions != null
    ? vertical
      ? { bottom: `${positions[selected].offset}%` }
      : { left: `${positions[selected].offset}%` }
    : null;
  const trackStyle = (positions != null)
    ? vertical
      ? { height: `${positions[selected].offset}%` }
      : { width: `${positions[selected].offset}%` }
    : null;


  return (
    <div className={cn(styles.main, vertical ? styles.vert : styles.horz, {[styles.disabled]: disabled,
      [styles.showLabelAuto]: !disabled && showValue === Slider.ValueBehavior.Auto,
      [styles.showLabelAlways]: !disabled && showValue === Slider.ValueBehavior.On})}
         ref={refMain}
         tabIndex={disabled ? -1 : 0}
         onMouseDown={handleMouseDown}
         onTouchStart={handleTouchStart}
         onKeyDown={handleKeyDown}>
      <div className={cn(styles.bkline, vertical ? styles.vert : styles.horz, {[styles.thin]: small})} />
      {<div className={cn(styles.bkline, styles.track, vertical ? styles.vert : styles.horz,
        {[styles.thin]: small, [styles.noTransition]: refGlobal.current.noTransit})} style={trackStyle} />}
      {positions != null &&
        <>
          <div className={cn(styles.tbox, vertical ? styles.vert : styles.horz,
            {[styles.noTransition]: refGlobal.current.noTransit})} style={thumbStyle}>
            <div className={cn(styles.thumb, {[styles.thin]: small, [styles.moving]: moving})} />
            {!disabled && showValue !== Slider.ValueBehavior.Off &&
              <div className={cn(styles.label, {[styles.above]: valuePos === Slider.ValuePosition.Above,
                [styles.below]: valuePos === Slider.ValuePosition.Below,
                [styles.left]: valuePos === Slider.ValuePosition.Left,
                [styles.right]: valuePos === Slider.ValuePosition.Right})}>
                <div className={styles.text}>{positions[selected].text}</div>
              </div>
            }
          </div>
        </>
      }
    </div>
  );
};


Slider.ValueBehavior = { Off: 0, On: 1, Auto: 2 };
Slider.ValuePosition = { Above: 0, Below: 1, Left: 2, Right: 3 };


/*
 * Prop description:
 *
 * small - (if true the slider is thin, else the slider is thick)
 * vertical
 * disabled
 * selected - index into the positions / ticks array
 * onSelect
 * ticks - An array of { value, text, offset }
 *         value: the value of the tick
 *         text: (optional) the text to be displayed. Should be a message that takes value as parameter
 *         offset: (optional) offset of the tick from the start. This is a percentage value between 0 and 100. If not set it
 *                 will be automatically calculated. It must be set for the first and the last element though.
 * If ticks == null then the following three are used
 * 1. min
 * 2. max
 * 3. tot - Total number of ticks including min & max
 * showValue - one of Slider.ValueBehavior
 * valuePos - one of Slider.ValuePosition
 */


export default Slider;
