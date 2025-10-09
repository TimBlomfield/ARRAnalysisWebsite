'use client';

import { useRef, useState } from 'react';
import { K_Theme } from '@/utils/common';
// Components
import ClickAwayListener from '@/components/ClickAwayListener';
import IconButton from '@/components/IconButton';
import Popper from '@/components/Popper';
// Styles
import styles from './styles.module.scss';


const ActionButton = ({ onMove, onDownload, onDelete, refLimiter }) => {
  const refButton = useRef(), refClickAwayInner = useRef();

  const [popperOpened, setPopperOpened] = useState(false);

  return (
    <>
      <IconButton theme={K_Theme.Light}
                  ref={refButton}
                  transparent
                  invertBkTheme
                  char="⋮"
                  charStyle={{ fontSize: 32, marginTop: -4 }}
                  onClick={() => setPopperOpened(prev => !prev)} />
      {popperOpened &&
        <Popper className={styles.popper}
                anchorEl={refButton.current}
                alignment={Popper.Alignment.Start}
                anchor={Popper.Anchor.Left}
                limiter={refLimiter.current}
                limiterOffset={{ top: 10, bottom: 10 }}>
          <ClickAwayListener others={[refButton.current]}
                             actionFn={() => setPopperOpened(false)}>
            <div className={styles.frame} ref={refClickAwayInner}>
              <div className={styles.menuItem}
                   onClick={() => {
                     setPopperOpened(false);
                     onMove();
                   }}>
                <div className={styles.txt}>Move</div>
              </div>
              <div className={styles.menuItem}
                   onClick={() => {
                     setPopperOpened(false);
                     onDownload();
                   }}>
                <div className={styles.txt}>Download</div>
              </div>
              <div className={styles.separator} />
              <div className={styles.menuItem}
                   onClick={() => {
                     setPopperOpened(false);
                     onDelete();
                   }}>
                <div className={styles.txt}>Delete</div>
              </div>
            </div>
          </ClickAwayListener>
        </Popper>
      }
    </>
  );
};


export default ActionButton;
