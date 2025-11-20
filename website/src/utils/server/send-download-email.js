import 'server-only';
import Mailgun from 'mailgun.js';
import formData from 'form-data';


const sendDownloadEmail = async (token, firstName, email, licensePassword, expiresAt) => {
  // Send the email
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

  const downloadUrl = process.env.NEXTAUTH_URL + '/trial/download?token=' + token;
  const helpCenterUrl = process.env.NEXTAUTH_URL + '/help-center';
  const purchaseUrl = process.env.NEXTAUTH_URL + '/purchase';
  const html = `Dear ${firstName},
                 <p>Thank you for your interest in ARR Analysis.</p>
                 <p>Your trial license credentials are:</p>
                 <p>Your Email: <strong>${email}</strong></p>
                 <p>Your License Password: <strong>${licensePassword}</strong></p>
                 <p>It is valid until ${expiresAt.toFormat('dd - LLL - yyyy')}.</p>
                 <p>You can use the following download link to download the most recent version of our ARR Analysis Excel Add-in:</p>
                 <p><a href="${downloadUrl}">${downloadUrl}</a></p>
                 <p>After downloading and installing the software, start Microsoft Excel and navigate to the <em>ARR Analysis</em> tab. Click on the <em>License</em> button and enter your credentials to activate the add-in.</p>
                 <p>In case of any problems with installation and usage please refer to the following web page</p>
                 <p><a href="${helpCenterUrl}">${helpCenterUrl}</a></p>
                 <p>For purchasing please visit the following web page</p>
                 <p><a href="${purchaseUrl}">${purchaseUrl}</a></p>
                 <p>Please let us know if we can be of further assistance.</p>
                 <p></p>
                 <p>Kind regards,<br />the ARR Analysis team</p>`;

  const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
    from: `The ARR Analysis Support Team <support-team@${process.env.MAILGUN_DOMAIN}>`,
    to: [email],
    subject: 'Your ARR Analysis trial request',
    text: 'Ephemeral link',
    html,
  });
};


export default sendDownloadEmail;
