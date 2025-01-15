'use client';

import cn from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import zxcvbn from 'zxcvbn';
import axios from 'axios';
import { toast } from 'react-toastify';
import { K_Theme } from '@/utils/common';
import Flags from 'country-flag-icons/react/3x2';
import { getCountryCodeFromNumber } from '@/utils/phone';
import { mkFix } from '@/utils/func';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PasswordStrength from '@/components/PasswordStrength';
import PhoneInput from '@/components/PhoneInput';
import PushButton from '@/components/PushButton';
// Images
import InterphoneSvg from '@/../public/international-call.svg';
// Styles
import styles from './styles.module.scss';


const ProfileClientPage = ({ user }) => {
  // Local state
  const [defaultLocale, setDefaultLocale] = useState('en-US');
  //// Contact details
  const [changed_formContactDetails, setChanged_formContactDetails] = useState(false);
  const [processing_formContactDetails, setProcessing_formContactDetails] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone);
  const [jobTitle, setJobTitle] = useState(user.jobTitle);
  const [company, setCompany] = useState(user.company);
  //// Password
  const [changed_formPassword, setChanged_formPassword] = useState(false);
  const [processing_formPassword, setProcessing_formPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [errNewPassword, setErrNewPassword] = useState('');
  const [pwdConfirmation, setPwdConfirmation] = useState('');
  const [errConfirmPassword, setErrConfirmPassword] = useState('');

  const handleInputChange = useCallback((val, fn, errFn = null, sectChgFn = null) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        if (errFn) errFn('');
        if (sectChgFn) sectChgFn(true);
      }
    };
  }, []);
  const handleValueChange = useCallback((val, fn, errFn = null, sectChgFn = null) => {
    return value => {
      if (val !== value) {
        fn(value);
        if (errFn) errFn('');
        if (sectChgFn) sectChgFn(true);
      }
    };
  }, []);
  const firstNameFn = handleInputChange(firstName, setFirstName, null, setChanged_formContactDetails);
  const lastNameFn = handleInputChange(lastName, setLastName, null, setChanged_formContactDetails);
  const phoneFn = handleValueChange(phone, setPhone, null, setChanged_formContactDetails);
  const jobTitleFn = handleInputChange(jobTitle, setJobTitle, null, setChanged_formContactDetails);
  const companyFn = handleInputChange(company, setCompany, null, setChanged_formContactDetails);

  const newPasswordFn = handleInputChange(newPassword, setNewPassword, setErrNewPassword, setChanged_formPassword);
  const confirmationFn = handleInputChange(pwdConfirmation, setPwdConfirmation, setErrConfirmPassword, setChanged_formPassword);

  // Effects
  useEffect(() => { setDefaultLocale(navigator?.language || 'en-US'); }, []);

  // Memo render functions
  const contactDetails_memoRender = useMemo(() => {
    const regionNamesLocalized = new Intl.DisplayNames([defaultLocale], { type: 'region' });

    let Flag = null, flagTitle = '';
    const countryCode = getCountryCodeFromNumber(phone);
    if (countryCode != null && Flags[countryCode] != null) {
      Flag = Flags[countryCode];
      flagTitle = mkFix(regionNamesLocalized.of(countryCode));
    }

    const onBtnSubmit = () => {
      setProcessing_formContactDetails(true);

      axios.post('/api/profile/update-contact-details', { firstName, lastName, phone, jobTitle, company })
        .then(res => {
          setProcessing_formContactDetails(false);
          setChanged_formContactDetails(false);
          toast.success(res.data?.message ?? 'Your contact details were updated!');
        })
        .catch(err => {
          setProcessing_formContactDetails(false);
          toast.error(err.response?.data?.message ?? 'Could not update your contact details!');
        });
    };

    return (
      <>
        <div className={styles.sectionTitle}>Your contact details</div>
        <section className={styles.sectionForm}>
          {processing_formContactDetails && <div className={styles.overlay}><Loading scale={2} text="Updating Contact Details" /></div>}
          <Input theme={K_Theme.Dark}
                 maxLength={100}
                 name="first-name"
                 type="text"
                 label="First Name"
                 placeholder="First Name"
                 autoComplete="given-name"
                 disabled={processing_formContactDetails}
                 extraClass={styles.input}
                 value={firstName}
                 onChange={firstNameFn} />
          <Input theme={K_Theme.Dark}
                 maxLength={100}
                 name="last-name"
                 type="text"
                 label="Last Name"
                 placeholder="Last Name"
                 autoComplete="family-name"
                 disabled={processing_formContactDetails}
                 extraClass={styles.input}
                 value={lastName}
                 onChange={lastNameFn} />
          <div className={styles.phoneLine}>
            <PhoneInput theme={K_Theme.Dark}
                        name="telephone"
                        type="text"
                        label="Phone"
                        placeholder="e.g. +1 234 567 8988"
                        disabled={processing_formContactDetails}
                        extraClass={styles.phoneInput}
                        wrapperExtraClass={styles.wrapperPhone}
                        value={phone}
                        changeFn={phoneFn} />
            <div className={styles.flag} title={flagTitle}>
              {Flag != null
                ? <Flag className={cn(styles.rcflag, {[styles.disabled]: processing_formContactDetails})} />
                : <InterphoneSvg className={cn(styles.interphone, {[styles.disabled]: processing_formContactDetails})} />
              }
            </div>
            <div className={styles.txtCountry}>{flagTitle}</div>
          </div>
          <Input theme={K_Theme.Dark}
                 maxLength={100}
                 name="job-title"
                 type="text"
                 label="Job Title"
                 placeholder="Job Title"
                 autoComplete="organization-title"
                 disabled={processing_formContactDetails}
                 extraClass={styles.input}
                 value={jobTitle}
                 onChange={jobTitleFn} />
          <Input theme={K_Theme.Dark}
                 maxLength={150}
                 name="company"
                 type="text"
                 label="Company"
                 placeholder="Company"
                 autoComplete="organization"
                 disabled={processing_formContactDetails}
                 extraClass={styles.input}
                 value={company}
                 onChange={companyFn} />
          <PushButton extraClass={styles.pbtn}
                      theme={K_Theme.Dark}
                      {...((processing_formContactDetails || !changed_formContactDetails) ? { disabled: true } : {})}
                      onClick={onBtnSubmit}>
            Update
          </PushButton>
        </section>
      </>
    );
  }, [defaultLocale, changed_formContactDetails, processing_formContactDetails, firstName, lastName, phone, jobTitle, company]);

  const password_memoRender = useMemo(() => {
    const onBtnSubmit = () => {
      let bError = false;

      if (newPassword.length < 8) {
        bError = true;
        setErrNewPassword('Password must contain at least 8 characters');
      } else {
        const zxc = zxcvbn(newPassword);
        if (zxc.score < 3) {
          bError = true;
          setErrNewPassword('Password strength must be at least "Good"');
        }
      }

      if (pwdConfirmation !== newPassword) {
        bError = true;
        setErrConfirmPassword('Password confirmation does not match');
      }

      if (!bError) {
        setProcessing_formPassword(true);

        axios.post('/api/profile/update-password', { newPassword })
          .then(res => {
            setProcessing_formPassword(false);
            setChanged_formPassword(false);
            setNewPassword('');
            setErrNewPassword('');
            setPwdConfirmation('');
            setErrConfirmPassword('');
            toast.success(res.data?.message ?? 'Your password was updated!');
          })
          .catch(err => {
            setProcessing_formPassword(false);
            toast.error(err.response?.data?.message ?? 'Could not change your password!');
          });
      }
    };

    return (
      <>
        <div className={cn(styles.sectionTitle, styles.mt)}>Your password</div>
        <section className={styles.sectionForm}>
          {processing_formPassword && <div className={styles.overlay}><Loading scale={2} text="Updating Password" /></div>}
          <Input theme={K_Theme.Dark}
                 maxLength={30}
                 name="new-password"
                 type="password"
                 label="New password"
                 placeholder="Your new password here"
                 autoComplete="new-password"
                 disabled={processing_formPassword}
                 errorPlaceholder
                 errorBorder={!!errNewPassword}
                 errorText={errNewPassword}
                 errorTextExtraClass={styles.err}
                 extraClass={cn(styles.input, styles.pwd)}
                 value={newPassword}
                 onChange={newPasswordFn} />
          <Input theme={K_Theme.Dark}
                 maxLength={30}
                 name="confirm-password"
                 type="password"
                 label="Confirmation"
                 placeholder="Please repeat your new password"
                 autoComplete="new-password"
                 disabled={processing_formPassword}
                 errorPlaceholder
                 errorBorder={!!errConfirmPassword}
                 errorText={errConfirmPassword}
                 errorTextExtraClass={styles.err}
                 extraClass={cn(styles.input, styles.pwd)}
                 value={pwdConfirmation}
                 onChange={confirmationFn} />
          <PasswordStrength password={newPassword} extraClass={styles.pwdXtra} />
          <PushButton extraClass={styles.pbtn}
                      theme={K_Theme.Dark}
                      {...((processing_formPassword || !changed_formPassword || errNewPassword || errConfirmPassword) ? { disabled: true } : {})}
                      onClick={onBtnSubmit}>
            Update
          </PushButton>
        </section>
      </>
    );
  }, [changed_formPassword, processing_formPassword, newPassword, pwdConfirmation, errNewPassword, errConfirmPassword]);

  return (
    <div className={styles.main}>
      {contactDetails_memoRender}
      {password_memoRender}
    </div>
  );
};


export default ProfileClientPage;
