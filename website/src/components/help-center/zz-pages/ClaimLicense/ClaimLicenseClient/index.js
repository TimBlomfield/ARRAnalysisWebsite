'use client';

import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
import Subtopics from '@/components/help-center/Subtopics';
// Image
import imgUserLicensesUser from '@/../public/help-center/User-Licenses-User.jpg';
import imgAssignedLicense from '@/../public/help-center/Assigned-License.jpg';
import imgChangeLicensePassword from '@/../public/help-center/Change-License-Password.jpg';
// Styles
import styles from '../../common.module.scss';


const ClaimLicenseClient = ({ links }) => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Claiming a License</h1>
        <p>As a <strong>User</strong>, you&apos;ve been granted access to use a license by a <strong>Customer</strong>. In most cases, you&apos;ll have just one license assigned to you, though in some situations, you might be allowed to use multiple licenses.</p>
        <hr />
        <h2>Step 1: Open the User Licenses Page</h2>
        <p>Navigate to the <strong>User Licenses</strong> page. The example below shows a license assigned to you by <strong className={styles.stronger}>kara.newman@example.com</strong>:</p>
        <Image className={styles.clickableImage}
               style={{ width: '90%' }}
               src={imgUserLicensesUser}
               alt="User Licenses"
               priority
               onClick={() => setImage({ img: imgUserLicensesUser, alt: 'User Licenses' })} />
        <hr />
        <h2>Step 2: Assign Yourself to the License</h2>
        <p>To use the <strong>ARR Analysis Excel Add-In</strong>, click <strong className={styles.more}>Assign Self</strong> on the desired license. After that your license will look like this:</p>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '96%' }}
               src={imgAssignedLicense}
               alt="Assigned License"
               onClick={() => setImage({ img: imgAssignedLicense, alt: 'Assigned License' })} />
        <p>Once assigned, you can log in to the add-in using:</p>
        <ul>
          <li>Your <strong>email</strong></li>
          <li>The <strong>initial auto-generated password</strong> for the license</li>
        </ul>
        <p>We <strong>strongly recommend</strong> changing the initial password for security. Click <strong className={styles.more}>Change Password</strong> to set a new one.</p>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '96%' }}
               src={imgChangeLicensePassword}
               alt="Change License Password"
               onClick={() => setImage({ img: imgChangeLicensePassword, alt: 'Change License Password' })} />
        <p>After changing the password, use your <strong>email</strong> and <strong>new password</strong> to sign in to the add-in.</p>
        <hr />
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
        <h2 style={{ marginTop: '50px' }}>Related Topics</h2>
        <Subtopics topics={links} />
      </article>
    </section>
  );
};


export default ClaimLicenseClient;
