'use client';

import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './styles.module.scss';


const IconButton = ({theme = K_Theme.Dark, transparent = false, invertBkTheme = false, scale = 1, svgScale = 1,
  extraClass = '', svg = '', svgClassName = '', svgStyle = {}, ...attr}) => {
  const Img = svg;
  const classImg = cn(svgClassName || styles.image);

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

  return (
    <button className={cn(styles.iconButton, {
                          [styles.dark]: theme === K_Theme.Dark && !transparent,
                          [styles.light]: theme === K_Theme.Light,
                          [styles.red]: theme === K_Theme.Danger,
                          [styles.dark_TransparentBk]: theme === K_Theme.Dark && transparent,
                          [styles.light_TransparentBk]: theme === K_Theme.Light && transparent,
                          [styles.red_TransparentBk]: theme === K_Theme.Danger && transparent,
                          [styles.invertBkTheme]: invertBkTheme }, extraClass)}
            {...attr}
            style={btnStyle}>
      <Img className={classImg} style={imgStyle} />
      <div className={styles.inner} />
    </button>
  );
};


export default IconButton;
