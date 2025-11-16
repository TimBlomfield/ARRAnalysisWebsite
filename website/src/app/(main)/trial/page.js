'use client';

import { useCallback, useId, useState } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { K_Theme } from '@/utils/common';
// Components
import AnimateX from '@/components/AnimateX';
import Footer from '@/components/Footer';
import Input from '@/components/Input';
import PushButton from '@/components/PushButton';
// Images
import imgExcelLogo from '@/../public/Logo-MS-Excel.png';
// Styles
import styles from './page.module.scss';


const customInputStyle = {
  height: '48px',
  fontSize: '16px',
  minWidth: '100px',
};

const customButtonStyle = {
  height: '52px',
  fontSize: '16px',
  width: '100%',
};


const TrialPage = () => {
  const idEmail = useId();

  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const handleInputChange = useCallback((val, fn, errFn) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        errFn('');
      }
    };
  }, []);
  const emailFn = handleInputChange(email, setEmail, setErrorEmail);

  return (
    <AnimateX>
      <main className={styles.main}>
        <section className={styles.s1}>
          <div className={styles.titleText} data-animated="text1" data-anim-delay=".1">Try our software for free</div>
        </section>
        <section className={styles.s2}>
          <ul className={styles.cc}>
            <li data-animated="text3" data-anim-delay=".3">No credit card or payment details needed</li>
            <li data-animated="text3" data-anim-delay=".5">Unlimited access to all ARR Analysis Add-in features</li>
            <li data-animated="text3" data-anim-delay=".7">Automatically expires after 14 days, no cancellation needed</li>
          </ul>
          <div className={styles.fx} data-animated="text1" data-anim-delay=".75">
            <div className={styles.txtComp}>Compatible with</div>
            <div className={styles.grp}>
              <Image className={styles.xlLogo}
                     src={imgExcelLogo}
                     alt="MS Excel Logo"
                     priority />
              <div className={cn(styles.txtComp, styles.xl)}>Microsoft Excel</div>
            </div>
          </div>
          <div className={styles.versions} data-animated="text1" data-anim-delay=".85">
            <div className={styles.versionBadge}>Excel 2016</div>
            <div className={styles.versionBadge}>Excel 2019</div>
            <div className={styles.versionBadge}>Excel 2021</div>
            <div className={styles.versionBadge}>Microsoft 365</div>
          </div>
          <div className={styles.platformInfo} data-animated="text1" data-anim-delay=".9">
            <div className={styles.windowsIcon}>
              <div className={styles.windowsPane} />
              <div className={styles.windowsPane} />
              <div className={styles.windowsPane} />
              <div className={styles.windowsPane} />
            </div>
            <span className={styles.platformText}>Windows Only</span>
          </div>
        </section>
        <section className={styles.s3} data-animated="text1" data-anim-delay="1">
          <Input id={idEmail}
                 name="Email"
                 label="Email:"
                 theme={K_Theme.Dark}
                 errorPlaceholder
                 value={email}
                 onChange={emailFn}
                 errorText={errorEmail}
                 errorBorder={errorEmail !== ''}
                 extraClass={styles.inp} />
          <PushButton theme={K_Theme.Dark}
                      extraClass={styles.btn}
                      onClick={() => {}}>
            Request Trial &nbsp;&nbsp;&nbsp;&nbsp;&gt;
          </PushButton>
        </section>
        <section className={styles.s4}>
          <div className={styles.txtSmall} data-animated="text1" data-anim-delay="1">
            Please refer to our <Link href="/privacy" className={styles.link}>privacy policy</Link> on how we protect your personal data.
          </div>
          <div className={styles.txtBig} data-animated="text1" data-anim-delay="1.05">
            Already a licensed customer? <Link href="/login" className={styles.link}>Login and download the latest version&nbsp;&nbsp;&gt;</Link>
          </div>
        </section>
        <div className={styles.spacer} />
        <Footer />
      </main>
    </AnimateX>
  );
};


// Force dynamic rendering for this page (resolves FOUC)
export const dynamic = 'force-dynamic';
export default TrialPage;
