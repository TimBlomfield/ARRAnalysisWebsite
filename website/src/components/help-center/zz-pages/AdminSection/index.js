'use client';

import cn from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
import { helpPages, HelpPageIndex } from '@/utils/help-pages';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
import Subtopics from '@/components/help-center/Subtopics';
// Images
import imgLoginForm from '@/../public/help-center/Login-Form.jpg';
// Styles
import styles from '../common.module.scss';


const AdminSectionPage = () => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Admin Section</h1>
        <p>Administrative tools and guides for managing subscriptions, licenses, users, and settings.</p>
        <hr />
        <h2>Overview</h2>
        <p>The <strong>Admin Section</strong> provides comprehensive tools for managing your organization’s subscriptions, users, and licenses. It covers the responsibilities of both the <strong>Customer Role</strong> and the <strong>User Role</strong>. Note that a single person can hold both roles—for example, when a customer assigns a purchased license to themselves, they also become a user.</p>
        <p>To access the <strong>Admin Section</strong> you need to visit our <Link className={styles.link} href="/login">login page</Link> and log in using your credentials.</p>
        <Image className={cn(styles.clickableImage)}
               style={{ width: '60%' }}
               src={imgLoginForm}
               alt="Login Form"
               priority
               onClick={() => setImage({ img: imgLoginForm, alt: 'Login Form' })} />
        <p>Choose the appropriate section below based on your role and the task you need to accomplish.</p>
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
        <h2 style={{ marginTop: '50px' }}>Browse Subtopics</h2>
        <Subtopics topics={helpPages.indexer[HelpPageIndex.AdminSection].children} />
      </article>
    </section>
  );
};


export default AdminSectionPage;
