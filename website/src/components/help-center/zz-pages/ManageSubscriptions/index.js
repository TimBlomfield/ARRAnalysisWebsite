'use client';

import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
import { HelpPageIndex, helpPages } from '@/utils/help-pages';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
import Subtopics from '@/components/help-center/Subtopics';
// Images
import imgActiveAllToggle from '@/../public/help-center/Active-All-ToggleButton.png';
import imgSubscriptionActive from '@/../public/help-center/Subscription-Active.jpg';
import imgContentToggle from '@/../public/help-center/SubscriptionContent-ToggleButton.png';
import imgSubscriptionId from '@/../public/help-center/Subscription-ID.png';
import imgProductName from '@/../public/help-center/Subscription-Product-Name.png';
import imgLicenseCount from '@/../public/help-center/Subscription-License-Count.png';
import imgStatusActive from '@/../public/help-center/Subscription-Status-Active.png';
import imgSubscriptionPendingCancel from '@/../public/help-center/Subscription-Pending-Cancel.jpg';
import imgSubscriptionScreen from '@/../public/help-center/Subscriptions-Screen.jpg';
import imgSubscriptionCancelled from '@/../public/help-center/Subscription-Cancelled.jpg';
import imgSubscriptionExpired from '@/../public/help-center/Subscription-Expired.jpg';
// Styles
import styles from '../common.module.scss';


const ManageSubscriptionsPage = () => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Managing Subscriptions</h1>
        <p>On this page, you can manage your subscriptions. By default, only <strong>Active</strong> subscriptions are displayed. You can toggle between <strong>Active</strong> and <strong>All</strong> subscriptions using the toggle button in the top-left corner of the page.</p>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '100%' }}
               src={imgActiveAllToggle}
               alt="Active/All Toggle Button"
               priority
               onClick={() => setImage({ img: imgActiveAllToggle, alt: 'Active/All Toggle Button' })} />
        <hr />
        <h2>Subscription Layout and Details</h2>
        <p>Each subscription has a header and collapsible content. The following image shows what an <strong>Active Subscription</strong> may look like:</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(660px, 100%)' }}
               src={imgSubscriptionActive}
               alt="Active Subscription"
               priority
               onClick={() => setImage({ img: imgSubscriptionActive, alt: 'Active Subscription' })} />
        <p>The subscription <strong>Header</strong> includes the following elements:</p>
        <ul className={styles.spaceItems}>
          <li><div className={styles.fxCenter}><strong>Expand/Collapse Button</strong><Image src={imgContentToggle} alt="Content Toggle" className={styles.img1} /></div> → A triangle icon to show or hide subscription content.</li>
          <li><div className={styles.fxCenter}><strong>Subscription ID</strong><Image src={imgSubscriptionId} alt="Subscription ID" className={styles.img1} /></div> → Helps you identify the licenses associated with this subscription.</li>
          <li>
            <div className={styles.fxCenter}><strong>Product Name</strong><Image src={imgProductName} alt="Product Name" className={styles.img1} /></div> → The product associated with the subscription.
            <ul className={styles.spaceItems}>
              <li><div className={styles.fxCenter}>For subscriptions with more than one license, the license count appears next: <Image src={imgLicenseCount} alt="License Count" className={styles.img1} /></div></li>
            </ul>
          </li>
          <li><strong>Billing Period</strong> → Monthly or yearly.</li>
          <li><div className={styles.fxCenter}><strong>Status</strong><Image src={imgStatusActive} alt="Status" className={styles.img1} /></div> → Shows the subscription’s current state (e.g., Active, Pending Cancellation, Cancelled).</li>
        </ul>
        <hr />
        <h2>Cancelling and Revoking Cancellations</h2>
        <p>To cancel an active subscription, click <strong className={styles.more}>Cancel Subscription</strong>. The subscription will remain active until the end of its current billing period.</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(660px, 100%)' }}
               src={imgSubscriptionPendingCancel}
               alt="Pending Cancellation"
               onClick={() => setImage({ img: imgSubscriptionPendingCancel, alt: 'Pending Cancellation' })} />
        <p>While the subscription is in the <strong>Pending Cancellation</strong> state, you can revoke the cancellation any time before the current period ends. If you do, the subscription will return to <strong>Active</strong> status and billing will continue as normal.</p>
        <p>Once the billing period ends, the <strong>Pending Cancellation</strong> subscription moves to the <strong>Cancelled</strong> state, and cancellation can no longer be revoked.</p>
        <hr />
        <h2>Examples and Other States</h2>
        <ul>
          <li>
            <strong>Multiple Subscriptions:</strong>
            <p>Here is an example Admin Section screen of a customer with two subscriptions — one monthly (with 2 licenses) and one yearly (with 1 license) — both in a collapsed view:</p>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(660px, 100%)' }}
                   src={imgSubscriptionScreen}
                   alt="Subscriptions Screen"
                   onClick={() => setImage({ img: imgSubscriptionScreen, alt: 'Subscriptions Screen' })} />
          </li>
          <li>
            <strong>Cancelled:</strong>
            <p>When the current billing period ends for a pending cancellation, the subscription moves to the <strong>Cancelled</strong> state:</p>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(660px, 100%)' }}
                   src={imgSubscriptionCancelled}
                   alt="Cancelled Subscription"
                   onClick={() => setImage({ img: imgSubscriptionCancelled, alt: 'Cancelled Subscription' })} />
          </li>
          <li>
            <strong>Expired:</strong>
            <p>Failed payments result in an <strong>Expired</strong> subscription:</p>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(660px, 100%)' }}
                   src={imgSubscriptionExpired}
                   alt="Expired Subscription"
                   onClick={() => setImage({ img: imgSubscriptionExpired, alt: 'Expired Subscription' })} />
          </li>
        </ul>
        <hr />
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
        <h2 style={{ marginTop: '50px' }}>Related Topics</h2>
        <Subtopics topics={[helpPages.indexer[HelpPageIndex.PurchaseMore]]} />
      </article>
    </section>
  );
};


export default ManageSubscriptionsPage;
