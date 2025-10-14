'use client';

import { useCallback, useId, useRef, useState } from 'react';
import cn from 'classnames';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import { K_Theme } from '@/utils/common';
import { validateUnicodeEmail } from '@/utils/validators';
// Components
import AnimateX from '@/components/AnimateX';
import Input from '@/components/Input';
import LabelReq from '@/components/LabelReq';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
import Footer from '@/components/Footer';
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
const PageState = {
  Normal: 0,
  Sending: 1,
  Sent: 2,
};


const ContactPage = () => {
  const idFirstName = useId();
  const idLastName = useId();
  const idEmail = useId();
  const idMessage = useId();
  const refRecaptcha = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [pageState, setPageState] = useState(PageState.Normal);

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

  const handleRecaptchaChange = token => setRecaptchaToken(token);

  const handleBtnClick = () => {
    let bError = false;
    if (firstName.trim() === '') { setErrorFirstName('First Name is required'); setFirstName(''); bError = true; }
    if (lastName.trim() === '') { setErrorLastName('Last Name is required'); setLastName(''); bError = true; }
    if (!validateUnicodeEmail(email.trim())) { setErrorEmail('A valid Email is required'); setEmail(''); bError = true; }
    if (message.trim() === '') { setErrorMessage('Message is required'); setMessage(''); bError = true; }

    if (recaptchaToken == null)
      bError = true;

    if (!bError) {
      setPageState(PageState.Sending);

      axios.post('/api/send-contact-us-email', { firstName, lastName, email, message, recaptchaToken })
        .then(res => {
          setTimeout(() => {
            setPageState(PageState.Sent);
            toast.success(res.data?.message ?? 'Your message has been sent');
          }, 2000);
        })
        .catch(err => {
          setPageState(PageState.Normal);
          toast.error(err.response?.data?.message ?? 'Your message could not be sent');
        });
    }
  };

  return (
    <AnimateX>
      <div className={styles.main}>
        <div className={styles.contact}>
          <div className={styles.inner}>
            <div className={styles.part} data-animated="text1">
              <div className={styles.title}>Contact Us</div>
              <div className={styles.desc}>Reach out to learn more</div>
            </div>
            {pageState !== PageState.Sent &&
              <div className={cn(styles.part, styles.formGap)} data-animated="text1">
                {pageState === PageState.Sending &&
                  <div className={styles.overlay}>
                    <Loading theme={K_Theme.Light} scale={2} />
                  </div>
                }
                <div className={styles.fh}>
                  <Input label={<LabelReq text="First Name" />}
                         theme={K_Theme.Light}
                         disabled={pageState !== PageState.Normal}
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
                         disabled={pageState !== PageState.Normal}
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
                       disabled={pageState !== PageState.Normal}
                       id={idEmail}
                       name="Email"
                       errorPlaceholder
                       value={email}
                       onChange={emailFn}
                       errorText={errorEmail}
                       style={customInputStyle} />
                <Input label={<LabelReq text="Message" />}
                       theme={K_Theme.Light}
                       disabled={pageState !== PageState.Normal}
                       id={idMessage}
                       rows={4}
                       multiline
                       errorPlaceholder
                       value={message}
                       onChange={messageFn}
                       errorText={errorMessage}
                       style={customTextAreaStyle} />
                {pageState === PageState.Normal &&
                  <div className={styles.reCaptchaHolder}>
                    <ReCAPTCHA ref={refRecaptcha}
                               theme="dark"
                               sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                               onChange={handleRecaptchaChange} />
                  </div>
                }
                <PushButton extraClass={styles.btnSubmit}
                            disabled={recaptchaToken == null || pageState !== PageState.Normal}
                            theme={K_Theme.Light}
                            onClick={handleBtnClick}>
                  Submit
                </PushButton>
              </div>
            }
            {pageState === PageState.Sent &&
              <div className={cn(styles.part, styles.thankYou)}>
                Thank you for contacting us!<br />We’ll review your message and get back to you soon.
              </div>
            }
          </div>
        </div>
        <div className={styles.s1} />
        <Footer />
      </div>
    </AnimateX>
  );
};


// Force dynamic rendering for this page (resolves FOUC)
export const dynamic = 'force-dynamic';
export default ContactPage;
