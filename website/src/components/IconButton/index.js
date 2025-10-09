'use client';

import { forwardRef } from 'react';
import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const IconButton = forwardRef(({theme = K_Theme.Dark, transparent = false, invertBkTheme = false, scale = 1, svgScale = 1,
  extraClass = '', svg = '', svgClassName = '', svgStyle = {}, char = '', charClassName = '', charStyle = {},
  noBkgnd = false, ...attr}, ref) => {
  const Img = svg;
  const classImg = svgClassName || styles.image;
  const classChar = charClassName || styles.char;

  const btnStyle = {
    width: `${scale*48}px`,
    height: `${scale*48}px`,
    minWidth: `${scale*48}px`,
    minHeight: `${scale*48}px`,
    ...(attr.style || {}),
  };
  const imgStyle = {
    scale: svgScale,
    ...svgStyle,
  };
  const chStyle = {
    scale: svgScale,
    ...charStyle,
  };

  return (
    <button className={cn(styles.iconButton, {
                          [styles.dark]: theme === K_Theme.Dark && !transparent,
                          [styles.light]: theme === K_Theme.Light,
                          [styles.red]: theme === K_Theme.Danger,
                          [styles.dark_TransparentBk]: theme === K_Theme.Dark && transparent,
                          [styles.light_TransparentBk]: theme === K_Theme.Light && transparent,
                          [styles.red_TransparentBk]: theme === K_Theme.Danger && transparent,
                          [styles.invertBkTheme]: invertBkTheme }, extraClass)}
            ref={ref}
            {...attr}
            style={btnStyle}>
      {svg && <Img className={classImg} style={imgStyle} />}
      {char && <div className={classChar} style={chStyle}>{char}</div>}
      <div className={styles.inner}
           {...(noBkgnd ? { style: { backgroundColor: 'transparent' } } : {})} />
    </button>
  );
});

IconButton.displayName = 'IconButton';


export default IconButton;
