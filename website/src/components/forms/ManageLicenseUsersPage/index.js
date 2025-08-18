'use client';

import { useState, useReducer, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import cn from 'classnames';
import axios from 'axios';
import { toast } from 'react-toastify';
import { K_Theme } from '@/utils/common';
// Components
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog';
import Footer from '@/components/admin/Footer';
import LinkButton from '@/components/LinkButton';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
import RegLicenseDesc from '@/components/RegLicenseDesc';
// Images
import QuestionSvg from '@/../public/question.svg';
import HazardSvg from '@/../public/hazard.svg';
// Styles
import styles from './styles.module.scss';


const ManageLicenseUsersPage = ({ license, customer }) => {
  const router = useRouter();
  const pathname = usePathname();

  const refUser = useRef(null);

  const [licenseData] = useState(() => ({
    status: license.status,
    productName: license.product.product_name,
    type: license.license_type,
    validUntil: license.validity_period,
  }));
  const [confirmDisallowDlg, setConfirmDisallowDlg] = useState(false);
  const [confirmDeleteDlg, setConfirmDeleteDlg] = useState(false);
  const [loadingLine, setLoadingLine] = useReducer(
    (state, action) => ({ ...state, [action.email]: action.type === 'set' }),
    {}
  );

  const onBtnReSend = useCallback(person => {
    setLoadingLine({ type: 'set', email: person.email });

    axios.post('/api/licensing/resend-email', { person })
      .then(res => {
        setLoadingLine({ type: 'reset', email: person.email });
        toast.success(res.data?.message ?? 'Email sent!');
      })
      .catch(err => {
        setLoadingLine({ type: 'reset', email: person.email });
        toast.error(err.response?.data?.message ?? 'Could not re-send email!');
      });
  }, []);

  const onBtnUninvite = useCallback(person => {
    setLoadingLine({ type: 'set', email: person.email });

    axios.post('/api/licensing/uninvite-user-for-license', { id: person.id, email: person.email, pathname })
      .then(res => {
        setLoadingLine({ type: 'reset', email: person.email });
        toast.success(res.data?.message ?? 'Uninvited!');
        router.refresh();
      })
      .catch(err => {
        setLoadingLine({ type: 'reset', email: person.email });
        toast.error(err.response?.data?.message ?? 'Could not uninvite!');
      });
  }, []);

  const onBtnDisallow = useCallback(user => {
    setConfirmDisallowDlg(true);
    refUser.current = { user, terminate: false };
  }, []);

  const onBtnDelete = useCallback(user => {
    setConfirmDeleteDlg(true);
    refUser.current = { user, terminate: true };
  }, []);

  const onConfirmDisallowOrDelete = useCallback(() => {
    const { user, terminate } = refUser.current;
    setLoadingLine({ type: 'set', email: user.data.email });

    axios.post('/api/licensing/disallow-user', {
      id: user.id,
      email: user.data.email,
      using: user.using,
      licenseId: license.id,
      pathname,
      terminate,
    })
      .then(res => {
        setLoadingLine({ type: 'reset', email: user.data.email });
        toast.success(res.data?.message ?? 'Disallowed!');
        router.refresh();
      })
      .catch(err => {
        setLoadingLine({ type: 'reset', email: user.data.email });
        toast.error(err.response?.data?.message ?? 'Could not disallow!');
      });
  }, []);

  const { mailsSent } = license;

  return (
    <>
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
        <div className={styles.listAndFooter}>
          <div className={styles.bottom}>
            {Array.isArray(mailsSent) && mailsSent.length > 0 &&
              <>
                <div className={styles.t1}>Email invitation(s) sent for this license:</div>
                <div className={styles.t2}>These are potential portal users. By uninviting them, they will not be able to register as portal users.</div>
                <div className={cn(styles.bars, styles.padBottom)}>
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
                    const bBusy = loadingLine[person.email] === true;
                    return (
                      <div className={styles.bar} key={person.id}>
                        <div className={styles.invitee}>
                          {person.email}
                          {other != null && <span className={styles.other}>{other}</span>}
                        </div>
                        <div className={styles.spacer} />
                        {bBusy && <Loading theme={K_Theme.Dark} />}
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
            {Array.isArray(customer.users) && customer.users.length > 0 &&
              <>
                <div className={styles.t1}>Users who are allowed to use this license:</div>
                <div className={styles.bars}>
                  {customer.users.map(user => {
                    let other;
                    let bF = user.data.firstName !== '';
                    let bL = user.data.lastName !== '';
                    if (bF || bL) {
                      other = ' (';
                      if (bF) {
                        other += user.data.firstName;
                        if (bL) other += ', ';
                      }
                      if (bL) other += user.data.lastName;
                      other += ')';
                    }
                    const bBusy = loadingLine[user.data.email] === true;
                    const bMultipleLicenses = user.licenseIds.length > 1;
                    return (
                      <div className={styles.bar} key={user.id}>
                        <div className={styles.user}>
                          {user.data.email}
                          {other != null && <span className={styles.other}>{other}</span>}
                        </div>
                        {user.using && <div className={styles.usingBar}
                                            title={`${user.data.email} is assigned to this license (meaning they are using the add-in).`}>Assigned</div>}
                        <div className={styles.spacer} />
                        {bBusy && <Loading theme={K_Theme.Light} />}
                        <PushButton extraClass={styles.pbX}
                                    textExtraClass={styles.txX}
                                    disabled={bBusy}
                                    onClick={() => onBtnDisallow(user)}>
                          Disallow
                        </PushButton>
                        <PushButton theme={K_Theme.Danger}
                                    extraClass={styles.pbX}
                                    textExtraClass={styles.txX}
                                    disabled={bBusy || bMultipleLicenses}
                                    {...(bMultipleLicenses ? { title: 'This user is allowed for multiple licenses.' } : {})}
                                    onClick={() => onBtnDelete(user)}>
                          Delete
                        </PushButton>
                      </div>
                    );
                  })}
                </div>
              </>
            }
          </div>
          <div className={styles.spacer} />
          <Footer />
        </div>
      </div>
      <ConfirmationDialog isOpen={confirmDisallowDlg}
                          notifyClosed={() => setConfirmDisallowDlg(false)}
                          titleText="Please Confirm"
                          button1Text="Disallow"
                          onConfirm={onConfirmDisallowOrDelete}>
        <div className={styles.dlg}>
          <QuestionSvg className={styles.img} />
          <div className={styles.second}>
            <div className={styles.t1}>Are you sure you want to disallow this user?</div>
            <div className={styles.t2}>{refUser.current?.user.data.email}</div>
          </div>
        </div>
      </ConfirmationDialog>
      <ConfirmationDialog isOpen={confirmDeleteDlg}
                          danger
                          notifyClosed={() => setConfirmDeleteDlg(false)}
                          titleText="Please Confirm"
                          button1Text="Delete"
                          onConfirm={onConfirmDisallowOrDelete}>
        <div className={styles.dlg}>
          <HazardSvg className={styles.img} />
          <div className={styles.second}>
            <div className={styles.t1}>Are you sure you want to delete this user?</div>
            <div className={styles.t2}>{refUser.current?.user.data.email}</div>
          </div>
        </div>
      </ConfirmationDialog>
    </>
  );
};


export default ManageLicenseUsersPage;
