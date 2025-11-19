'use client';

import { useCallback } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
// Components
import AnimateX from '@/components/AnimateX';
import Footer from '@/components/Footer';
import PushButton from '@/components/PushButton';
// Images
import DownloadSvg from '@/../public/download.svg';
// Styles
import styles from './styles.module.scss';


const DownloadTrialClientPage = ({ token, password, email }) => {
  const router = useRouter();

  const onDownloadClick = useCallback(() => {
    axios.post('/api/trial-download', { token })
      .then(res => {
        if (res.data.redirect === true)
          router.push(`/trial/expired?email=${encodeURIComponent(email)}`);
        else
          window.location.href = res.data.url;
      })
      .catch(err => {
        toast.error(err.response?.data?.message ?? 'Unexpected error while downloading.');
      });
  }, [token]);

  return (
    <AnimateX>
      <div className={styles.main}>
        <section className={styles.titleArea}>
          <div className={styles.title}>Download our software</div>
        </section>
        <section className={styles.s1}>
          <div className={styles.txtDownload}>Download your free trial</div>
          <p>
            <span className={styles.txtDesc}>
              Thanks again for your interest in ARR Analysis Excel Add-in. Please follow the instructions below to install
              your free trial. For later reference, we have also sent you an email with all information about your ARR
              Analysis Excel Add-in trial. You can safely forward this email to other colleagues who might be interested
              in testing our software.
            </span>
          </p>
        </section>
        <section className={styles.s2}>
          <div className={styles.txtInstall}>How to install the free trial</div>
          <div className={styles.numGrid}>
            <div className={styles.cell}><div className={styles.num}>1</div></div>
            <div className={styles.cell}>
              <div className={cn(styles.txtDesc, styles.f16)}>Our software works with:</div>
              <ul className={cn(styles.txtDesc, styles.f16)}>
                <li>All Windows versions since Windows 7</li>
                <li>Microsoft Excel versions 2016, 2019, 2021 and Excel 365</li>
                <li>It does not work with Excel 365 Online</li>
              </ul>
            </div>
            <div className={styles.cell}><div className={styles.num}>2</div></div>
            <div className={styles.cell}>
              <div className={cn(styles.txtDesc, styles.f16)}>Download the setup file and open it:</div>
              <PushButton extraClass={styles.btnDownload}
                          textExtraClass={styles.btnTxt}
                          onClick={onDownloadClick}>
                <DownloadSvg className={styles.dload} />
                Download ARR Analysis
              </PushButton>
            </div>
            <div className={styles.cell}><div className={styles.num}>3</div></div>
            <div className={styles.cell}>
              <div className={cn(styles.txtDesc, styles.f16)}>Follow the instructions of the setup wizard.</div>
            </div>
            <div className={styles.cell}><div className={styles.num}>4</div></div>
            <div className={styles.cell}>
              <div className={cn(styles.txtDesc, styles.f16)}>Open Microsoft Excel.</div>
            </div>
            <div className={styles.cell}><div className={styles.num}>5</div></div>
            <div className={styles.cell}>
              <div className={cn(styles.txtDesc, styles.f16)}>Navigate to the <em>ARR Analysis</em> tab in the ribbon bar and click on the <em>License</em> button to invoke the activation dialog.</div>
              <div className={cn(styles.txtDesc, styles.f16, styles.mt8)}>Enter the following credentials:</div>
              <div className={cn(styles.txtDesc, styles.f16)}>Your Email:</div>
              <div className={cn(styles.txtDesc, styles.f16, styles.pad)}><em>{email}</em></div>
              <div className={cn(styles.txtDesc, styles.f16)}>Your License Password:</div>
              <div className={cn(styles.txtDesc, styles.f16, styles.pad)}><em>{password}</em></div>
              <div className={cn(styles.txtDesc, styles.f16, styles.mt8)}>Please do not pass on the license password to people outside of your company.</div>
            </div>
            <div className={styles.cell}><div className={styles.num}>6</div></div>
            <div className={styles.cell}>
              <div className={cn(styles.txtDesc, styles.f16)}>For detailed usage, please refer to our <Link href="/help-center/excel-addin/usage" className={styles.link}>usage section</Link> and our <Link href="https://www.youtube.com/watch?v=SdYn5xJpA6Y" target="_blank" className={styles.link}>overview video</Link>.</div>
            </div>
          </div>
        </section>
        <section className={styles.s3}></section>
        <Footer />
      </div>
    </AnimateX>
  );
};


export default DownloadTrialClientPage;
