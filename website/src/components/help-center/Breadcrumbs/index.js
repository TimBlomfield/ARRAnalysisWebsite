'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { helpPages } from '@/utils/help-pages';
// Styles
import styles from './styles.module.scss';


const renderElementsFromPathname = pathName => {
  const elements = [];
  const arrPath = pathName.split('/');
  let finder = [ helpPages ];

  if (arrPath.length > 0 && arrPath[0] === '')
    arrPath.shift();

  while (arrPath.length > 0 && finder) {
    const next = finder.find(elem => elem.url === arrPath[0]);
    if (next == null)
      break;
    elements.push({ title: next.title, url: next.full });
    finder = next.children;
    arrPath.shift();
  }

  return elements;
};


const Breadcrumbs = () => {
  const pathName = usePathname();

  const [renderElements, setRenderElements] = useState(() => renderElementsFromPathname(pathName));

  useEffect(() => {
    setRenderElements(renderElementsFromPathname(pathName));
  }, [pathName]);

  return (
    <nav aria-label="Breadcrumb" className={styles.main}>
      {renderElements.map(elem => (
        <div className={styles.crumb} key={elem.url}>
          {elem.url === pathName
            ? <div className={styles.active}>{elem.title}</div>
            : <Link className={styles.inactive} href={elem.url}>{elem.title}</Link>}
        </div>
      ))}
    </nav>
  );
};


export default Breadcrumbs;
