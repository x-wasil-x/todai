import React, { createContext, useContext, useState } from 'react';
import {
  getAllPostService,
  likePostService,
  dislikePostService,
  createPostService,
  deletePostService,
  editPostService,
  getCommentsService,
  addCommentsService,
  deleteCommentService,
  editCommentService,
} from '../services/PostService';
import { useQueryClient, useQuery } from '@tanstack/react-query';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const [sortBy, setSortBy] = useState('Latest');
  const queryClient = useQueryClient();

  const getAllPosts = async () => {
    try {
      setPostLoading(true);
      const response = await getAllPostService();
      setAllPosts(response);
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      setPostLoading(false);
    }
  };

  const likePost = async (postId) => {
    try {
      setPostLoading(true);
      const response = await likePostService(postId);
      setAllPosts(response);
    } catch (error) {
      console.error(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setPostLoading(false);
    }
  };

  const dislikePost = async (postId) => {
    try {
      setPostLoading(true);
      const response = await dislikePostService(postId);
      setAllPosts(response);
    } catch (error) {
      console.error(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setPostLoading(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      setPostLoading(true);
      const response = await deletePostService(postId);
      setAllPosts(response);
    } catch (error) {
      console.error(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setPostLoading(false);
    }
  };

  const createPost = async (e, post) => {
    try {
      e.preventDefault();
      setPostLoading(true);
      const response = await createPostService(post);
      setAllPosts(response);
    } catch (error) {
      console.error(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setPostLoading(false);
    }
  };

  const editPost = async (e, postId, post) => {
    try {
      e.preventDefault();
      const response = await editPostService(postId, post);
      setAllPosts(response);
    } catch (error) {
      console.error(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  };

  const getComments = async (postId) => {
    try {
      const response = await getCommentsService(postId);
      setAllPosts(response);
    } catch (error) {
      console.error(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  };

  const addComment = async (did, postId, text, avatarURL) => {
    try {
      const response = await addCommentsService(did, postId, text, avatarURL);
      setAllPosts(response);
    } catch (error) {
      console.error(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const response = await deleteCommentService(postId, commentId);
      setAllPosts(response);
    } catch (error) {
      console.error(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  };

  const editComment = async (postId, commentData) => {
    try {
      const response = await editCommentService(postId, commentData);
      setAllPosts(response);
    } catch (error) {
      console.error(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  };

  const addBookmark = async (postId) => {
    try {
      setPostLoading(true);
      const response = await addBookmarkService(postId);
      setAllPosts(response);
    } catch (error) {
      console.error(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setPostLoading(false);
    }
  };

  const removeBookmark = async (postId) => {
    try {
      setPostLoading(true);
      const response = await removeBookmarkService(postId);
      setAllPosts(response);
    } catch (error) {
      console.error(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setPostLoading(false);
    }
  };

  useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      return await getAllPosts();
    },
  });

  return (
    <PostsContext.Provider
      value={{
        setSortBy,
        sortBy,
        allPosts,
        likePost,
        dislikePost,
        createPost,
        deletePost,
        editPost,
        addComment,
        editComment,
        deleteComment,
        addBookmark,
        removeBookmark,
        getComments,
        postLoading,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
