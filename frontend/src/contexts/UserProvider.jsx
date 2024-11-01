import React, { createContext, useContext } from 'react';
import { useReducer } from 'react';

import { getAllUserService } from '../services/UserService';
import { userReducer } from '../reducers/userReducer';
import { initial } from '../reducers/userReducer';
import { useQuery } from '@tanstack/react-query';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(userReducer, initial);

  const getAllUsers = async () => {
    const response = await getAllUserService();
    dispatch({ type: 'SET_ALL_USERS', payload: response });
    return response;
  };

  useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      return await getAllUsers();
    },
  });

  return (
    <UserContext.Provider value={{ userState, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
