import { api } from '.';

export const signupService = async (username, did) => {
  return (await api.post('/auth/signup', { username, did })).data;
};

export const loginService = async (did) => {
  return (await api.post('/auth/login', { did })).data;
};
