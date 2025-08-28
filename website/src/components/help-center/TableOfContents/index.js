'use client';

import cn from 'classnames';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { helpPages } from '@/utils/help-pages';
// Styles
import styles from './styles.module.scss';


const Item = ({ page, pathName, indent = 0 }) => {
  return (
    <>
      <div className={styles.item}>
        <Link href={page.full} className={cn(styles.txt, {[styles.activeLink]: page.full === pathName})} style={{ paddingLeft: 10*indent }}>{page.title}</Link>
      </div>
      {page.children && page.children.map(child => <Item key={child.url} page={child} pathName={pathName} indent={indent + 1} />)}
    </>
  );
};


const TableOfContents = () => {
  const pathName = usePathname();

  return (
    <aside aria-label="Table of Contents" className={styles.tableOfContents}>
      <div className={styles.title}>CATEGORIES</div>
      <Item page={helpPages} pathName={pathName} />
    </aside>
  );
};


export default TableOfContents;
