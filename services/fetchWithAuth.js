import { getAuth } from 'firebase/auth';

const fetchWithAuth = async (url, options = {}) => {
  const auth = getAuth();
  const idToken = await auth.currentUser.getIdToken(true);

  const headers = {
    Authorization: `${idToken.toString()}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    console.log(response.status);
    throw new Error(`HTTP error! status: ${response.status} endpoint: ${url}`);
  } else {
    const data = await response.json();
    return data;
  }
};

export { fetchWithAuth };
