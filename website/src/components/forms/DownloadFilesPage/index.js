'use client';

import axios from 'axios';
// Components
import LinkButton from '@/components/LinkButton';
// Styles
import styles from './styles.module.scss';


const DownloadFilesPage = ({ files }) => {
  return (
    <div className={styles.main}>
      <div className={styles.title}>Downloads</div>
      <div className={styles.cardArea}>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.heading}>Basic</div>
            <div className={styles.tier}>(Tier 1)</div>
            <div className={styles.desc}>ARR Analysis Excel Add-in</div>
            <LinkButton extraClass={styles.pbtn} href={`/api/download?file=${window.btoa(`tier01/${files.tier01.versions[0]}/${files.tier01.fileName}`)}`}>Download</LinkButton>
          </div>
        </div>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.heading}>Intermediate</div>
            <div className={styles.tier}>(Tier 2)</div>
            <div className={styles.desc}>ARR Analysis + Segmentation</div>
          </div>
        </div>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.heading}>Advanced</div>
            <div className={styles.tier}>(Tier 3)</div>
            <div className={styles.desc}>Enterprise</div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DownloadFilesPage;
