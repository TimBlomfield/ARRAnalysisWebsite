'use client';

import { useEffect, useState } from 'react';
import cn from 'classnames';
import { K_Theme, TierNames } from '@/utils/common';
import useVersionsStore from '@/utils/client/useVersionsStore';
// Components
import ChangeVersionNumberDialog from '@/components/dialogs/ChangeVersionNumberDialog';
import DeleteVersionDialog from '@/components/dialogs/DeleteVersionDialog';
import Footer from '@/components/admin/Footer';
import PushButton from '@/components/PushButton';
// Styles
import styles from './styles.module.scss';


const UploadVersionsClientPage = ({ files, versions, versionKeys, foulNames, topFolder, installsFolder }) => {
  const setVersions = useVersionsStore(state => state.setVersions);

  const [dlgChangeVersionNum, setDlgChangeVersionNum] = useState(null);
  const [dlgDeleteVersion, setDlgDeleteVersion] = useState(null);

  useEffect(() => {
    // Hydrate global store, to update the header data
    setVersions(versions);
    return () => setVersions();  // Unset (hydrate with default values) on unmount [just in case]
  }, [versions]);

  return (
    <div className={styles.main}>
      <div className={styles.listAndFooter}>
        <div className={styles.versions}>
          {versions.map((version, idx) => {
            const versionData = versionKeys[version];
            const tier1 = versionData.find(v => v.tier === 'tier01');
            const tier2 = versionData.find(v => v.tier === 'tier02');
            const tier3 = versionData.find(v => v.tier === 'tier03');
            const isTier1OK = tier1 && tier1.fileName === `${TierNames.Basic}.exe` && tier1.tierName === TierNames.Basic;
            const isTier2OK = tier2 && tier2.fileName === `${TierNames.SaaSAnalyst}.exe` && tier2.tierName === TierNames.SaaSAnalyst;
            const isTier3OK = tier3 && tier3.fileName === `${TierNames.FullStackAnalyst}.exe` && tier3.tierName === TierNames.FullStackAnalyst;
            return (
              <div className={styles.block} key={idx}>
                <div className={cn(styles.line, styles.l1)}>
                  <div className={styles.txtVer}>{version}</div>
                  <div className={styles.fnum}>
                    <div>Files:</div>
                    <div className={cn(styles.cnt, {[styles.err]: versionKeys[version].length !== 3})}>{versionKeys[version].length}</div>
                  </div>
                </div>
                <div className={cn(styles.line, styles.l2)}>
                  {tier1 ? <div className={cn(styles.tier, {[styles.bad]: !isTier1OK})}>Basic</div> : <div className={styles.empty} />}
                  {tier2 ? <div className={cn(styles.tier, {[styles.bad]: !isTier2OK})}>SaaS</div> : <div className={styles.empty} />}
                  {tier3 ? <div className={cn(styles.tier, {[styles.bad]: !isTier3OK})}>Full</div> : <div className={styles.empty} />}
                </div>
                <div className={cn(styles.line, styles.l3)}>
                  {isTier1OK && isTier2OK && isTier3OK &&
                    <>
                      <PushButton extraClass={styles.pbtn}
                                  onClick={() => setDlgChangeVersionNum(version)}>
                        Change #
                      </PushButton>
                      <PushButton extraClass={styles.pbtn}
                                  theme={K_Theme.Danger}
                                  onClick={() => setDlgDeleteVersion(version)}>
                        Delete
                      </PushButton>
                    </>
                  }
                </div>
              </div>
            );
          })}
        </div>
        {foulNames.length > 0 &&
          <div className={styles.foulNames}>
            <div className={styles.title}>Foul file-names detected:</div>
            {foulNames.map((foulName, idx) => (
              <div className={styles.foulName} key={idx}>{foulName}</div>
            ))}
          </div>
        }
        <div className={styles.spacer}></div>
        <Footer />
      </div>
      <ChangeVersionNumberDialog version={dlgChangeVersionNum}
                                 files={files}
                                 versionKeys={versionKeys}
                                 versions={versions}
                                 notifyClosed={() => setDlgChangeVersionNum(null)} />
      <DeleteVersionDialog version={dlgDeleteVersion}
                           files={files}
                           versionKeys={versionKeys}
                           notifyClosed={() => setDlgDeleteVersion(null)} />
    </div>
  );
};


export default UploadVersionsClientPage;
