import { api } from '.';
const username = localStorage.getItem('username');

export const getAllPostService = async () =>
  username && (await api.get('/posts')).data;

export const getAllUser = async (did, skip, limit) =>
  username && (await api.get(`/posts/user`, { did, skip, limit })).data;

export const likePostService = async (postId) =>
  username && (await api.post(`/posts/like/${postId}`)).data;

export const dislikePostService = async (postId) =>
  username && (await api.post(`/posts/dislike/${postId}`)).data;

export const createPostService = async (post) =>
  username && (await api.post('/posts', post)).data;

export const deletePostService = async (postId) =>
  username && (await api.post(`/posts/delete/${postId}`)).data;

export const editPostService = async (postId, post) =>
  username && (await api.post(`/posts/edit/${postId}`, post)).data;

export const getCommentsService = async (postId) =>
  username && (await api.get(`/posts/comments/${postId}`)).data;

export const addCommentsService = async (did, postId, text, avatarURL) => {
  const comment = { did, text, username, avatarURL };

  return (
    username && (await api.post(`/posts/comments/add/${postId}`, comment)).data
  );
};

export const deleteCommentService = async (postId, comment) =>
  username &&
  (await api.post(`/posts/comments/delete/${postId}`, comment)).data;

export const editCommentService = async (postId, commentData) =>
  username &&
  (await api.post(`/posts/comments/edit/${postId}`, commentData)).data;
