// Components
import EmailCustomizer from '../EmailCustomizer';


const ResetPasswordPage = () => <EmailCustomizer which="Reset Password"
                                                 loginUrl=""
                                                 passwordResetUrl={process.env.RESET_PASSWORD_BASEURL + '?token=INVALID_TOKEN'}
                                                 logoUrl={`${process.env.NEXTAUTH_URL}/arr-logo-email.png`} />;


export default ResetPasswordPage;
