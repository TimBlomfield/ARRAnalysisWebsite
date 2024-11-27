'use client';

import { useCallback, useEffect, useState } from 'react';
// Components
import LinkButton from '@/components/LinkButton';
import Loading from '@/components/Loading';
// Styles
import styles from './styles.module.scss';


const DownloadFilesPage = ({ files }) => {
  const [arrEncoded_Tier01, setArrEncoded_Tier01] = useState(['']);
  const [arrEncoded_Tier02, setArrEncoded_Tier02] = useState(['']);
  const [arrEncoded_Tier03, setArrEncoded_Tier03] = useState(['']);
  const [loading, setLoading] = useState(true);

  const fnEncode = useCallback((f, tier) => {
    const fileName = f[tier].fileName;
    return f[tier].versions.map(ver => window.btoa(`${tier}/${ver}/${fileName}`));
  }, []);

  useEffect(() => {
    setArrEncoded_Tier01( fnEncode(files, 'tier01') );
    setArrEncoded_Tier02( fnEncode(files, 'tier02') );
    setArrEncoded_Tier03( fnEncode(files, 'tier03') );
    setLoading(false);
  }, [files]);

  return (
    <div className={styles.main}>
      <div className={styles.title}>Downloads</div>
      <div className={styles.cardArea}>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            {loading &&
              <div className={styles.loading}>
                <Loading scale={2} />
              </div>
            }
            {!loading &&
              <>
                <div className={styles.heading}>Basic</div>
                <div className={styles.tier}>(Tier 1)</div>
                <div className={styles.desc}>ARR Analysis Excel Add-in</div>
                <div className={styles.ver}>Version: <span className={styles.dk}>&nbsp;&nbsp;{files.tier01.versions[0]}</span></div>
                <LinkButton extraClass={styles.pbtn}
                            href={`/api/download?file=${arrEncoded_Tier01[0]}`}>Download</LinkButton>
                {arrEncoded_Tier01.length > 1 &&
                  <>
                    <div className={styles.older}>Older Versions</div>
                    {files.tier01.versions.map((ver, idx) => {
                      if (idx === 0) return null;
                      return (
                        <a className={styles.versionLink} key={idx} href={`/api/download?file=${arrEncoded_Tier01[idx]}`}>Version {ver}</a>
                      );
                    })}
                  </>
                }
              </>
            }
          </div>
        </div>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            {loading &&
              <div className={styles.loading}>
                <Loading scale={2} />
              </div>
            }
            {!loading &&
              <>
                <div className={styles.heading}>Intermediate</div>
                <div className={styles.tier}>(Tier 2)</div>
                <div className={styles.desc}>ARR Analysis + Segmentation</div>
                <div className={styles.ver}>Version: <span className={styles.dk}>&nbsp;&nbsp;{files.tier02.versions[0]}</span></div>
                <LinkButton extraClass={styles.pbtn}
                            href={`/api/download?file=${arrEncoded_Tier02[0]}`}>Download</LinkButton>
                {arrEncoded_Tier02.length > 1 &&
                  <>
                    <div className={styles.older}>Older Versions</div>
                    {files.tier02.versions.map((ver, idx) => {
                      if (idx === 0) return null;
                      return (
                        <a className={styles.versionLink} key={idx} href={`/api/download?file=${arrEncoded_Tier02[idx]}`}>Version {ver}</a>
                      );
                    })}
                  </>
                }
              </>
            }
          </div>
        </div>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            {loading &&
              <div className={styles.loading}>
                <Loading scale={2} />
              </div>
            }
            {!loading &&
              <>
                <div className={styles.heading}>Advanced</div>
                <div className={styles.tier}>(Tier 3)</div>
                <div className={styles.desc}>Enterprise</div>
                <div className={styles.ver}>Version: <span className={styles.dk}>&nbsp;&nbsp;{files.tier03.versions[0]}</span></div>
                <LinkButton extraClass={styles.pbtn}
                            href={`/api/download?file=${arrEncoded_Tier03[0]}`}>Download</LinkButton>
                {arrEncoded_Tier03.length > 1 &&
                  <>
                    <div className={styles.older}>Older Versions</div>
                    {files.tier03.versions.map((ver, idx) => {
                      if (idx === 0) return null;
                      return (
                        <a className={styles.versionLink} key={idx} href={`/api/download?file=${arrEncoded_Tier03[idx]}`}>Version {ver}</a>
                      );
                    })}
                  </>
                }
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
};


export default DownloadFilesPage;
