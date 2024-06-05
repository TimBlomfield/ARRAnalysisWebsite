import { useEffect, useId, useState } from 'react';
import MenuButton from '@/components/MenuButton';
// Styles
import styles from './styles.module.scss';
import MenuDrawer from '@/components/MenuDrawer';


const HeaderMenu = ({ bLight }) => {
  const idMenuBtn = useId();
  const [bOpened, setBOpened] = useState(false);

  useEffect(() => {
    const handleResize = () => setBOpened(false);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (bOpened) {
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      document.body.classList.add(styles.freezeBody);
    } else {
      document.body.style.paddingRight = '';
      document.body.classList.remove(styles.freezeBody);
    }
  }, [bOpened]);

  return (
    <>
      <MenuButton idMB={idMenuBtn} bOpened={bOpened} bLight={bLight} onClick={() => setBOpened(prev => !prev)} />
      <MenuDrawer idMB={idMenuBtn} bOpened={bOpened} onClose={() => setBOpened(false)} />
    </>
  );
};


export default HeaderMenu;
