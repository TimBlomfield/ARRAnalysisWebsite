'use client';

import { useEffect, useRef } from 'react';
import { select } from 'd3';
import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const   Loading = ({theme = K_Theme.Dark, scale = 1, text}) => {
  const refSvg = useRef();

  // Effects
  useEffect(() => {
    // Reset the svg
    const theSvg = select(refSvg.current);
    if (theSvg.empty()) return;
    theSvg.selectAll('*').remove();
    const size = 42 * scale;
    theSvg.attr('width', size).attr('height', size);

    const grCentered = theSvg.append('g')
      .attr('transform', `translate(${size * 0.5}, ${size * 0.5}) scale(${scale})`);

    grCentered.append('circle')
      .attr('class', styles.loading)
      .attr('stroke-width', 3.6)
      .attr('r', 16);
  }, [scale]);

  return (
    <div className={styles.main}>
      <svg className={cn(styles.svg, {[styles.light]: theme === K_Theme.Light})} ref={refSvg} />
      {text != null && <div className={styles.txt}>{text}</div> }
    </div>
  );
};


export default Loading;
