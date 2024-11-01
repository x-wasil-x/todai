import './PostDetail.css';

import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { usePosts } from '../../contexts/PostsProvider';
import { Post } from '../../components/Post/Post';
import { Helmet } from 'react-helmet-async';

export default function PostDetail() {
  const { postId } = useParams();
  const { allPosts, postLoading } = usePosts();

  const post = useMemo(() => {
    return allPosts?.find((post) => post?._id === postId) || null;
  }, [allPosts, postId]);

  return (
    <>
      <Helmet>
        <title>Post Detail | Tōdai</title>
      </Helmet>

      <main className="feed">{!postLoading && <Post post={post} />}</main>
    </>
  );
}
