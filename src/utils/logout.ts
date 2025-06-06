import { userLogout } from "../services/auth/logout";
import { clearToken, getRefreshToken } from "./token";

export const handleLogoutUtil = async (
  showSnackbar: (msg: string, type: 'success' | 'error') => void,
  redirectToLanding: () => void
) => {
  const refreshToken = getRefreshToken();

  const logoutPayload = {
    refresh_token: refreshToken
  };

  console.log('Logout Payload:', logoutPayload);

  try {
    await userLogout(logoutPayload);
    showSnackbar('Logging out', 'success');
    clearToken();
    redirectToLanding();
  } catch (error) {
    console.error('Logout Error:', error);
    showSnackbar('Something went wrong', 'error');
  }
};