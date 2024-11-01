import './Bookmark.css';
import React, { useMemo } from 'react';
import { useLoggedInUser } from '../../contexts/LoggedInUserProvider';
import { Post } from '../../components/Post/Post';
import { usePosts } from '../../contexts/PostsProvider';
import { Helmet } from 'react-helmet-async';

export default function Bookmark() {
  const { allPosts, postLoading } = usePosts();

  const { loggedInUserState } = useLoggedInUser();

  const allBookmarkedPosts = useMemo(() => {
    if (!Array.isArray(allPosts)) return [];

    return allPosts.filter((post) =>
      loggedInUserState?.bookmarks?.find((postId) => postId === post?._id),
    );
  }, [allPosts]);

  return (
    <>
      <Helmet>
        <title>Bookmarks | Tōdai</title>
      </Helmet>
      <main className="feed bookmark-container">
        {!postLoading &&
          (allBookmarkedPosts.length ? (
            allBookmarkedPosts?.map((post) => (
              <Post post={post} key={post?._id} />
            ))
          ) : (
            <p className="no-bookmarks">You have not added any Bookmarks!</p>
          ))}
      </main>
    </>
  );
}
