'use client';

import React, { useRef, useEffect, useState } from 'react';
import cn from 'classnames';
import { K_Theme } from '@/utils/common';
import { checkPhoneOrTablet } from '@/utils/client/device';
import C from './const';
// Components
import ScrollButton from './ScrollButton';
// Images
import ArrowLeftSvg from '@/../public/ArrowLeft.svg';
// Styles
import styles from './styles.module.scss';


const TabSwitch = ({theme = K_Theme.Dark, extraClass = '', style, highlightTop = false, bold = true,
  options = C.emptyArr, getOptionLabel = C.getOptLabel, selected, onSelect, autoScrollButtons = true, forceTabWidth,
  maxTabWidth = 150, minTextWidth, stepMode = false, revealedSteps}) => {
  const refComp = useRef(), refTS = useRef(), refTabCont = useRef(), refPrevSel = useRef(-1);

  const [isPhoneOrTablet] = useState(() => checkPhoneOrTablet());

  return (
    <div className={styles.tops}>

    </div>
  );
};


export default TabSwitch;
