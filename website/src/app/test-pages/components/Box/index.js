// Node modules
import React from 'react';
import cn from 'classnames';
// Local & Common files
import styles from './styles.module.scss';


const Box = ({caption = '', resizable = false, bodyStyle, children, ...props}) => (
  <div className={cn(styles.box, {[styles.resizable]: resizable})} {...props}>
    <div className={styles.header}>
      <div className={styles.tx}>{caption}</div>
    </div>
    <div className={styles.body} style={bodyStyle}>
      {children}
    </div>
  </div>
);


export default Box;
