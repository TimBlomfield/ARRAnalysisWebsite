'use client';

import { useState, useReducer, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { K_Theme } from '@/utils/common';
// Components
import LinkButton from '@/components/LinkButton';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
import RegLicenseDesc from '@/components/RegLicenseDesc';
// Styles
import styles from './styles.module.scss';


const ManageLicenseUsersPage = ({ license, customer }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [licenseData] = useState(() => ({
    status: license.status,
    productName: license.product.product_name,
    type: license.license_type,
    validUntil: license.validity_period,
  }));
  const [loadingReSendUninvite, setLoadingReSendUninvite] = useReducer(
    (state, action) => ({ ...state, [action.email]: action.type === 'set' }),
    {}
  );

  const onBtnReSend = useCallback(person => {
    setLoadingReSendUninvite({ type: 'set', email: person.email });

    axios.post('/api/licensing/resend-email', { person })
      .then(res => {
        setLoadingReSendUninvite({ type: 'reset', email: person.email });
        toast.success(res.data?.message ?? 'Email sent!');
      })
      .catch(err => {
        setLoadingReSendUninvite({ type: 'reset', email: person.email });
        toast.error(err.response?.data?.message ?? 'Could not re-send email!');
      });
  }, []);

  const onBtnUninvite = useCallback(person => {
    setLoadingReSendUninvite({ type: 'set', email: person.email });

    axios.post('/api/licensing/uninvite-user-for-license', { id: person.id, email: person.email, pathname })
      .then(res => {
        setLoadingReSendUninvite({ type: 'reset', email: person.email });
        toast.success(res.data?.message ?? 'Uninvited!');
        router.refresh();
      })
      .catch(err => {
        setLoadingReSendUninvite({ type: 'reset', email: person.email });
        toast.error(err.response?.data?.message ?? 'Could not uninvite!');
      });
  }, []);

  const { mailsSent } = license;

  return (
    <div className={styles.main}>
      <div className={styles.licenseDesc}>
        <LinkButton extraClass={styles.pbXtra}
                    href="/admin/licenses">
          🠈 Back
        </LinkButton>
        <div className={styles.lic}>
          <RegLicenseDesc licenseData={licenseData} />
        </div>
      </div>
      <div className={styles.bottom}>
        {Array.isArray(mailsSent) && mailsSent.length > 0 &&
          <>
            <div className={styles.t1}>Email invitation(s) sent for this license:</div>
            <div className={styles.t2}>These are potential portal users. By uninviting them, they will not be able to register as portal users.</div>
            <div className={styles.bars}>
              {mailsSent.map(person => {
                let other;
                let bF = person.f != null && typeof person.f === 'string' && person.f.length > 0;
                let bL = person.l != null && typeof person.l === 'string' && person.l.length > 0;
                if (bF || bL) {
                  other = ' (';
                  if (bF) {
                    other += person.f;
                    if (bL) other += ', ';
                  }
                  if (bL) other += person.l;
                  other += ')';
                }
                const bBusy = loadingReSendUninvite[person.email] === true;
                return (
                  <div className={styles.bar} key={person.id}>
                    <div className={styles.invitee}>
                      {person.email}
                      {other != null && <span className={styles.other}>{other}</span>}
                    </div>
                    <div className={styles.spacer} />
                    {bBusy && <Loading theme={K_Theme.Light} />}
                    <PushButton extraClass={styles.pbX}
                                textExtraClass={styles.txX}
                                disabled={bBusy}
                                onClick={() => onBtnReSend(person)}>
                      Re-send email
                    </PushButton>
                    <PushButton extraClass={styles.pbX}
                                textExtraClass={styles.txX}
                                disabled={bBusy}
                                onClick={() => onBtnUninvite(person)}>
                      Uninvite
                    </PushButton>
                  </div>
                );
              })}
            </div>
          </>
        }
      </div>
    </div>
  );
};


export default ManageLicenseUsersPage;
