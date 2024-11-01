import { api } from '.';
const username = localStorage.getItem('username');

export const getAllUserService = async () => {
  return username && (await api.get('/users')).data;
};

export const getUserService = async (did) => {
  return username && (await api.get(`/users/find/${did}`)).data;
};

export const editUserService = async (userData) => {
  return username && (await api.post('/users/edit', userData)).data;
};

export const followUserService = async (userId) => {
  return username && (await api.post(`/users/follow/${userId}`)).data;
};

export const unfollowUserService = async (userId) => {
  return username && (await api.post(`/users/unfollow/${userId}`)).data;
};

export const getAllBookmarksService = async () => {
  return username && (await api.get('/users/bookmark')).data;
};

export const addBookmarkService = async (postId) => {
  return username && (await api.post(`/users/bookmark/${postId}`)).data;
};

export const removeBookmarkService = async (postId) => {
  return username && (await api.post(`/users/remove-bookmark/${postId}`)).data;
};
