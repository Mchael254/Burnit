
import axios from 'axios';
import { getToken } from '../../utils/token';
import { isTokenExpired } from '../../utils/checkTokenExpiry';
import { redirectToLogin } from '../../utils/redirect';
import { useContactsStore } from '../../store/useContactsStore';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserContacts = async (name: string) => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    redirectToLogin();
    return;
  }

  const store = useContactsStore.getState();
  store.setLoading(true);
  store.setError(null);

  try {
    const response = await axios.get(`${BASE_URL}/users/contacts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { name },
    });

    store.setContacts(response.data);
    return response.data;

  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Cannot get contacts';
      store.setError(message);
      throw new Error(message);
    } else {
      store.setError("Something went wrong");
      throw new Error('Something went wrong');
    }
  } finally {
    store.setLoading(false);
  }
};
