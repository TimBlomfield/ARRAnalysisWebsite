'use client';

import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
import Subtopics from '@/components/help-center/Subtopics';
// Image
import imgCustomerLicenses from '@/../public/help-center/Customer-Licenses1.jpg';
import imgInviteUser from '@/../public/help-center/Invite-User.jpg';
import imgInvitedByEmail from '@/../public/help-center/Invited-by-Email.jpg';
import imgAllowedUser from '@/../public/help-center/Allowed-User.jpg';
import imgAssignedUser from '@/../public/help-center/Assigned-User.jpg';
// Styles
import styles from '../../common.module.scss';


const AssignLicenseOtherClient = ({ links }) => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Assigning a License to someone else</h1>
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
               style={{ width: 'min(750px, 100%)' }}
               src={imgCustomerLicenses}
               alt="Customer Licenses"
               priority
               onClick={() => setImage({ img: imgCustomerLicenses, alt: 'Customer Licenses' })} />
        <hr />
        <h2>Step 2: Invite someone to use the License</h2>
        <p>As a <strong>Customer</strong>, you decide who can use each license. For the license you want to assign to someone else — such as a coworker or friend — click <strong className={styles.more}>Invite User.</strong></p>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '100%' }}
               src={imgInviteUser}
               alt="Invite User"
               onClick={() => setImage({ img: imgInviteUser, alt: 'Invite User' })} />
        <p>When you send the invitation, the system emails the recipient a registration link.</p>
        <ul>
          <li>The link is valid for <strong>24 hours</strong>.</li>
          <li>If they don’t register in time, you’ll need to <strong>re-send</strong> the invitation.</li>
        </ul>
        <p className={styles.note}>
          <strong className={styles.more}>Note:</strong> You can invite multiple people to a single license, but only <em>one person</em> can claim it.<br /><br />For example: If you invite 3 people, the <em>first person</em> to register and assign the license to themselves will be the one who can use the add-in.
        </p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(660px, 100%)' }}
               src={imgInvitedByEmail}
               alt="Invited by Email"
               onClick={() => setImage({ img: imgInvitedByEmail, alt: 'Invited by Email' })} />
        <hr />
        <h2>Step 3: Track the Invitation Status</h2>
        <p>Once the user registers through the email link, the license will show them as an <strong>Allowed User</strong>.</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(660px, 100%)' }}
               src={imgAllowedUser}
               alt="Allowed User"
               onClick={() => setImage({ img: imgAllowedUser, alt: 'Allowed User' })} />
        <p>When they assign the license to themselves, they will appear as the <strong>Assigned User</strong>.</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(660px, 100%)' }}
               src={imgAssignedUser}
               alt="Assigned User"
               onClick={() => setImage({ img: imgAssignedUser, alt: 'Assigned User' })} />
        <p>This gives you full visibility:</p>
        <ul>
          <li><strong>Invited by Email</strong> → Email sent</li>
          <li><strong>Allowed Users</strong> → User registered</li>
          <li><strong>Assigned Users</strong> → License claimed</li>
        </ul>
        <hr />
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
        <h2 style={{ marginTop: '50px' }}>Related Topics</h2>
        <Subtopics topics={links} />
      </article>
    </section>
  );
};


export default AssignLicenseOtherClient;
