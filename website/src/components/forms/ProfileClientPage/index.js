'use client';

import cn from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import zxcvbn from 'zxcvbn';
import { State }  from 'country-state-city';
import axios from 'axios';
import { toast } from 'react-toastify';
import { K_Theme } from '@/utils/common';
import { countries } from 'country-flag-icons';
import Flags from 'country-flag-icons/react/3x2';
import { getCountryCodeFromNumber } from '@/utils/phone';
import { mkFix } from '@/utils/func';
// Components
import ComboBox from '@/components/ComboBox';
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
  const router = useRouter();

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
  //// Account details
  const [changed_formAccountDetails, setChanged_formAccountDetails] = useState(false);
  const [processing_formAccountDetails, setProcessing_formAccountDetails] = useState(false);
  const [allCountries, setAllCountries] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [addressName, setAddressName] = useState(user.address);
  const [street1, setStreet1] = useState(user.street1);
  const [street2, setStreet2] = useState(user.street2);
  const [street3, setStreet3] = useState(user.street3);
  const [city, setCity] = useState(user.city);
  const [country, setCountry] = useState(-1);
  const [stateProv, setStateProv] = useState(-1);
  const [postalCode, setPostalCode] = useState(user.postalCode);

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

  const addressNameFn = handleInputChange(addressName, setAddressName, null, setChanged_formAccountDetails);
  const street1Fn = handleInputChange(street1, setStreet1, null, setChanged_formAccountDetails);
  const street2Fn = handleInputChange(street2, setStreet2, null, setChanged_formAccountDetails);
  const street3Fn = handleInputChange(street3, setStreet3, null, setChanged_formAccountDetails);
  const cityFn = handleInputChange(city, setCity, null, setChanged_formAccountDetails);
  const postalCodeFn = handleInputChange(postalCode, setPostalCode, null, setChanged_formAccountDetails);
  const countryFn = value => {
    if (value !== country) {
      setCountry(value);
      setStateProv(-1);
      setChanged_formAccountDetails(true);

      if (value < 0)
        setAllStates([]);
      else
        setAllStates(State.getStatesOfCountry(countries[value]));
    }
  };
  const stateProvFn = handleValueChange(stateProv, setStateProv, null, setChanged_formAccountDetails);

  // Effects
  useEffect(() => { setDefaultLocale(navigator?.language || 'en-US'); }, []);

  useEffect(() => {
    const regionNamesLocalized = new Intl.DisplayNames([defaultLocale], { type: 'region' });

    setAllCountries(countries.map(code => ({
      name: mkFix(regionNamesLocalized.of(code)),
      flag: code.toLowerCase(),
    })));

    const countryIdx = countries.findIndex(c => c === user.country);
    setCountry(countryIdx);

    if (countryIdx >= 0) {
      const states = State.getStatesOfCountry(user.country);
      setAllStates(states);

      setStateProv(states.findIndex(s => s.isoCode === user.state));
    }
  }, [defaultLocale]);

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
          router.refresh();
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
                 label="First name"
                 placeholder="First name"
                 autoComplete="given-name"
                 disabled={processing_formContactDetails}
                 extraClass={styles.input}
                 value={firstName}
                 onChange={firstNameFn} />
          <Input theme={K_Theme.Dark}
                 maxLength={100}
                 name="last-name"
                 type="text"
                 label="Last name"
                 placeholder="Last name"
                 autoComplete="family-name"
                 disabled={processing_formContactDetails}
                 extraClass={styles.input}
                 value={lastName}
                 onChange={lastNameFn} />
          <div className={styles.lineWithFlag}>
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
                 label="Job title"
                 placeholder="Your job title"
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
            router.refresh();
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
        <form className={styles.sectionForm}> {/* NOTE: using <form> to prevent Chrome warnings */}
          {processing_formPassword && <div className={styles.overlay}><Loading scale={2} text="Updating Password" /></div>}
          <input type="text"  // NOTE: Had to add this <input> to prevent Chrome warnings
                 name="email"
                 value={user.email}
                 disabled
                 autoComplete="username email"
                 style={{ display: 'none' }} />
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
        </form>
      </>
    );
  }, [changed_formPassword, processing_formPassword, newPassword, pwdConfirmation, errNewPassword, errConfirmPassword]);

  const accountDetails_memoRender = useMemo(() => {
    const onBtnSubmit = () => {
      setProcessing_formAccountDetails(true);

      const countryCode = (country >= 0 && country < countries.length) ? countries[country] : '';
      const stateCode = (stateProv >= 0 && stateProv < allStates.length) ? allStates[stateProv].isoCode : '';
      axios.post('/api/profile/update-account-details', { address: addressName, street1, street2, street3, city, postalCode, country: countryCode, state: stateCode })
        .then(res => {
          setProcessing_formAccountDetails(false);
          setChanged_formAccountDetails(false);
          toast.success(res.data?.message ?? 'Your account details were updated!');
          router.refresh();
        })
        .catch(err => {
          setProcessing_formAccountDetails(false);
          toast.error(err.response?.data?.message ?? 'Could not update your account details!');
        });
    };

    const Flag = country >= 0 ? Flags[countries[country]] : null;
    const flagTitle = country >= 0 ? allCountries[country].name : '';

    return (
      <>
        <div className={cn(styles.sectionTitle, styles.mt)}>Your account details</div>
        <section className={styles.sectionForm}>
          {processing_formAccountDetails && <div className={styles.overlay}><Loading scale={2} text="Updating Account Details" /></div>}
          <Input theme={K_Theme.Dark}
                 maxLength={150}
                 name="address-name"
                 type="text"
                 label="Address name"
                 placeholder="Address name"
                 autoComplete="name"
                 disabled={processing_formAccountDetails}
                 extraClass={cn(styles.input, styles.address)}
                 value={addressName}
                 onChange={addressNameFn} />
          <Input theme={K_Theme.Dark}
                 maxLength={150}
                 name="street-1"
                 type="text"
                 label="Street 1"
                 placeholder="Street 1"
                 autoComplete="address-line1"
                 disabled={processing_formAccountDetails}
                 extraClass={cn(styles.input, styles.address)}
                 value={street1}
                 onChange={street1Fn} />
          <Input theme={K_Theme.Dark}
                 maxLength={150}
                 name="street-2"
                 type="text"
                 label="Street 2"
                 placeholder="Street 2"
                 autoComplete="address-line2"
                 disabled={processing_formAccountDetails}
                 extraClass={cn(styles.input, styles.address)}
                 value={street2}
                 onChange={street2Fn} />
          <Input theme={K_Theme.Dark}
                 maxLength={150}
                 name="street-3"
                 type="text"
                 label="Street 3"
                 placeholder="Street 3"
                 autoComplete="address-line3"
                 disabled={processing_formAccountDetails}
                 extraClass={cn(styles.input, styles.address)}
                 value={street3}
                 onChange={street3Fn} />
          <Input theme={K_Theme.Dark}
                 maxLength={150}
                 name="city"
                 type="text"
                 label="City"
                 placeholder="City"
                 autoComplete="address-level2"
                 disabled={processing_formAccountDetails}
                 extraClass={cn(styles.input, styles.address)}
                 value={city}
                 onChange={cityFn} />
          <div className={styles.lineWithFlag}>
            <ComboBox theme={K_Theme.Dark}
                      name="countries"
                      type="text"
                      label="Country"
                      placeholder="Your country"
                      autoComplete="country-name"
                      disabled={processing_formAccountDetails}
                      listOptimized
                      searchable
                      pop_MatchWidth
                      roundFlags={false}
                      pageSize={8}
                      options={allCountries}
                      getOptionLabel={o => o.name}
                      getOptionData={o => o}
                      selected={country}
                      onSelect={countryFn}
                      wrapperExtraClass={styles.comboCountries}
                      style={{ height: 36, fontSize: 16 }} />
            <div className={styles.flag} title={flagTitle}>
              {Flag && <Flag className={cn(styles.rcflag, {[styles.disabled]: processing_formAccountDetails})} />}
            </div>
          </div>
          <ComboBox theme={K_Theme.Dark}
                    name="states"
                    type="text"
                    label="State / Province"
                    placeholder="State or province"
                    autoComplete="address-level1"
                    disabled={processing_formAccountDetails || (allStates.length === 0)}
                    searchable
                    pop_MatchWidth
                    pageSize={6}
                    options={allStates}
                    getOptionLabel={o => o.name}
                    selected={stateProv}
                    onSelect={stateProvFn}
                    adornExtraClass={styles.comboCountries}
                    style={{ height: 36, fontSize: 16 }} />
          <Input theme={K_Theme.Dark}
                 maxLength={50}
                 name="postal-code"
                 type="text"
                 label="Postal code"
                 placeholder="Postal code"
                 autoComplete="postal-code"
                 disabled={processing_formAccountDetails}
                 extraClass={cn(styles.input, styles.pwd)}
                 value={postalCode}
                 onChange={postalCodeFn} />
          <PushButton extraClass={styles.pbtn}
                      theme={K_Theme.Dark}
                      {...((processing_formAccountDetails || !changed_formAccountDetails) ? { disabled: true } : {})}
                      onClick={onBtnSubmit}>
            Update
          </PushButton>
        </section>
      </>
    );
  }, [changed_formAccountDetails, processing_formAccountDetails, addressName, street1, street2, street3, city,
    postalCode, allCountries, country, allStates, stateProv]);

  return (
    <div className={styles.main}>
      {contactDetails_memoRender}
      {password_memoRender}
      {accountDetails_memoRender}
    </div>
  );
};


export default ProfileClientPage;
