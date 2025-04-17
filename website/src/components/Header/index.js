'use client';

import { useEffect, useState } from 'react';
import cn from 'classnames';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
// Components
import HeaderMenu from '@/components/HeaderMenu';
// Images
import LogoWhiteSvg from '@/../public/logo-white.svg';
import LogoBlueSvg from '@/../public/logo-blue.svg';
// Styles
import styles from './styles.module.scss';


const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'What it does', href: '/product' },
  { name: 'Purchase', href: '/purchase' },
  { name: 'Contact', href: '/contact' },
];

const useIsNarrowScreen = () => { // Initially tried only with media queries but it wouldn't work correctly because of the SVG appearing twice in the DOM (and some internal browser optimization)
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsNarrow(window.matchMedia('(max-width: 770px)').matches);
    };

    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  return isNarrow;
};

const Header = () => {
  const pathName = usePathname();
  const bLight = pathName.startsWith('/purchase');
  const Logo = bLight ? LogoBlueSvg : LogoWhiteSvg;
  const bNarrow = useIsNarrowScreen();

  return (
    <>
      <div className={cn(styles.headerPlaceholder, {[styles.light]: bLight})} />
      {!bNarrow &&
        <header className={cn(styles.header, {[styles.light]: bLight})}>
          <div className={styles.links}>
            {navLinks.map(link => {
              const isActive = pathName.endsWith(link.href);

              return (
                <Link href={link.href}
                      key={link.href}
                      className={cn(styles.link, {[styles.active]: isActive})}>
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className={styles.titleCentrer}>
            <Logo className={styles.logo} />
          </div>
          <div className={styles.links}>
            <Link href="/login" className={cn(styles.link, styles.noMr)}>Login</Link>
          </div>
        </header>
      }
      {bNarrow &&
        <header className={cn(styles.narrowHeader, {[styles.light]: bLight})}>
          <div className={styles.title}>
            <Logo className={styles.logo} />
          </div>
          <HeaderMenu bLight={bLight} />
        </header>
      }
    </>
  );
};


export default Header;
