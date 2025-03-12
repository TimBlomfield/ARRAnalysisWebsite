// Components
import EmailCustomizer from '../EmailCustomizer';


const ThankYouPage = () => <EmailCustomizer which="Thank You"
                                            loginUrl={process.env.LOGIN_BASEURL}
                                            logoUrl={`${process.env.NEXTAUTH_URL}/arr-logo-email.png`} />;


export default ThankYouPage;
