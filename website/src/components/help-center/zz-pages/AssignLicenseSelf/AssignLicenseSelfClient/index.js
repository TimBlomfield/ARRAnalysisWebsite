'use client';

import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
import Subtopics from '@/components/help-center/Subtopics';
// Image
import imgCustomerLicenses from '@/../public/help-center/Customer-Licenses.jpg';
import imgCustomerBecomesUser from '@/../public/help-center/Customer-Becomes-User.jpg';
import imgUserLicenses from '@/../public/help-center/User-Licenses.jpg';
import imgAssignedLicense from '@/../public/help-center/Assigned-License.jpg';
import imgChangeLicensePassword from '@/../public/help-center/Change-License-Password.jpg';
// Styles
import styles from '../../common.module.scss';


const AssignLicenseSelfClient = ({ links }) => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Assigning a License to Yourself</h1>
        <p>As a <strong>Customer</strong>, you have purchased one or more subscriptions. Each subscription includes one or more licenses.</p>
        <p className={styles.note}><strong className={styles.more}>Note:</strong> Subscriptions with multiple licenses are available only for <strong>Tier 3</strong> plans.</p>
        <hr />
        <h2>Step 1: Open the Customer Licenses Page</h2>
        <p>Go to the <strong>Customer Licenses</strong> page. The image below shows a customer with three licenses:</p>
        <ul>
          <li>One license from a <strong>Tier 2</strong> subscription</li>
          <li>Two licenses from a <strong>Tier 3</strong> subscription</li>
        </ul>
        <Image className={styles.clickableImage}
               style={{ width: '90%' }}
               src={imgCustomerLicenses}
               alt="Customer Licenses"
               priority
               onClick={() => setImage({ img: imgCustomerLicenses, alt: 'Customer Licenses' })} />
        <hr />
        <h2>Step 2: Allow a License for Yourself</h2>
        <p>As a <strong>Customer</strong>, you control who is allowed to use each license. For the license you want to use yourself, click <strong className={styles.more}>Allow for Self</strong>.</p>
        <p>After doing this, you will notice the following changes:</p>
        <ul>
          <li>The <strong>User Role</strong> is now added to your account.</li>
          <li>The header displays both <strong>Customer</strong> and <strong>User</strong> roles.</li>
          <li>A new <strong>User Licenses</strong> page link appears in the navigation bar.</li>
          <li>The license now shows your email under <strong>Allowed Users</strong>.</li>
          <li>A new button, <strong className={styles.more}>Manage License Users</strong>, appears for the license.</li>
        </ul>
        <Image className={styles.clickableImage}
               style={{ width: '90%' }}
               src={imgCustomerBecomesUser}
               alt="Customer becomes User"
               onClick={() => setImage({ img: imgCustomerBecomesUser, alt: 'Customer becomes User' })} />
        <hr />
        <h2>Step 3: View Your User Licenses</h2>
        <p>Open the <strong>User Licenses</strong> page to see all licenses that you are allowed to use.</p>
        <Image className={styles.clickableImage}
               style={{ width: '90%' }}
               src={imgUserLicenses}
               alt="User Licenses"
               onClick={() => setImage({ img: imgUserLicenses, alt: 'User Licenses' })} />
        <hr />
        <h2>Step 4: Assign Yourself to the License</h2>
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


export default AssignLicenseSelfClient;
