"use client";

import cn from 'classnames';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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

  return (
    <>
      <div className={styles.headerPlaceholder} />
      <div className={cn(styles.header, {[styles.light]: pathName.startsWith('/purchase')})}>
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
      </div>
    </>
  );
};


export default Header;
