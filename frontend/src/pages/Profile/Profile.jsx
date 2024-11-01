import './Profile.css';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePosts } from '../../contexts/PostsProvider';
import { Post } from '../../components/Post/Post';
import { EditProfileModal } from './components/EditProfileModal/EditProfileModal';
import { UserInfo } from './components/UserInfo/UserInfo';
import { Helmet } from 'react-helmet-async';

export default function Profile() {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const { allPosts, postLoading } = usePosts();
  const { did } = useParams();

  const postsByUser = useMemo(() => {
    if (!Array.isArray(allPosts)) return [];

    return allPosts.filter((post) => post.did === did);
  }, [allPosts, did]);

  return (
    <>
      <Helmet>
        <title>Profile | Tōdai</title>
      </Helmet>

      <main className="feed">
        <UserInfo
          setIsEditProfile={setIsEditProfile}
          postsByUser={postsByUser}
        />
        <div className="user-posts-container">
          {!postLoading &&
            (postsByUser.length ? (
              postsByUser.map((post) => <Post key={post._id} post={post} />)
            ) : (
              <p className="no-bookmarks">You have not added any posts!</p>
            ))}
        </div>
        {isEditProfile && (
          <div className="create-post-modal">
            <EditProfileModal
              className="modal-content"
              setIsEditProfile={setIsEditProfile}
            />
          </div>
        )}
      </main>
    </>
  );
}
