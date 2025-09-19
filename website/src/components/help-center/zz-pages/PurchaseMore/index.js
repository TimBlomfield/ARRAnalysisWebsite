'use client';

import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
import { HelpPageIndex, helpPages } from '@/utils/help-pages';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
// Images
import imgProducts from '@/../public/help-center/Purchase-Select-Product.png';
import imgPaymentMethod from '@/../public/help-center/Purchase-Payment-Method.png';
import imgButton from '@/../public/help-center/Purchase-Button.png';
import imgThankYou from '@/../public/help-center/Purchase-ThankYou.png';
// Styles
import styles from '../common.module.scss';
import Subtopics from '@/components/help-center/Subtopics';


const PurchaseMorePage = () => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Purchasing Additional Subscriptions</h1>
        <p>Click <strong className={styles.more}>Purchase</strong> in the navigation bar on the left to open the <strong>Purchase Additional Subscriptions</strong> page. Here, you can acquire additional licenses by purchasing new subscriptions.</p>
        <hr />
        <h2>Select Your Product and Billing Period</h2>
        <p>At the top of the page, choose one of the following products:</p>
        <ul>
          <li>ARR Analysis Excel Add-in (Tier 1)</li>
          <li>ARR Analysis + Segmentation (Tier 2)</li>
          <li>Enterprise (Tier 3)</li>
        </ul>
        <p>For <strong>Tier 1</strong> and <strong>Tier 2</strong>, only one license per subscription can be purchased, and for <strong>Tier 3</strong>, a license counter appears so you can purchase multiple licenses in one subscription.</p>
        <p>Use the <strong className={styles.more}>Monthly / Yearly</strong> toggle to select your billing frequency:</p>
        <ul>
          <li><strong className={styles.more}>Monthly</strong> → Billed every month.</li>
          <li><strong className={styles.more}>Yearly</strong> → Billed annually, at a discounted rate.</li>
        </ul>
        <Image className={styles.clickableImage}
               style={{ width: 'min(750px, 100%)' }}
               src={imgProducts}
               alt="Select Product"
               priority
               onClick={() => setImage({ img: imgProducts, alt: 'Select Product' })} />
        <hr />
        <h2>Enter Payment Details</h2>
        <p>In the <strong>Payment Method</strong> section, enter your payment details securely through our Stripe-powered payment form.</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(750px, 100%)' }}
               src={imgPaymentMethod}
               alt="Payment Method"
               onClick={() => setImage({ img: imgPaymentMethod, alt: 'Payment Method' })} />
        <hr />
        <h2>Complete the Purchase</h2>
        <p>Click the <strong className={styles.more}>PURCHASE</strong> button to finalize your subscription.</p>
        <p>The button also displays the total price of the subscription, for example:</p>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '100%' }}
               src={imgButton}
               alt="Purchase Button"
               onClick={() => setImage({ img: imgButton, alt: 'Purchase Button' })} />
        <hr />
        <h2>View Your Purchase Summary</h2>
        <p>After a successful purchase, the page displays a <strong>Thank You</strong> message along with the details of your new subscription.</p>
        <p>Example for a monthly subscription for the Enterprise (Tier 3) product with 4 licenses:</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(750px, 100%)' }}
               src={imgThankYou}
               alt="Thank You"
               onClick={() => setImage({ img: imgThankYou, alt: 'Thank You' })} />
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
        <h2 style={{ marginTop: '50px' }}>Related Topics</h2>
        <Subtopics topics={[helpPages.indexer[HelpPageIndex.ManageSubscriptions]]} />
      </article>
    </section>
  );
};


export default PurchaseMorePage;
