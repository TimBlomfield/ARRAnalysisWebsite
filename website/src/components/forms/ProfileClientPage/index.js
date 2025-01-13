'use client';

import cn from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { K_Theme } from '@/utils/common';
import Flags from 'country-flag-icons/react/3x2';
import { getCountryCodeFromNumber } from '@/utils/phone';
import { mkFix } from '@/utils/func';
// Components
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PhoneInput from '@/components/PhoneInput';
// Images
import InterphoneSvg from '@/../public/international-call.svg';
// Styles
import styles from './styles.module.scss';


const ProfileClientPage = ({ user }) => {
  // Local state
  const [defaultLocale, setDefaultLocale] = useState('en-US');
  const [changed_formContactDetails, setChanged_formContactDetails] = useState(false);
  const [processing_formContactDetails, setProcessing_formContactDetails] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone);
  const [jobTitle, setJobTitle] = useState(user.jobTitle);

  const handleInputChange = useCallback((val, fn, errFn = null, sectChgFn = null) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        if (errFn) errFn(false);  // This is redundant for now because nothing is mandatory on this form
        if (sectChgFn) sectChgFn(true);
      }
    };
  }, []);
  const handleValueChange = useCallback((val, fn, errFn = null, sectChgFn = null) => {
    return value => {
      if (val !== value) {
        fn(value);
        if (errFn) errFn(false);
        if (sectChgFn) sectChgFn(true);
      }
    };
  }, []);
  const firstNameFn = handleInputChange(firstName, setFirstName, null, setChanged_formContactDetails);
  const lastNameFn = handleInputChange(lastName, setLastName, null, setChanged_formContactDetails);
  const phoneFn = handleValueChange(phone, setPhone, null, setChanged_formContactDetails);
  const jobTitleFn = handleInputChange(jobTitle, setJobTitle, null, setChanged_formContactDetails);

  // Effects
  useEffect(() => { setDefaultLocale(navigator?.language || 'en-US'); }, []);

  const contactDetails_memoRender = useMemo(() => {
    const regionNamesLocalized = new Intl.DisplayNames([defaultLocale], { type: 'region' });

    let Flag = null, flagTitle = '';
    const countryCode = getCountryCodeFromNumber(phone);
    if (countryCode != null && Flags[countryCode] != null) {
      Flag = Flags[countryCode];
      flagTitle = mkFix(regionNamesLocalized.of(countryCode));
    }

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
        </section>
      </>
  );
  }, [defaultLocale, changed_formContactDetails, processing_formContactDetails, firstName, lastName, phone, jobTitle]);

  return (
    <div className={styles.main}>
      {contactDetails_memoRender}
    </div>
  );
};


export default ProfileClientPage;
