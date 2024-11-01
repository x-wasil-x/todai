import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RequiresAuth } from '../components/RequiresAuth';
import { Loader } from '../components/Loader/Loader';
import { useAuth } from '../contexts/AuthProvider';
const Home = lazy(() => import('../pages/Home/Home'));
const Explore = lazy(() => import('../pages/Explore/Explore'));
const Bookmark = lazy(() => import('../pages/Bookmark/Bookmark'));
const Profile = lazy(() => import('../pages/Profile/Profile'));
const Login = lazy(() => import('../pages/Auth/Login/Login'));
const Signup = lazy(() => import('../pages/Auth/Signup/Signup'));
const PostDetail = lazy(() => import('../pages/PostDetail/PostDetail'));
const Error = lazy(() => import('../pages/Error/Error'));

export const NavRoutes = () => {
  const { auth } = useAuth();

  return (
    <Suspense loading={<Loader />}>
      <Routes>
        <Route
          path="/home"
          element={
            <RequiresAuth>
              <Home />
            </RequiresAuth>
          }
        />
        <Route
          path="/explore"
          element={
            <RequiresAuth>
              <Explore />
            </RequiresAuth>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <RequiresAuth>
              <Bookmark />
            </RequiresAuth>
          }
        />
        <Route
          path="/profile/:did"
          element={
            <RequiresAuth>
              <Profile />
            </RequiresAuth>
          }
        />
        <Route
          path="/post-detail/:postId"
          element={
            <RequiresAuth>
              <PostDetail />
            </RequiresAuth>
          }
        />

        {!auth?.did && (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/error" element={<Error />} />
            <Route path="*" element={<Navigate to="/error" replace />} />
          </>
        )}

        {auth?.did && (
          <Route path="*" element={<Navigate to="/home" replace />} />
        )}
      </Routes>
    </Suspense>
  );
};
