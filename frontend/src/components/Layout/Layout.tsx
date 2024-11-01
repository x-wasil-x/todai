import React from 'react';
import { ScrollToTop } from '../ScrollToTop/ScrollToTop';
import { Loader } from '../Loader/Loader';
import { Toaster } from 'react-hot-toast';
import { usePosts } from '../../contexts/PostsProvider';
import { Discover } from '../../components/Discover/Discover';
import { Navbar } from '../../components/Navbar/Navbar';
import { useAuth } from '../../contexts/AuthProvider';
import { Footer, Header } from '@blocklet/ui-react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

export const Layout = ({ children }) => {
  const { postLoading } = usePosts();
  const { auth } = useAuth();

  return (
    <>
      <Header maxWidth="unset" />
      <div className="custom-scrollbar app-container">
        {auth.isAuth && <Navbar />}

        {children}

        {auth.isAuth && <Discover />}

        {auth.isAuth && postLoading && <Loader />}

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            success: { duration: 1500 },
            error: { duration: 1500 },
          }}
          containerStyle={{
            top: '6rem',
          }}
        />

        <ScrollToTop />
      </div>
      <Box
        component={Footer}
        sx={{
          '&>div>.MuiContainer-root': {
            maxWidth: 'unset',
          },
        }}
      />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.any.isRequired,
};
