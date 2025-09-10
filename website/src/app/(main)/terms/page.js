// Components
import AnimateX from '@/components/AnimateX';
import Company from '../privacy/Company';
import Footer from '@/components/Footer';
// Styles
import styles from '../privacy/page.module.scss';


const TermsOfUsePage = () => {
  return (
    <AnimateX>
      <div className={styles.main}>
        <div className={styles.titleArea}>
          <div className={styles.title}>Terms of Use</div>
          <div className={styles.subtitle}>
            <div className={styles.nw}>Effective Date: <span className={styles.b}>19 August, 2025</span></div>
            <div className={styles.nw}>Last Updated: <span className={styles.b}>19 August, 2025</span></div>
          </div>
        </div>
        <div className={styles.contentArea}>
          <div className={styles.content}>
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing or using ARR Analysis&apos; website, Excel Add-in software, or any related services (collectively, the &ldquo;Services&rdquo;), you agree to be bound by these Terms of Use (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use our Services.</p>
            <h3>2. Definitions</h3>
            <ol>
              <li><strong>&ldquo;Customer&rdquo;</strong> means an individual or entity that purchases a subscription to our Services</li>
              <li><strong>&ldquo;User&rdquo;</strong> means an individual assigned a license by a Customer to use the Excel Add-in</li>
              <li><strong>&ldquo;Add-in&rdquo;</strong> refers to our Excel Add-in software available in Basic, Intermediate, and Advanced tiers</li>
              <li><strong>&ldquo;Subscription&rdquo;</strong> means a paid plan (monthly or yearly) that provides access to the Add-in</li>
              <li><strong>&ldquo;Account&rdquo;</strong> means your registered account on our website</li>
            </ol>
            <h3>3. Description of Services</h3>
            <h4>3.1 Subscription Tiers</h4>
            <p>We offer three subscription tiers for our Excel Add-in:</p>
            <ul>
              <li>
                <strong>Basic (Tier 1):</strong>
                <ul>
                  <li><span className={styles.lesser}>Core Excel Add-in:</span> Ability to install and use the ARR Analysis Excel add-in.</li>
                  <li><span className={styles.lesser}>Recurring Revenue Analysis:</span> Automates standard ARR (Annual Recurring Revenue) calculations inside Excel.</li>
                  <li><span className={styles.lesser}>Retention & Churn Tracking:</span> Basic reporting on customer retention and churn across monthly, quarterly, annual, and trailing twelve-month time periods.</li>
                  <li><span className={styles.lesser}>Standard Visualization:</span> Generates charts and reports that can be used in presentations.</li>
                  <li><span className={styles.lesser}>Subscription Management Dashboard:</span> Access to account management, billing, and license assignment tools.</li>
                </ul>
              </li>
              <li>
                <strong>Intermediate (Tier 2):</strong>
                <p>Includes all Basic features, plus:</p>
                <ul className={styles.mTx8}>
                  <li><span className={styles.lesser}>Cohort Analysis:</span> Track customer retention, churn, and expansion trends by cohort (e.g., by signup month or year).</li>
                  <li><span className={styles.lesser}>Customer Size Analysis:</span>
                    <ul>
                      <li>Cuts of cohorts by size of customer</li>
                      <li>Provides customer concentration analysis</li>
                      <li>Analyzes churn, including top churn, and churn cohorts</li>
                    </ul>
                  </li>
                  <li><span className={styles.lesser}>Average Contract Value (ACV) Analysis:</span> Monitor how customer spend per contract evolves across time periods.</li>
                  <li><span className={styles.lesser}>Flexible Time Periods:</span> Analyze data monthly, quarterly, annually, or across multiple custom periods.</li>
                </ul>
              </li>
              <li>
                <strong>Advanced (Tier 3):</strong>
                <p>Includes all Intermediate features, plus:</p>
                <ul className={styles.mTx8}>
                  <li>Analyze top churns in greater detail.</li>
                  <li>Analyze unit economics (LTV, CAC, GEI, Payback period).</li>
                  <li><span className={styles.lesser}>Analyze revenue by segmentation:</span> Analyze retention, growth, and cohorts by geographic segment, customer size, customer vertical, and product line</li>
                  <li><span className={styles.lesser}>Customizable Outputs:</span> Automatically output to PPT in your company template.</li>
                  <li><span className={styles.lesser}>Enterprise Support & Maintenance:</span> Priority support channels, faster response times, and access to additional resources.</li>
                </ul>
              </li>
            </ul>
            <h4>3.2 Subscription Plans</h4>
            <p>Each tier is available as:</p>
            <ul>
              <li>Monthly subscription (billed monthly)</li>
              <li>Yearly subscription (billed annually)</li>
            </ul>
            <h4>3.3 License Assignment</h4>
            <ul>
              <li>Customers can assign licenses from their subscriptions to Users</li>
              <li>A Customer may purchase multiple subscriptions and assign multiple Users</li>
              <li>License assignments can be managed through the Customer&apos;s account</li>
            </ul>
            <h3>4. Account Registration and Access</h3>
            <h4>4.1 Account Creation</h4>
            <p>To use our Services, you must:</p>
            <ul>
              <li>Create an account with accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years old or have parental consent</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <h4>4.2 Customer Accounts</h4>
            <p>Customers receive access to:</p>
            <ul>
              <li>Subscription management dashboard</li>
              <li>Add-in download capabilities</li>
              <li>License assignment tools</li>
              <li>Billing and payment history</li>
            </ul>
            <h4>4.3 User Accounts</h4>
            <p>Users assigned licenses receive access to:</p>
            <ul>
              <li>Add-in download and installation</li>
              <li>Personal account settings</li>
              <li>Limited subscription information relevant to their assigned license</li>
            </ul>
            <h3>5. Payment and Billing</h3>
            <h4>5.1 Subscription Fees</h4>
            <ul>
              <li>All subscription fees are due in advance</li>
              <li>Prices are subject to change with 30 days&apos; notice</li>
              <li>All fees are non-refundable except as required by law</li>
            </ul>
            <h4>5.2 Payment Processing</h4>
            <ul>
              <li>Payments are processed through secure third-party payment processors</li>
              <li>You authorize us to charge your payment method for all applicable fees</li>
              <li>Failed payments may result in service suspension</li>
            </ul>
            <h4>5.3 Auto-Renewal</h4>
            <ul>
              <li>Subscriptions automatically renew at the end of each billing period</li>
              <li>You may cancel auto-renewal through your account settings</li>
              <li>Cancellation must occur before the next billing date to avoid charges</li>
            </ul>
            <h3>6. Permitted Use and Restrictions</h3>
            <h4>6.1 Permitted Use</h4>
            <p>You may use our Services for:</p>
            <ul>
              <li>Legitimate business and personal purposes</li>
              <li>Creating, editing, and managing Excel spreadsheets</li>
              <li>Utilizing Add-in features according to your subscription tier</li>
            </ul>
            <h4>6.2 Prohibited Activities</h4>
            <p>You may not:</p>
            <ul>
              <li>Share, distribute, or resell your license to unauthorized parties</li>
              <li>Reverse engineer, decompile, or attempt to derive source code</li>
              <li>Use the Services for illegal or unauthorized purposes</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Interfere with or disrupt the Services or servers</li>
              <li>Upload malicious code or attempt to gain unauthorized access</li>
              <li>Use the Services to compete with or create competing products</li>
            </ul>
            <h4>6.3 License Compliance</h4>
            <ul>
              <li>Use the Add-in only according to your assigned license</li>
              <li>Ensure compliance with Microsoft Excel&apos;s terms of use</li>
              <li>Maintain appropriate software licenses for underlying systems</li>
            </ul>
            <h3>7. Intellectual Property Rights</h3>
            <h4>7.1 Our Rights</h4>
            <ul>
              <li>We retain all rights, title, and interest in the Services</li>
              <li>The Add-in, website, and all content are protected by intellectual property laws</li>
              <li>No rights are granted except as expressly stated in these Terms</li>
            </ul>
            <h4>7.2 Your Content</h4>
            <ul>
              <li>You retain ownership of data and content you create using the Add-in</li>
              <li>You grant us limited rights to store and process your content to provide Services</li>
              <li>You are responsible for ensuring you have rights to any content you use</li>
            </ul>
            <h3>8. Privacy and Data Protection</h3>
            <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated by reference into these Terms.</p>
            <h3>9. Service Availability and Modifications</h3>
            <h4>9.1 Service Availability</h4>
            <ul>
              <li>We strive to maintain high service availability but cannot guarantee uninterrupted access</li>
              <li>Scheduled maintenance will be announced in advance when possible</li>
              <li>We are not liable for service interruptions beyond our reasonable control</li>
            </ul>
            <h4>9.2 Service Modifications</h4>
            <ul>
              <li>We may modify, update, or discontinue features with reasonable notice</li>
              <li>Significant changes affecting functionality will be communicated to users</li>
              <li>We may add new features or capabilities at our discretion</li>
            </ul>
            <h3>10. Support and Maintenance</h3>
            <h4>10.1 Customer Support</h4>
            <ul>
              <li>We provide customer support through designated channels</li>
              <li>Support availability may vary by subscription tier</li>
              <li>We will make reasonable efforts to assist with technical issues</li>
            </ul>
            <h4>10.2 Updates and Patches</h4>
            <ul>
              <li>We may provide updates, patches, and new versions of the Add-in</li>
              <li>Some updates may be required for continued service access</li>
              <li>Major version updates may be subject to additional terms</li>
            </ul>
            <h3>11. Termination</h3>
            <h4>11.1 Termination by You</h4>
            <ul>
              <li>You may cancel your subscription at any time through your account</li>
              <li>Cancellation becomes effective at the end of the current billing period</li>
              <li>Access to the Add-in will cease upon subscription expiration</li>
            </ul>
            <h4>11.2 Termination by Us</h4>
            <p>We may terminate your access immediately if you:</p>
            <ul>
              <li>Violate these Terms or our policies</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Fail to pay applicable fees</li>
              <li>Misuse the Services or harm other users</li>
            </ul>
            <h4>11.3 Effect of Termination</h4>
            <p>Upon termination:</p>
            <ul>
              <li>Your access to the Services will cease</li>
              <li>We may delete your account and data according to our Privacy Policy</li>
              <li>Outstanding fees remain due and payable</li>
              <li>Sections of these Terms that should survive will remain in effect</li>
            </ul>
            <h3>12. Disclaimers and Limitation of Liability</h3>
            <h4>12.1 Disclaimers</h4>
            <p>THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANT ABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
            <h4>12.2 Limitation of Liability</h4>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICES IN THE 12 MONTHS PRECEDING THE CLAIM. WE SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</p>
            <h3>13. Indemnification</h3>
            <p>You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from:</p>
            <ul>
              <li>Your use of the Services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content or data you provide or create</li>
            </ul>
            <h3>14. Dispute Resolution</h3>
            <h4>14.1 Governing Law</h4>
            <p>These Terms are governed by the laws of the State of Delaware, without regard to conflict of law principles.</p>
            <h4>14.2 Dispute Resolution Process</h4>
            <ul>
              <li>Initial disputes should be addressed through our customer support</li>
              <li>If unresolved, disputes may be subject to binding arbitration</li>
              <li>You retain the right to pursue claims in small claims court</li>
            </ul>
            <h3>15. General Provisions</h3>
            <h4>15.1 Entire Agreement</h4>
            <p>These Terms, along with our Privacy Policy, constitute the entire agreement between you and us regarding the Services.</p>
            <h4>15.2 Modifications</h4>
            <p>We may modify these Terms at any time by:</p>
            <ul>
              <li>Posting updated Terms on our website</li>
              <li>Providing notice through email or the Services</li>
              <li>Requiring acceptance of new Terms for continued use</li>
            </ul>
            <h4>15.3 Severability</h4>
            <p>If any provision of these Terms is found unenforceable, the remaining provisions will continue in full force and effect.</p>
            <h4>15.4 Assignment</h4>
            <p>You may not assign your rights under these Terms. We may assign our rights and obligations to any party.</p>
            <h3>16. Contact Information</h3>
            <p>For questions about these Terms of Use, please contact us at:</p>
            <Company styles={styles} />
            <div style={{ minHeight: '40px' }} />
            <p><em>These Terms of Use are provided as a template and should be reviewed by qualified legal counsel to ensure compliance with applicable laws and regulations in your jurisdiction.</em></p>
          </div>
        </div>
        <Footer />
      </div>
    </AnimateX>
  );
};


export default TermsOfUsePage;
