'use client';

import Link from 'next/link';
import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
// Images
import imgPricingOptions from '@/../public/help-center/Pricing-Options.png';
import imgCheckoutSubscription from '@/../public/help-center/Checkout-Subscription.png';
import imgCheckoutCustomerInfo from '@/../public/help-center/Checkout-Customer-Info.jpg';
import imgCheckoutPaymentMethod from '@/../public/help-center/Checkout-Payment-Method.png';
import imgThankYouPage from '@/../public/help-center/Thank-You-Page.png';
// Styles
import styles from '../common.module.scss';


const PurchasingSubscriptionsPage = () => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Purchasing Subscriptions</h1>
        <p>To purchase a subscription, visit our <Link className={styles.link} href="/purchase">purchase page</Link>. On this page, you can choose your subscription pricing tier and subscription billing period (monthly or yearly).</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(620px, 100%)' }}
               src={imgPricingOptions}
               alt="Pricing Options"
               priority
               onClick={() => setImage({ img: imgPricingOptions, alt: 'Pricing Options' })} />
        <p>Clicking one of the three <strong className={styles.more}>Buy Now</strong> buttons will take you to the checkout page, where you can review and adjust your pricing tier and billing period.</p>
        <p>For the <strong>Full Stack Analyst</strong> tier, you also have the option to purchase multiple licenses.</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(620px, 100%)' }}
               src={imgCheckoutSubscription}
               alt="Subscription Tier and Billing Period"
               onClick={() => setImage({ img: imgCheckoutSubscription, alt: 'Subscription Tier and Billing Period' })} />
        <p>Once you have chosen your subscription pricing tier and billing period, enter your personal details in the form below. Required fields include your first and last name, email, and password. The Company field is optional. Your information is protected under our <Link className={styles.link} href="/privacy">Privacy Policy</Link>.</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(620px, 100%)' }}
               src={imgCheckoutCustomerInfo}
               alt="Customer Information"
               onClick={() => setImage({ img: imgCheckoutCustomerInfo, alt: 'Customer Information' })} />
        <p>Next, fill out the Payment Method form by selecting your preferred method and entering the relevant details.</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(620px, 100%)' }}
               src={imgCheckoutPaymentMethod}
               alt="Payment Method"
               onClick={() => setImage({ img: imgCheckoutPaymentMethod, alt: 'Payment Method' })} />
        <p>After completing the forms, click the <strong className={styles.more}>SUBSCRIBE</strong> button to finalize your purchase. Upon successful payment, you will see the <strong>Thank You page</strong> and receive a confirmation email.</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(500px, 100%)' }}
               src={imgThankYouPage}
               alt="Thank You Page"
               onClick={() => setImage({ img: imgThankYouPage, alt: 'Thank You Page' })} />
        <p>To access your account, click the <strong className={styles.more}>Access your Account</strong> button on the Thank You page or in the confirmation email. You can also use the <strong className={styles.more}>Login</strong> button in the top-right corner of our website. This will take you to the <Link className={styles.link} href="/login">login page</Link>, where you can sign in with the credentials you provided and access our website’s Admin Section.</p>
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
      </article>
    </section>
  );
};


export default PurchasingSubscriptionsPage;
