import Link from 'next/link';
// Styles
import styles from './styles.module.scss';
import {useCallback, useEffect, useState} from 'react';


const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'What it does', href: '/product' },
  { name: 'Purchase', href: '/purchase' },
  { name: 'Contact', href: '/contact' },
  { name: 'Login', href: '/login' },
];


const MenuDrawer = ({ idMB = '', bOpened = false, onClose }) => {
  const [left, setLeft] = useState(0);

  const defineLeft = useCallback(() => {
    const elem = document.getElementById(idMB);
    if (elem != null) {
      const rc = elem.getBoundingClientRect();
      setLeft(rc.right - 240 + 24);
    }
  }, [idMB]);

  useEffect(() => {
    const handleResize = () => { defineLeft(); };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [defineLeft]);

  useEffect(() => {
    defineLeft();
  }, [defineLeft]);

  return (
    <>
      <div className={styles.animatedNarrow} style={{height: bOpened ? 198 : 0, left}}>
        <div className={styles.cont}>
          {navLinks.map(link => (
            <Link key={link.href} className={styles.mi} href={link.href} onClick={onClose}>
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.animatedWide} style={{height: bOpened ? 'calc(100vh - 60px)' : 0}}>
        <div className={styles.cont}>
          {navLinks.map(link => (
            <Link key={link.href} className={styles.mi} href={link.href} onClick={onClose}>
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};


export default MenuDrawer;
