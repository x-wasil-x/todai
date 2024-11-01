import React, { createContext, useContext } from 'react';
import { useReducer } from 'react';
import { loggedInUserReducer, initial } from '../reducers/loggedInUserReducer';
import {
  editUserService,
  followUserService,
  unfollowUserService,
  getUserService,
  addBookmarkService,
  removeBookmarkService,
} from '../services/UserService';
import { useUser } from './UserProvider';
import { useQueryClient, useQuery } from '@tanstack/react-query';

const LoggedInUserContext = createContext();

export const LoggedInUserProvider = ({ children }) => {
  const did = localStorage.getItem('did');
  const { dispatch } = useUser();
  const queryClient = useQueryClient();

  const [loggedInUserState, loggedInUserDispatch] = useReducer(
    loggedInUserReducer,
    initial,
  );

  const getUser = async (user) => {
    try {
      const response = await getUserService(user);

      loggedInUserDispatch({ type: 'SET_USER', payload: response });

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const editUser = async (userData) => {
    try {
      const response = await editUserService(userData);
      loggedInUserDispatch({
        type: 'SET_USER',
        payload: response,
      });
      loggedInUserDispatch({ type: 'SET_USER', payload: response });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      console.error(error);
    }
  };

  const followUser = async (userId) => {
    try {
      const response = await followUserService(userId);

      dispatch({ type: 'SET_ALL_USERS', payload: response });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (error) {
      console.error(error);
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const response = await unfollowUserService(userId);

      dispatch({ type: 'SET_ALL_USERS', payload: response });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (error) {
      console.error(error);
    }
  };

  const addBookmark = async (postId) => {
    try {
      const response = await addBookmarkService(postId);
      loggedInUserDispatch({ type: 'SET_USER', payload: response });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (error) {
      console.error(error);
    }
  };

  const removeBookmark = async (postId) => {
    try {
      const response = await removeBookmarkService(postId);
      loggedInUserDispatch({ type: 'SET_USER', payload: response });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (error) {
      console.error(error);
    }
  };

  useQuery({
    queryKey: ['user', did],
    queryFn: async () => {
      return await getUser(did);
    },
  });

  return (
    <LoggedInUserContext.Provider
      value={{
        loggedInUserState,
        loggedInUserDispatch,
        editUser,
        followUser,
        unfollowUser,
        addBookmark,
        removeBookmark,
      }}
    >
      {children}
    </LoggedInUserContext.Provider>
  );
};

export const useLoggedInUser = () => useContext(LoggedInUserContext);
