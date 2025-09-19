'use client';

import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
import { HelpPageIndex, helpPages } from '@/utils/help-pages';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
import Subtopics from '@/components/help-center/Subtopics';
// Images
import imgRegisterUser from '@/../public/help-center/User-Registration-Form.jpg';
import imgUserLoggedIn from '@/../public/help-center/User-Logged-In.jpg';
// Styles
import styles from '../common.module.scss';


const UserRolePage = () => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>User Role</h1>
        <p>Understand your responsibilities and options as a <strong>User</strong> in the Admin Section.</p>
        <hr />
        <h2>Overview</h2>
        <p>When a <strong>Customer</strong> (such as your organization or a friend) invites you to use a license, you will receive an email invitation.</p>
        <ul>
          <li>
            <strong>New Users: </strong>
            If you are not yet registered, the invitation email will include a registration link that is valid for 24 hours. Clicking the link will take you to a registration page that looks like this:
            <Image className={styles.clickableImage}
                   style={{ width: 'min(600px, 100%)' }}
                   src={imgRegisterUser}
                   alt="User Registration Form"
                   priority
                   onClick={() => setImage({ img: imgRegisterUser, alt: 'User Registration Form' })} />
          </li>
          <li><strong>Existing Users: </strong>If you already have an account, the invitation email will prompt you to log in and claim the new license assigned to you by the customer.</li>
        </ul>
        <p>After logging in, you will see the Admin Section with the following layout:</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(660px, 100%)' }}
               src={imgUserLoggedIn}
               alt="Admin Section"
               onClick={() => setImage({ img: imgUserLoggedIn, alt: 'Admin Section' })} />
        <p>In the header, you will find your name, email, and role. The navigation menu on the left provides access to other areas within the Admin Section.</p>
        <p>Choose a subtopic below to learn more about what you can do as a user.</p>
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
        <h2 style={{ marginTop: '50px' }}>Browse Subtopics</h2>
        <Subtopics topics={helpPages.indexer[HelpPageIndex.UserRole].children} />
      </article>
    </section>
  );
};


export default UserRolePage;
