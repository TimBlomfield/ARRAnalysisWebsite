'use client';

import { useMemo, useState } from 'react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { K_Theme } from '@/utils/common';
// Components
import LinkButton from '@/components/LinkButton';
import Loading from '@/components/Loading';
import LoadingSSR from '@/components/LoadingSSR';
import PlusMinusButton from '@/components/PlusMinusButton';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const ComponentsPage = () => {

  const [plusMinusValue, setPlusMinusValue] = useState(0);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // PushButton Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const PushButtonSection_MemoRender = useMemo(() => (
    <>
      <div className={cn(styles.title, styles.pt)}>&lt;PushButton /&gt;</div>
      <div className={styles.pushButtonGrid}>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Light} onClick={() => toast('Light!')}>Button Light</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Light} invertBkTheme onClick={() => toast('Light!')}>Button Light</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Dark} onClick={() => toast('Dark!')}>Button Dark</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Dark} invertBkTheme onClick={() => toast('Dark!')}>Button Dark</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Light} invertBkTheme onClick={() => toast('Light!')} disabled>Button
            Light</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Light} onClick={() => toast('Light!')} disabled>Button Light</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Dark} invertBkTheme onClick={() => toast('Dark!')} disabled>Button
            Dark</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Dark} onClick={() => toast('Dark!')} disabled>Button Dark</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Danger} onClick={() => toast('Danger!')}>Danger</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Danger} invertBkTheme onClick={() => toast('Danger!')}>Danger</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Danger} onClick={() => toast('Danger!')} disabled>Danger</PushButton>
        </div>
        <div className={styles.child}>
          <PushButton theme={K_Theme.Danger} onClick={() => toast('Danger!')} disabled>Danger</PushButton>
        </div>
      </div>
    </>
  ), []);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // LinkButton Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const LinkButtonSection_MemoRender = useMemo(() => (
    <>
      <div className={cn(styles.title, styles.pt)}>&lt;LinkButton /&gt;</div>
      <div className={styles.pushButtonGrid}>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Light} href="https://www.google.com/">Button Light</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Light} invertBkTheme href="https://www.google.com/">Button Light</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Dark} href="https://www.google.com/">Button Dark</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Dark} invertBkTheme href="https://www.google.com/">Button Dark</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Light} invertBkTheme href="https://www.google.com/" disabled>Button Light</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Light} href="https://www.google.com/" disabled>Button Light</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Dark} invertBkTheme href="https://www.google.com/" disabled>Button Dark</LinkButton>
        </div>
        <div className={styles.child}>
          <LinkButton theme={K_Theme.Dark} href="https://www.google.com/" disabled>Button Dark</LinkButton>
        </div>
      </div>
    </>
  ), []);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // PlusMinusButton Section
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const PlusMinusButtonSection_MemoRender = useMemo(() => {
    const lessen = () => setPlusMinusValue(prev => prev > 0 ? prev - 1 : 0);
    const grow = () => setPlusMinusValue(prev => prev < 50 ? prev + 1 : 50);
    return (
      <>
        <div className={cn(styles.title, styles.pt)}>&lt;PlusMinusButton /&gt;</div>
        <div className={styles.plusMinusGrid}>
          <div className={styles.cell}>{plusMinusValue}</div>
          <div className={cn(styles.cell, styles.dark)}>
            <PlusMinusButton theme={K_Theme.Dark} invertBkTheme onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}>
            <PlusMinusButton theme={K_Theme.Light} invertBkTheme onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}>
            <PlusMinusButton theme={K_Theme.Dark} onLess={lessen} onMore={grow} />
          </div>
          <div className={cn(styles.cell, styles.dark)}>
            <PlusMinusButton theme={K_Theme.Light} onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}></div>
          <div className={cn(styles.cell, styles.dark)}>
            <PlusMinusButton theme={K_Theme.Dark} invertBkTheme disabled onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}>
            <PlusMinusButton theme={K_Theme.Light} invertBkTheme disabled onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}>
            <PlusMinusButton theme={K_Theme.Dark} disabled onLess={lessen} onMore={grow} />
          </div>
          <div className={cn(styles.cell, styles.dark)}>
            <PlusMinusButton theme={K_Theme.Light} disabled onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}></div>
          <div className={cn(styles.cell, styles.dark)}>
            <PlusMinusButton theme={K_Theme.Dark} invertBkTheme extraBtnClass={styles.extraBtnClass1} onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}>
            <PlusMinusButton theme={K_Theme.Light} invertBkTheme extraBtnClass={styles.extraBtnClass2} onLess={lessen} onMore={grow} />
          </div>
          <div className={styles.cell}>
            <PlusMinusButton theme={K_Theme.Dark} extraBtnClass={styles.extraBtnClass3} onLess={lessen} onMore={grow} />
          </div>
          <div className={cn(styles.cell, styles.dark)}>
            <PlusMinusButton theme={K_Theme.Light} extraBtnClass={styles.extraBtnClass4} onLess={lessen} onMore={grow} />
          </div>
        </div>
      </>
    );
  }, [plusMinusValue]);


  return (
    <main className={styles.main}>
      <div className={styles.title}>&lt;Loading size={'{1}'} text=&quot;Hello&quot; /&gt;</div>
      <section className={styles.loadingGrid}>
        <div className={styles.cell}><Loading /></div>
        <div className={styles.cell}><Loading scale={1.5} /></div>
        <div className={styles.cell}><Loading scale={2} /></div>
        <div className={styles.cell}><Loading text="Loading..." /></div>
        <div className={styles.cell}><Loading scale={2} text="Loading..." /></div>
        <div className={cn(styles.cell, styles.wider)}><Loading text="Lorem ipsum dolor sit amet consectetur adipiscing elit..." /></div>
        <div className={styles.cell}><Loading scale={2} text="Lorem ipsum dolor sit amet consectetur adipiscing elit..." /></div>
        <div className={styles.cell}><LoadingSSR theme={K_Theme.Dark} scale={1} text="Howdy" /></div>
        <div className={cn(styles.cell, styles.wider)}><LoadingSSR scale={2} text="Lorem ipsum dolor sit amet consectetur adipiscing elit..." /></div>
      </section>

      {PushButtonSection_MemoRender}
      {LinkButtonSection_MemoRender}
      {PlusMinusButtonSection_MemoRender}
    </main>
  );
};


export default ComponentsPage;
