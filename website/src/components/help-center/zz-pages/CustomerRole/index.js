'use client';

import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
import { HelpPageIndex, helpPages } from '@/utils/help-pages';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
import Subtopics from '@/components/help-center/Subtopics';
// Images
import imgCustomerLoggedIn from '@/../public/help-center/Customer-Logged-In.jpg';
import imgHeaderCustomerUserRoles from '@/../public/help-center/Header-Roles.jpg';
import imgNavBarUserLicenses from '@/../public/help-center/NavBar-User-Licenses.jpg';
// Styles
import styles from '../common.module.scss';


const CustomerRolePage = () => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Customer Role</h1>
        <p>Responsibilities and options available to you as a <strong>Customer</strong> in the Admin Section.</p>
        <hr />
        <h2>Overview</h2>
        <p>When you purchase a subscription, you automatically become a <strong>Customer</strong>. As a customer, you can log in to the Admin Section to manage your subscriptions, licenses, and users.</p>
        <p>After logging in, you will see the following view in the Admin Section:</p>
        <Image className={styles.clickableImage}
               style={{ width: '90%' }}
               src={imgCustomerLoggedIn}
               alt="Customer Logged In"
               priority
               onClick={() => setImage({ img: imgCustomerLoggedIn, alt: 'Customer Logged In' })} />
        <p>In the header, you will find your name, email, and role. On the left side, the navigation menu provides links to other areas within the Admin Section.</p>
        <p>If you assign a license to yourself in addition to purchasing a subscription, you will also take on the <strong>User Role</strong>. In this case, the header will display both roles:</p>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '96%' }}
               src={imgHeaderCustomerUserRoles}
               alt="Customer User Roles"
               onClick={() => setImage({ img: imgHeaderCustomerUserRoles, alt: 'Customer User Roles' })} />
        <p>Additionally, a new link will appear in the navigation menu, giving you access to manage licenses assigned specifically to you:</p>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '96%' }}
               src={imgNavBarUserLicenses}
               alt="User Licenses"
               onClick={() => setImage({ img: imgNavBarUserLicenses, alt: 'User Licenses' })} />
        <p>Choose a subtopic below to learn more about what you can do as a customer.</p>
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
        <h2 style={{ marginTop: '50px' }}>Browse Subtopics</h2>
        <Subtopics topics={helpPages.indexer[HelpPageIndex.CustomerRole].children} />
      </article>
    </section>
  );
};


export default CustomerRolePage;
