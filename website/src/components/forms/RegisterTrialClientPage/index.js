'use client';

import { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { countries } from 'country-flag-icons';
import Flags from 'country-flag-icons/react/3x2';
import { K_Theme } from '@/utils/common';
import { getCountryCodeFromNumber } from '@/utils/phone';
import { mkFix } from '@/utils/func';
// Components
import AnimateX from '@/components/AnimateX';
import ComboBox from '@/components/ComboBox';
import Footer from '@/components/Footer';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PhoneInput from '@/components/PhoneInput';
import PushButton from '@/components/PushButton';
// Images
import InterphoneSvg from '@/../public/international-call.svg';
import TriangleSvg from '@/../public/exclamation-triangle.svg';
// Styles
import styles from './styles.module.scss';


const RegisterTrialClientPage = ({ token, detectedCountry }) => {
  const router = useRouter();

  // Local state
  const [defaultLocale, setDefaultLocale] = useState('en-US');
  const [loading, setLoading] = useState(false);
  const [allCountries, setAllCountries] = useState([]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState(-1);
  const [jobTitle, setJobTitle] = useState('');

  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [errorCompany, setErrorCompany] = useState(false);

  const handleInputChange = useCallback((val, fn, errFn = null) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        if (errFn) errFn(false);
      }
    };
  }, []);
  const handleValueChange = useCallback((val, fn, errFn = null) => {
    return value => {
      if (val !== value) {
        fn(value);
        if (errFn) errFn('');
      }
    };
  }, []);
  const firstNameFn = handleInputChange(firstName, setFirstName, setErrorFirstName);
  const lastNameFn = handleInputChange(lastName, setLastName, setErrorLastName);
  const phoneFn = handleValueChange(phone, setPhone, setErrorPhone);
  const companyFn = handleInputChange(company, setCompany, setErrorCompany);
  const jobTitleFn = handleInputChange(jobTitle, setJobTitle, null);

  // Effects
  useEffect(() => { setDefaultLocale(navigator?.language || 'en-US'); }, []);

  useEffect(() => {
    const regionNamesLocalized = new Intl.DisplayNames([defaultLocale], { type: 'region' });

    setAllCountries(countries.map(code => ({
      name: mkFix(regionNamesLocalized.of(code)),
      flag: code.toLowerCase(),
    })));

    if (detectedCountry != null) {
      const countryIdx = countries.findIndex(c => c === detectedCountry);
      setCountry(countryIdx);
    } else
      setCountry(-1);
  }, [defaultLocale]);

  const onRequestTrialClick = () => {
    let bError = false;

    const theFirstName = firstName.trim();
    if (theFirstName.length === 0) {
      bError = true;
      setErrorFirstName(true);
    }

    const theLastName = lastName.trim();
    if (theLastName.length === 0) {
      bError = true;
      setErrorLastName(true);
    }

    const thePhone = phone.trim();
    if (isValidPhoneNumber(thePhone) === false) {
      bError = true;
      setErrorPhone(true);
    }

    const theCompany = company.trim();
    if (theCompany.length === 0) {
      bError = true;
      setErrorCompany(true);
    }

    const theCountry = country >= 0 ? allCountries[country].flag.toUpperCase() : 'US';
    const theJobTitle = jobTitle.trim();

    if (bError) {
      window.scrollTo({ top: 200, left: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    axios.post('/api/trial-requestor-info', { token, firstName: theFirstName, lastName: theLastName, phone: thePhone, company: theCompany, country: theCountry, jobTitle: theJobTitle })
      .then(res => {
        router.push(`/trial/download?token=${token}`);  // Redirect to download page
      })
      .catch(err => {
        router.push('/trial?session=expired');  // Redirect to session expired page
      });
  };

  const regionNamesLocalized = new Intl.DisplayNames([defaultLocale], { type: 'region' });

  let Flag = null, flagTitle = '';
  const countryCode = getCountryCodeFromNumber(phone);
  if (countryCode != null && Flags[countryCode] != null) {
    Flag = Flags[countryCode];
    flagTitle = mkFix(regionNamesLocalized.of(countryCode));
  }
  const FlagC = country >= 0 ? Flags[countries[country]] : null;
  const flagTitleC = country >= 0 ? allCountries[country].name : '';

  const bShowErrorNote = errorFirstName || errorLastName || errorPhone || errorCompany;

  return (
    <AnimateX>
      <div className={styles.main}>
        <section className={styles.titleArea}>
          <div className={styles.title}>Free Trial</div>
        </section>
        <section className={styles.s1}>
          <div className={styles.txtRegister}>Please register with us</div>
          <p><span className={styles.txtDesc}>In order to process your trial request we kindly ask you to provide some additional information. Just as your email address, we will not forward this information to any third party.</span></p>
          {bShowErrorNote &&
            <div className={styles.errorNote}>
              <TriangleSvg className={styles.imgExclamation} />
              <div className={styles.txtError}><strong>Something went wrong!</strong> Solve the issues below and try again.</div>
            </div>
          }
          <div className={styles.txtAboutYou}>About you</div>
          <div className={styles.controlsArea}>
            {loading &&
              <div className={styles.overlay}>
                <Loading theme={K_Theme.Dark} scale={2} />
              </div>
            }
            <Input theme={K_Theme.Dark}
                   maxLength={100}
                   name="first-name"
                   type="text"
                   label="First name"
                   placeholder="Your first name"
                   autoComplete="given-name"
                   disabled={loading}
                   extraClass={styles.input}
                   wrapperExtraClass={styles.inputWrap}
                   errorTextExtraClass={styles.errTxt}
                   errorPlaceholder
                   errorBorder={errorFirstName}
                   {...(errorFirstName ? { errorText: 'Required' } : {})}
                   value={firstName}
                   onChange={firstNameFn} />
            <Input theme={K_Theme.Dark}
                   maxLength={100}
                   name="last-name"
                   type="text"
                   label="Last name"
                   placeholder="Your last name"
                   autoComplete="family-name"
                   disabled={loading}
                   extraClass={styles.input}
                   wrapperExtraClass={styles.inputWrap}
                   errorTextExtraClass={styles.errTxt}
                   errorPlaceholder
                   errorBorder={errorLastName}
                   {...(errorLastName ? { errorText: 'Required' } : {})}
                   value={lastName}
                   onChange={lastNameFn} />
            <div className={styles.lineWithFlag}>
              <PhoneInput theme={K_Theme.Dark}
                          name="telephone"
                          type="text"
                          label="Phone"
                          placeholder="e.g. +1 234 567 8988"
                          disabled={loading}
                          extraClass={styles.phoneInput}
                          wrapperExtraClass={styles.wrapperPhone}
                          errorTextExtraClass={styles.errTxt}
                          errorPlaceholder
                          errorBorder={errorPhone}
                          {...(errorPhone ? { errorText: 'Invalid phone number' } : {})}
                          value={phone}
                          changeFn={phoneFn} />
              <div className={styles.sameLine}>
                <div className={styles.flag} title={flagTitle}>
                  {Flag != null
                    ? <Flag className={cn(styles.rcflag, {[styles.disabled]: loading})} />
                    : <InterphoneSvg className={cn(styles.interphone, {[styles.disabled]: loading})} />
                  }
                </div>
                <div className={styles.txtCountry}>{flagTitle}</div>
              </div>
            </div>
            <Input theme={K_Theme.Dark}
                   maxLength={150}
                   name="company"
                   type="text"
                   label="Company"
                   placeholder="Your company"
                   autoComplete="organization"
                   disabled={loading}
                   extraClass={styles.input}
                   wrapperExtraClass={styles.inputWrap}
                   errorTextExtraClass={styles.errTxt}
                   errorPlaceholder
                   errorBorder={errorCompany}
                   {...(errorCompany ? { errorText: 'Required' } : {})}
                   value={company}
                   onChange={companyFn} />
            <div className={cn(styles.lineWithFlag, styles.country)}>
              <ComboBox theme={K_Theme.Dark}
                        name="countries"
                        type="text"
                        label="Country"
                        placeholder="Your country"
                        autoComplete="country-name"
                        disabled={loading}
                        disableClearable
                        listOptimized
                        searchable
                        pop_MatchWidth
                        roundFlags={false}
                        pageSize={8}
                        options={allCountries}
                        getOptionLabel={o => o.name}
                        getOptionData={o => o}
                        selected={country}
                        onSelect={setCountry}
                        wrapperExtraClass={styles.comboCountries}
                        style={{ height: 42, fontSize: 16 }} />
              <div className={styles.flag} title={flagTitleC}>
                {FlagC && <FlagC className={cn(styles.rcflag, {[styles.disabled]: loading})} />}
              </div>
            </div>
            <Input theme={K_Theme.Dark}
                   maxLength={100}
                   name="job-title"
                   type="text"
                   label="Job title"
                   placeholder="Your job title"
                   autoComplete="organization-title"
                   disabled={loading}
                   extraClass={styles.input}
                   wrapperExtraClass={styles.inputWrap}
                   errorTextExtraClass={styles.errTxt}
                   errorPlaceholder
                   value={jobTitle}
                   onChange={jobTitleFn} />
            <PushButton theme={K_Theme.Dark}
                        extraClass={styles.btn}
                        disabled={loading}
                        onClick={onRequestTrialClick}>
              Request Trial &nbsp;&nbsp;&nbsp;&nbsp;&gt;
            </PushButton>
          </div>
          <div className={styles.txtSmall}>
            Please refer to our <Link href="/privacy" className={styles.link}>privacy policy</Link> on how we protect your personal data.
          </div>
        </section>
      </div>
      <Footer />
    </AnimateX>
  );
};


export default RegisterTrialClientPage;
