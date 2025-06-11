'use client';

import { useCallback, useId, useState } from 'react';
import cn from 'classnames';
import AnimateX from '@/components/AnimateX';
import Input from '@/components/Input';
import LabelReq from '@/components/LabelReq';
import PushButton from '@/components/PushButton';
import { K_Theme } from '@/utils/common';
import { validateUnicodeEmail } from '@/utils/validators';
// Images
import LogoDigicertSvg from '@/../public/logo-digicert.svg';
// Styles
import styles from './page.module.scss';


const customInputStyle = {
  height: '48px',
  fontSize: '16px',
  minWidth: '100px',
};
const customTextAreaStyle = {
  height: 'auto',
  fontSize: '16px',
  padding: '8px 24px',
  resize: 'vertical',
  maxWidth: '100%',
  maxHeight: '360px',
  minHeight: '100px',
};


const ContactPage = () => {
  const idFirstName = useId();
  const idLastName = useId();
  const idEmail = useId();
  const idMessage = useId();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [errorFirstName, setErrorFirstName] = useState('');
  const [errorLastName, setErrorLastName] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = useCallback((val, fn, errFn) => {
    return evt => {
      if (val !== evt.target.value) {
        fn(evt.target.value);
        errFn('');
      }
    };
  }, []);
  const firstNameFn = handleInputChange(firstName, setFirstName, setErrorFirstName);
  const lastNameFn = handleInputChange(lastName, setLastName, setErrorLastName);
  const emailFn = handleInputChange(email, setEmail, setErrorEmail);
  const messageFn = handleInputChange(message, setMessage, setErrorMessage);

  const handleBtnClick = () => {
    let bError = false;
    if (firstName.trim() === '') { setErrorFirstName('First Name is required'); setFirstName(''); bError = true; }
    if (lastName.trim() === '') { setErrorLastName('Last Name is required'); setLastName(''); bError = true; }
    if (!validateUnicodeEmail(email.trim())) { setErrorEmail('A valid Email is required'); setEmail(''); bError = true; }
    if (message.trim() === '') { setErrorMessage('Message is required'); setMessage(''); bError = true; }
  };

  return (
    <AnimateX>
      <div className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.part} data-animated="text1">
            <div className={styles.title}>Contact Us</div>
            <div className={styles.desc}>Reach out to learn more</div>
            <a className={styles.mail} href="mailto:info@arr-analysis.com">info@arr-analysis.com</a>
          </div>
          <div className={cn(styles.part, styles.formGap)} data-animated="text1">
            <div className={styles.fh}>
              <Input label={<LabelReq text="First Name" />}
                     theme={K_Theme.Light}
                     id={idFirstName}
                     size={10}
                     name="First Name"
                     errorPlaceholder
                     value={firstName}
                     onChange={firstNameFn}
                     errorText={errorFirstName}
                     style={customInputStyle} />
              <Input label={<LabelReq text="Last Name" />}
                     theme={K_Theme.Light}
                     id={idLastName}
                     size={10}
                     name="Last Name"
                     errorPlaceholder
                     value={lastName}
                     onChange={lastNameFn}
                     errorText={errorLastName}
                     style={customInputStyle} />
            </div>
            <Input label={<LabelReq text="Email" />}
                   theme={K_Theme.Light}
                   id={idEmail}
                   name="Email"
                   errorPlaceholder
                   value={email}
                   onChange={emailFn}
                   errorText={errorEmail}
                   style={customInputStyle} />
            <Input label={<LabelReq text="Message" />}
                   theme={K_Theme.Light}
                   id={idMessage}
                   rows={4}
                   multiline
                   errorPlaceholder
                   value={message}
                   onChange={messageFn}
                   errorText={errorMessage}
                   style={customTextAreaStyle} />
            <PushButton extraClass={styles.btnSubmit} theme={K_Theme.Light} onClick={handleBtnClick}>Submit</PushButton>
          </div>
        </div>
      </div>
      <LogoDigicertSvg className={styles.logoDigicert} />
    </AnimateX>
  );
};


export default ContactPage;
