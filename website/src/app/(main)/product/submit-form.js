'use client';

import { useState } from 'react';
import Input from '@/components/Input';
import PushButton from '@/components/PushButton';
import { K_Theme } from '@/utils/common';
// Styles
import styles from './submit-form.module.scss';

const SubmitForm = () => {
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');

  const handleInputChange = evt => {
    if (errorEmail !== '') setErrorEmail('');
    setEmail(evt.target.value);
  };
  const handleBtnClick = evt => {
    if (email === '') setErrorEmail('Email address is required');
    // TODO: subscribe to newsletter
  };

  return (
    <div className={styles.form}>
      <div className={styles.title} data-animated="text1">Subscribe to our Newsletter</div>
      <div className={styles.text} data-animated="text1">Sign up with your email address to receive news and updates.</div>
      <div className={styles.controls} data-animated="text1">
        <Input theme={K_Theme.Light} value={email} onChange={handleInputChange} errorText={errorEmail} placeholder="Email Address" />
        <PushButton theme={K_Theme.Light} onClick={handleBtnClick}>Sign Up</PushButton>
      </div>
    </div>
  );
};


export default SubmitForm;
