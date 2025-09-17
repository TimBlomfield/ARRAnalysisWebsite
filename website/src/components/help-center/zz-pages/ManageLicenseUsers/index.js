'use client';

import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
// Images
import imgLicenseWithUser from '@/../public/help-center/License-With-User.jpg';
import imgManageLicenseInvitation from '@/../public/help-center/Manage-License-Invitation.jpg';
import imgManageLicenseUsr from '@/../public/help-center/Manage-License-Allowed-User.jpg';
// Styles
import styles from '../common.module.scss';


const ManageLicenseUsersPage = () => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Managing License Users</h1>
        <p>When you invite someone to use a license — or allow the license for yourself — a user becomes associated with that license. At this point, the <strong className={styles.more}>Manage License Users</strong> button appears for that license.</p>
        <Image className={styles.clickableImage}
               style={{ width: '80%' }}
               src={imgLicenseWithUser}
               alt="License with User"
               priority
               onClick={() => setImage({ img: imgLicenseWithUser, alt: 'License with User' })} />
        <p>After you click the <strong className={styles.more}>Manage License Users</strong> button, the sections below explain what you can do next.</p>
        <hr />
        <h2>Managing Pending Invitations</h2>
        <p>If you&apos;ve sent an invitation and the recipient hasn&apos;t registered on the website yet, you will see this page:</p>
        <Image className={styles.clickableImage}
               style={{ width: '80%' }}
               src={imgManageLicenseInvitation}
               alt="Manage License Invitation"
               onClick={() => setImage({ img: imgManageLicenseInvitation, alt: 'Manage License Invitation' })} />
        <p>On this page you can:</p>
        <ul>
          <li><strong className={styles.more}>Re-send email</strong> — Sends a new invitation if the user hasn&apos;t registered within 24 hours and the original link has expired.</li>
          <li><strong className={styles.more}>Uninvite</strong> — Invalidates the registration link. The original email remains in the recipient&apos;s inbox, but the link will no longer work.</li>
        </ul>
        <hr />
        <h2>Managing Registered or Allowed Users</h2>
        <p>If the user has registered on the website — or if you allowed yourself to use the license — you will see this page:</p>
        <Image className={styles.clickableImage}
               style={{ width: '80%' }}
               src={imgManageLicenseUsr}
               alt="Manage License Registered User"
               onClick={() => setImage({ img: imgManageLicenseUsr, alt: 'Manage License Registered User' })} />
        <p>On this page you can:</p>
        <ul>
          <li><strong className={styles.more}>Disallow</strong> — Removes the user’s ability to assign the license to themselves or use it.</li>
          <li>
            <strong className={styles.more}>Delete</strong> — Removes the user completely from the system. They will no longer be able to log in, view licenses, or download the add-in.
            <ul>
              <li>If you are the <strong>Customer</strong>, this action only removes your <strong>User Role</strong>. You will still be able to log in and manage subscriptions, licenses, and downloads as usual.</li>
            </ul>
          </li>
        </ul>
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
      </article>
    </section>
  );
};


export default ManageLicenseUsersPage;
