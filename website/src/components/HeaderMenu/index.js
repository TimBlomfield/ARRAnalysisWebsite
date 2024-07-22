import { useEffect, useId, useState } from 'react';
// Components
import MenuButton from '@/components/MenuButton';
import MenuDrawer from '@/components/MenuDrawer';
// Styles
import styles from './styles.module.scss';


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
