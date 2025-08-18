import { notFound } from 'next/navigation';
import { DateTime } from 'luxon';
import db from '@/utils/server/db';
// Components
import ResetPasswordClientPage from '@/components/forms/ResetPasswordClientPage';


const ResetPasswordPage = async ({ searchParams }) => {
  const { token } = searchParams;

  // Check if the token is valid
  if (token == null || token === '')
    notFound();
  let resetPwdLink = await db.resetPasswordLink.findUnique({
    where: { token },
  });
  if (resetPwdLink == null)
    notFound();

  // Check if the reset password link has expired
  if (resetPwdLink.expiresAt < DateTime.now().toJSDate()) {
    await db.resetPasswordLink.delete({
      where: { id: resetPwdLink.id },
    });
    notFound();
  }

  // Check if the user exists
  const existingUserData = await db.userData.findUnique({
    where: { email: resetPwdLink.email },
  });
  if (existingUserData == null)
    notFound();

  // Update and check the bruteForceRefreshCount
  const refreshCount = +resetPwdLink.bruteForceRefreshCount;
  if (refreshCount <= 0) {
    await db.resetPasswordLink.delete({
      where: { id: resetPwdLink.id },
    });
    notFound();
  }
  resetPwdLink = await db.resetPasswordLink.update({
    where: { id: resetPwdLink.id },
    data: { bruteForceRefreshCount: refreshCount - 1 },
  });

  return <ResetPasswordClientPage email={resetPwdLink.email} token={resetPwdLink.token} />;
};


export default ResetPasswordPage;
