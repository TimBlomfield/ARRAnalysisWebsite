import thankYouEmail from '@/utils/emails/thank-you.html';

const ThankYouPage = () => {
  const html = thankYouEmail.replace('[Logo URL]', `${process.env.NEXTAUTH_URL}/logo-blue.svg`)
    .replaceAll('[Customer Name]', 'John Doe')
    .replaceAll('[Subscription]', '4 subscriptions')
    .replaceAll('[Tier]', 'Tier 2')
    .replaceAll('[Product Name]', 'ARR Analysis Intermediate (Tier 2)')
    .replaceAll('[Subscription Type]', 'Monthly')
    .replaceAll('[Purchase Date]', '17 Feb 2023')
    .replaceAll('[Login URL]', process.env.LOGIN_BASEURL)
    .replaceAll('[Your Name]', 'Tim Blomfield')
    .replaceAll('[Your Company]', 'ARR Analysis')
    .replaceAll('[Current Year]', '2023')
    .replaceAll('[Customer Email]', 'johndoe@example.com');

  return (
    <iframe
      srcDoc={html}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Thank You Email"
    />
  );
};

export default ThankYouPage;
