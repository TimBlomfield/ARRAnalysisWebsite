'use client';

import { useCallback, useEffect, useState } from 'react';
import { TierNames } from '@/utils/common';
// Components
import Footer from '@/components/admin/Footer';
import LinkButton from '@/components/LinkButton';
import Loading from '@/components/Loading';
// Styles
import styles from './styles.module.scss';


const FileNotFound = () => (
  <div className={styles.errorArea}>
    ERROR: file not found on server
  </div>
);


const DownloadNotAllowed = () => (
  <div className={styles.errorArea}>
    You neither own a license for this product nor are you assigned to one.
  </div>
);


const DownloadFilesPage = ({ files, isAdmin, allowed }) => {
  const [arrEncoded_Tier01, setArrEncoded_Tier01] = useState(['']);
  const [arrEncoded_Tier02, setArrEncoded_Tier02] = useState(['']);
  const [arrEncoded_Tier03, setArrEncoded_Tier03] = useState(['']);
  const [loading, setLoading] = useState(true);

  const fnEncode = useCallback((f, tier) => {
    if (f[tier] == null)
      return '';
    const fileName = f[tier].fileName;
    return f[tier].versions.map(ver => window.btoa(`${ver}/${tier}/${fileName}`));
  }, []);

  useEffect(() => {
    setArrEncoded_Tier01( fnEncode(files, 'tier01') );
    setArrEncoded_Tier02( fnEncode(files, 'tier02') );
    setArrEncoded_Tier03( fnEncode(files, 'tier03') );
    setLoading(false);
  }, [files]);

  const tierCondition = [
    files.tier01 != null && (isAdmin || allowed[0]),
    files.tier02 != null && (isAdmin || allowed[1]),
    files.tier03 != null && (isAdmin || allowed[2]),
  ];

  return (
    <div className={styles.main}>
      <div className={styles.title}>Downloads</div>
      <div className={styles.cardsAndFooter}>
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
                  <div className={styles.heading}>{TierNames.Basic}</div>
                  <div className={styles.tier}>(Tier 1)</div>
                  <div className={styles.desc}>ARR Analysis Excel Add-in</div>
                  {files.tier01 == null && <FileNotFound />}
                  {files.tier01 != null &&
                    <>
                      {tierCondition[0] &&
                        <>
                          <div className={styles.ver}>Version: <span className={styles.dk}>&nbsp;&nbsp;{files.tier01.versions[0]}</span></div>
                          <LinkButton extraClass={styles.pbtn}
                                      prefetch={false}
                                      href={`/api/download?file=${arrEncoded_Tier01[0]}`}>Download</LinkButton>
                          {arrEncoded_Tier01.length > 1 &&
                            <>
                              <div className={styles.older}>Older Versions</div>
                              {files.tier01.versions.map((ver, idx) => {
                                if (idx === 0) return null;
                                return (
                                  <a className={styles.versionLink} key={idx} rel="nofollow" href={`/api/download?file=${arrEncoded_Tier01[idx]}`}>Version {ver}</a>
                                );
                              })}
                            </>
                          }
                        </>
                      }
                      {!tierCondition[0] && <DownloadNotAllowed />}
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
                  <div className={styles.heading}>{TierNames.SaaSAnalyst}</div>
                  <div className={styles.tier}>(Tier 2)</div>
                  <div className={styles.desc}>ARR Analysis Excel Add-in</div>
                  {files.tier02 == null && <FileNotFound />}
                  {files.tier02 != null &&
                    <>
                      {tierCondition[1] &&
                        <>
                          <div className={styles.ver}>Version: <span className={styles.dk}>&nbsp;&nbsp;{files.tier02.versions[0]}</span></div>
                          <LinkButton extraClass={styles.pbtn}
                                      prefetch={false}
                                      href={`/api/download?file=${arrEncoded_Tier02[0]}`}>Download</LinkButton>
                          {arrEncoded_Tier02.length > 1 &&
                            <>
                              <div className={styles.older}>Older Versions</div>
                              {files.tier02.versions.map((ver, idx) => {
                                if (idx === 0) return null;
                                return (
                                  <a className={styles.versionLink} key={idx} rel="nofollow" href={`/api/download?file=${arrEncoded_Tier02[idx]}`}>Version {ver}</a>
                                );
                              })}
                            </>
                          }
                        </>
                      }
                      {!tierCondition[1] && <DownloadNotAllowed />}
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
                  <div className={styles.heading}>{TierNames.FullStackAnalyst}</div>
                  <div className={styles.tier}>(Tier 3)</div>
                  <div className={styles.desc}>ARR Analysis Excel Add-in</div>
                  {files.tier03 == null && <FileNotFound />}
                  {files.tier03 != null &&
                    <>
                      {tierCondition[2] &&
                        <>
                          <div className={styles.ver}>Version: <span className={styles.dk}>&nbsp;&nbsp;{files.tier03.versions[0]}</span></div>
                          <LinkButton extraClass={styles.pbtn}
                                      prefetch={false}
                                      href={`/api/download?file=${arrEncoded_Tier03[0]}`}>Download</LinkButton>
                          {arrEncoded_Tier03.length > 1 &&
                            <>
                              <div className={styles.older}>Older Versions</div>
                              {files.tier03.versions.map((ver, idx) => {
                                if (idx === 0) return null;
                                return (
                                  <a className={styles.versionLink} key={idx} rel="nofollow" href={`/api/download?file=${arrEncoded_Tier03[idx]}`}>Version {ver}</a>
                                );
                              })}
                            </>
                          }
                        </>
                      }
                      {!tierCondition[2] && <DownloadNotAllowed />}
                    </>
                  }
                </>
              }
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};


export default DownloadFilesPage;
