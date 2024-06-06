'use client';

import cn from 'classnames';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import HeaderMenu from '@/components/HeaderMenu';
// Styles
import styles from './styles.module.scss';


const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'What it does', href: '/product' },
  { name: 'Purchase', href: '/purchase' },
  { name: 'Contact', href: '/contact' },
];


const Header = () => {
  const pathName = usePathname();
  const bLight =pathName.startsWith('/purchase');

  return (
    <>
      <div className={styles.headerPlaceholder} />
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
          ARR Analysis
        </div>
        <div className={styles.links}>
          <Link href="/login" className={cn(styles.link, styles.noMr)}>Login</Link>
        </div>
      </header>
      <header className={cn(styles.narrowHeader, {[styles.light]: bLight})}>
        <div className={styles.title}>
          ARR Analysis
        </div>
        <HeaderMenu bLight={bLight} />
      </header>
    </>
  );
};


export default Header;
