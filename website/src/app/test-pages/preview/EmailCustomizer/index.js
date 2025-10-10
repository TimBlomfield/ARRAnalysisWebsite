'use client';

import { Fragment, useCallback, useEffect, useReducer, useState } from 'react';
import cn from 'classnames';
import axios from 'axios';
import { toast } from 'react-toastify';
import { K_Theme, TierNames } from '@/utils/common';
import { validateUnicodeEmail } from '@/utils/validators';
import thankYouEmail from '@/utils/emails/thank-you.html';
import resetPasswordEmail from '@/utils/emails/reset-password.html';
// Components
import CheckBox from '@/components/CheckBox';
import Drawer from '@/components/Drawer';
import IconButton from '@/components/IconButton';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Images
import TriangleSvg from '@/../public/DropdownTriangle.svg';
// Styles
import styles from './styles.module.scss';


const EmailTemplates = {
  'Thank You': thankYouEmail,
  'Reset Password': resetPasswordEmail,
};

const DefaultReplacements = {
  '[[Customer Name]]': 'John Doe',
  '[[Subscription]]': '4 subscriptions',
  '[[Tier]]': TierNames.SaaSAnalyst,
  '[[Product Name]]': `ARR Analysis Excel Add-In (${TierNames.SaaSAnalyst})`,
  '[[Subscription Type]]': 'Monthly',
  '[[Purchase Date]]': '17 Feb 2023',
  '[[Your Name]]': 'Maci Middleton',
  '[[Your Company]]': 'ARR Analysis',
  '[[Current Year]]': '2023',
  '[[Customer Email]]': 'john.doe@example.com',
};


const DrawerHeader = ({ to, setTo, subject, setSubject, flash, setFlash, collapsed, expandCollapse, sending, sendEmail }) => (
  <div className={styles.drawerHeader}>
    <IconButton theme={K_Theme.Light} transparent invertBkTheme svg={TriangleSvg} svgClassName={cn(styles.triangle, {[styles.expanded]: !collapsed})} onClick={expandCollapse} />
    <Input theme={K_Theme.Dark}
           name="to"
           type="email"
           maxLength={50}
           placeholder="To"
           wrapperExtraClass={styles.inpWrap}
           extraClass={styles.inp}
           style={{ height: 38, fontSize: 15 }}
           value={to}
           onChange={evt => setTo(evt.target.value)} />
    <Input theme={K_Theme.Dark}
           name="subject"
           type="text"
           maxLength={100}
           placeholder="Subject"
           wrapperExtraClass={styles.inpWrap}
           extraClass={styles.inp}
           style={{ height: 38, fontSize: 15 }}
           value={subject}
           onChange={evt => setSubject(evt.target.value)} />
    <PushButton theme={K_Theme.Dark} extraClass={styles.btn} disabled={sending} onClick={sendEmail}>Send</PushButton>
    <CheckBox checked={flash} setChecked={setFlash} text="Flash" />
  </div>
);


const EmailCustomizer = ({ which, loginUrl, passwordResetUrl, logoUrl }) => {
  const [fileContent, setFileContent] = useState('loading');
  const [matches, setMatches] = useState([]);
  const [inpTo, setInpTo] = useState('');
  const [inpSubject, setInpSubject] = useState('');
  const [chkFlash, setChkFlash] = useState(false);
  const [sending, setSending] = useState(false);
  const [__html, set__html] = useState(null);
  const [replacements, setReplacements] = useReducer((state, action) => ({ ...state, [action.name]: action.value }), {});

  useEffect(() => {
    let fc = EmailTemplates[which] || null;

    if (fc) {
      fc = fc.replaceAll('[[Logo URL]]', logoUrl)
        .replaceAll('[[Login URL]]', loginUrl)
        .replaceAll('[[Password Reset URL]]', passwordResetUrl);

      const m = fc.match(/\[\[.*?]]/g);
      const uniq = [...new Set(m)];

      uniq.forEach(name => setReplacements({ name, value: DefaultReplacements[name] ?? '' }));

      setMatches(uniq);
    }

    setFileContent(fc);
  }, []);

  useEffect(() => {
    let fc = fileContent;
    matches.forEach(match => { fc = fc.replaceAll(match, chkFlash ? `<span class="${styles.eVar}">${replacements[match]}</span>` : replacements[match]); });
    set__html(fc);
  }, [fileContent, replacements, chkFlash]);

  const sendEmail = useCallback(() => {
    if (!validateUnicodeEmail(inpTo)) {
      toast.error('Invalild recipient email!');
      return;
    }

    setSending(true);

    let fc = fileContent;
    matches.forEach(match => { fc = fc.replaceAll(match, replacements[match]); });

    axios.post('/api/send-test-email', { to: inpTo, subject: inpSubject, html: fc })
      .then(res => {
        setSending(false);
        toast.success(res.data?.message ?? 'Email sent indeed!');
      })
      .catch(err => {
        setSending(false);
        toast.error(err.response?.data?.message ?? 'Could not send email!');
      });
  }, [inpTo, inpSubject]);

  if (fileContent === null)
    return (
      <main className={cn(styles.main, styles.center)}>
        <div className={styles.txtNotFound}>Template not found!</div>
      </main>
    );

  if (fileContent === 'loading')
    return (
      <main className={cn(styles.main, styles.center)}>
        <Loading scale={2} />
      </main>
    );

  return (
    <main className={styles.main}>
      <Drawer header={<DrawerHeader to={inpTo}
                                    setTo={setInpTo}
                                    subject={inpSubject}
                                    setSubject={setInpSubject}
                                    flash={chkFlash}
                                    setFlash={setChkFlash}
                                    sending={sending}
                                    sendEmail={sendEmail} />} initiallyCollapsed>
        <div className={styles.drawerInner}>
          {matches.map(match => (
            <Fragment key={match}>
              <div className={cn(styles.cell, styles.labelCell)}>{match} :</div>
              <div className={styles.cell}>
                <Input theme={K_Theme.Dark}
                       name={match}
                       type="text"
                       maxLength={200}
                       placeholder="Replacement"
                       wrapperExtraClass={styles.inpWrapRep}
                       extraClass={styles.inpRep}
                       style={{ height: 38, fontSize: 15 }}
                       value={replacements[match]}
                       onChange={evt => setReplacements({ name: match, value: evt.target.value })} />
              </div>
            </Fragment>
          ))}
        </div>
      </Drawer>
      {__html != null && <div dangerouslySetInnerHTML={{ __html }} />}
    </main>
  );
};


export default EmailCustomizer;
