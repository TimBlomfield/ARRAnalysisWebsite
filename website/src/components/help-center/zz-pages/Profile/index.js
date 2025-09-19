'use client';

import Image from 'next/image';
import Link from 'next/link';
import useZoomableImage from '@/utils/client/useZoomableImage';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
// Images
import imgContactDetails from '@/../public/help-center/Profile-Contact-Details.png';
import imgPassword from '@/../public/help-center/Profile-Password.png';
import imgAccountDetails from '@/../public/help-center/Profile-Account-Details.png';
// Styles
import styles from '../common.module.scss';


const ProfilePage = () => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Profile Section</h1>
        <p>The Profile page in the Admin Section lets you manage your personal information, account details, and password securely. All personal data you provide is protected under our <Link className={styles.link} href="/privacy">Privacy Policy</Link>.</p>
        <p>After logging in, open the <strong>Profile</strong> page to view and update the following sections:</p>
        <hr />
        <h2>Section 1: Your Contact Details</h2>
        <p>This section stores your basic contact information:</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(570px, 100%)' }}
               src={imgContactDetails}
               alt="Contact Details"
               priority
               onClick={() => setImage({ img: imgContactDetails, alt: 'Contact Details' })} />
        <p>After updating any of these details, click <strong className={styles.more}>Update</strong> to save your changes.</p>
        <hr />
        <h2>Section 2: Your Password</h2>
        <p>Here you can update your account password:</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(410px, 100%)' }}
               src={imgPassword}
               alt="Password"
               onClick={() => setImage({ img: imgPassword, alt: 'Password' })} />
        <p>A <strong>password strength meter</strong> will guide you as you type. Only passwords with a strength rating of <strong className={styles.more}>Good</strong> or <strong className={styles.more}>Strong</strong> will be accepted.</p>
        <p>After setting a new password, click <strong className={styles.more}>Update</strong> to save it.</p>
        <hr />
        <h2>Section 3: Your Account Details</h2>
        <p>This section stores your account’s address and location information:</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(600px, 100%)' }}
               src={imgAccountDetails}
               alt="Account Details"
               onClick={() => setImage({ img: imgAccountDetails, alt: 'Account Details' })} />
        <p>We request this information to:</p>
        <ul>
          <li>Maintain accurate contact information for support and customer communication.</li>
          <li>Perform internal analytics and statistics about our user base (e.g., regional distribution).</li>
          <li>Personalize user interactions or localize communications, such as sending region-specific information or offers.</li>
        </ul>
        <p>Providing this information is optional, but it helps us serve you better.</p>
        <p>After making any changes, click <strong className={styles.more}>Update</strong> to save your updated account information.</p>
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
      </article>
    </section>
  );
};


export default ProfilePage;
