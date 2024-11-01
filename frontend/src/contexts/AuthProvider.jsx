import { createContext, useContext, useState } from 'react';
import { loginService, signupService } from '../services/AuthService';
import { useLoggedInUser } from './LoggedInUserProvider';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const did = localStorage.getItem('did');
  const [authError, setAuthError] = useState('');
  const [authSignupError, setAuthSignupError] = useState('');
  const { loggedInUserDispatch } = useLoggedInUser();

  const [auth, setAuth] = useState(
    token && username && did
      ? { isAuth: true, token, username, did }
      : { isAuth: false, token: '', username: '', did: '' },
  );

  const handleSignup = async (username, did) => {
    try {
      const response = await signupService(username, did);
      const token = response.token;

      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('did', did);

      setAuth({
        isAuth: true,
        token,
        did,
        username: response.username,
      });

      loggedInUserDispatch({
        type: 'SET_USER',
        payload: response.username,
      });

      window.location.assign('/home');
    } catch (error) {
      setAuthSignupError(error.response.errors);
      console.error(error);
    }
  };

  const handleLogin = async (did) => {
    try {
      const response = await loginService(did);
      const token = response.token;
      const username = response.username;

      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('did', did);

      setAuth({
        isAuth: true,
        token,
        did,
        username: response.username,
      });

      loggedInUserDispatch({
        type: 'SET_USER',
        payload: response.username,
      });

      window.location.assign('/home');
    } catch (error) {
      console.error(error);
      setAuthError(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuth({ isAuth: false, token: '', username: '', user: {} });
    loggedInUserDispatch({ type: 'REMOVE_USER', payload: {} });
    window.location.assign('/');
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        handleLogin,
        handleLogout,
        handleSignup,
        authError,
        authSignupError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
