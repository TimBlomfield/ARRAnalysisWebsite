import { Suspense } from 'react'; // <Suspense> helps with FOUC. FOUC happens here because this page is async and SSR.
// Components
import AnimateX from '@/components/AnimateX';
import Company from './Company';
import Footer from '@/components/Footer';
import LoadingSSR from '@/components/LoadingSSR';
// Styles
import styles from './page.module.scss';


const PrivacyPolicyPage = () => {
  return (
    <Suspense fallback={<div style={{ position: 'fixed', width: '100%', height: '100vh', display: 'grid', placeItems: 'center' }}><LoadingSSR scale={2} /></div>}>
      <AnimateX>
        <div className={styles.main}>
          <div className={styles.titleArea}>
            <div className={styles.title}>Privacy Policy</div>
            <div className={styles.subtitle}>
              <div className={styles.nw}>Effective Date: <span className={styles.b}>19 August, 2025</span></div>
              <div className={styles.nw}>Last Updated: <span className={styles.b}>19 August, 2025</span></div>
            </div>
          </div>
          <div className={styles.contentArea}>
            <div className={styles.content}>
              <h3>1. Introduction</h3>
              <p>This Privacy Policy describes how ARR Analysis (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, and protects your personal information when you use our website, the Excel Add-in software, and related services (collectively, the &ldquo;Services&rdquo;). This policy applies to both customers who purchase subscriptions and users who are assigned licenses.</p>
              <h3>2. Information We Collect</h3>
              <h4>2.1 Personal Information</h4>
              <p>We collect personal information that you voluntarily provide to us, including but not limited to:</p>
              <ul>
                <li>Name and contact information (email address, phone number, mailing address)</li>
                <li>Account credentials (username, password)</li>
                <li>Payment information (processed through secure third-party payment processors)</li>
                <li>Company or organization details</li>
                <li>Communication preferences</li>
              </ul>
              <h4>2.2 Usage Data</h4>
              <p>We automatically collect certain information when you use our Services:</p>
              <ul>
                <li>Device information (operating system, browser type, device identifiers)</li>
                <li>Usage patterns and feature utilization within the Excel Add-in</li>
                <li>Log data (IP addresses, access times, pages viewed)</li>
                <li>Performance and error data from the Add-in</li>
              </ul>
              <h4>2.3 Subscription and License Data</h4>
              <ul>
                <li>Subscription tier (Basic, Intermediate, Advanced)</li>
                <li>Billing cycle (monthly or yearly)</li>
                <li>License assignment information</li>
                <li>Subscription status and history</li>
              </ul>
              <h3>3. How We Use Your Information</h3>
              <p>We use your personal information for the following purposes:</p>
              <h4>3.1 Service Provision</h4>
              <ul>
                <li>Creating and managing your account</li>
                <li>Processing payments and managing subscriptions</li>
                <li>Providing access to the Excel Add-in and downloads</li>
                <li>Managing license assignments and user access</li>
                <li>Providing customer support and technical assistance</li>
              </ul>
              <h4>3.2 Communication</h4>
              <ul>
                <li>Sending service-related notifications and updates</li>
                <li>Responding to your inquiries and requests</li>
                <li>Providing information about new features or services</li>
                <li>Sending marketing communications (with your consent)</li>
              </ul>
              <h4>3.3 Improvement and Analytics</h4>
              <ul>
                <li>Analyzing usage patterns to improve our Services</li>
                <li>Developing new features and functionality</li>
                <li>Ensuring security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
              <h3>4. Information Sharing and Disclosure</h3>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
              <h4>4.1 Service Providers</h4>
              <p>We may share information with trusted third-party service providers who assist us in:</p>
              <ul>
                <li>Payment processing</li>
                <li>Cloud hosting and data storage</li>
                <li>Customer support</li>
                <li>Analytics and marketing</li>
              </ul>
              <h4>4.2 Legal Requirements</h4>
              <p>We may disclose your information if required by law or in response to:</p>
              <ul>
                <li>Legal processes or government requests</li>
                <li>Protection of our rights, property, or safety</li>
                <li>Investigation of fraud or security issues</li>
              </ul>
              <h4>4.3 Business Transfers</h4>
              <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</p>
              <h3>5. Data Security</h3>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data storage practices</li>
              </ul>
              <h3>6. Data Retention</h3>
              <p>We retain your personal information for as long as necessary to:</p>
              <ul>
                <li>Provide the Services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce our agreements</li>
                <li>Maintain business records for legitimate purposes</li>
              </ul>
              <p>When you cancel your subscription or delete your account, we will delete or anonymize your personal information within a reasonable timeframe, except where retention is required by law.</p>
              <h3>7. Your Rights and Choices</h3>
              <p>Depending on your jurisdiction, you may have the following rights regarding your personal information:</p>
              <h4>7.1 Access and Portability</h4>
              <ul>
                <li>Request access to your personal information</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>
              <h4>7.2 Correction and Updates</h4>
              <ul>
                <li>Update or correct your personal information through your account settings</li>
                <li>Request corrections to inaccurate information</li>
              </ul>
              <h4>7.3 Deletion</h4>
              <ul>
                <li>Request deletion of your personal information</li>
                <li>Delete your account through your account settings</li>
              </ul>
              <h4>7.4 Communication Preferences</h4>
              <ul>
                <li>Opt out of marketing communications</li>
                <li>Manage notification preferences</li>
              </ul>
              <p>To exercise these rights, please contact us using the information provided in Section 11.</p>
              <h3>8. Cookies and Tracking Technologies</h3>
              <p>Our website uses cookies and similar technologies to:</p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Analyze website usage and performance</li>
                <li>Provide personalized content and advertisements</li>
                <li>Ensure website security and functionality</li>
              </ul>
              <p>You can manage cookie preferences through your browser settings.</p>
              <h3>9. International Data Transfers</h3>
              <p>If you are located outside of The United States of America, please note that your information may be transferred to and processed in The United States of America where our servers are located. We ensure appropriate safeguards are in place for such transfers.</p>
              <h3>10. Children’s Privacy</h3>
              <p>Our Services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.</p>
              <h3>11. Changes to This Privacy Policy</h3>
              <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
              <ul>
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Providing notice through our Services</li>
              </ul>
              <p>Your continued use of our Services after such changes constitutes acceptance of the updated Privacy Policy.</p>
              <h3>12. Contact Information</h3>
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
              <Company styles={styles} />
              <div style={{ minHeight: '40px' }} />
              <p><em>This Privacy Policy is designed to comply with applicable privacy laws. Please consult with legal counsel to ensure compliance with specific jurisdictional requirements.</em></p>
            </div>
          </div>
          <Footer />
        </div>
      </AnimateX>
    </Suspense>
  );
};


export default PrivacyPolicyPage;
