import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ShowFollowingModal = ({ user, setShowFollowing }) => {
  const navigate = useNavigate();
  return user?.following?.length ? (
    user?.following?.map((follow) => (
      <div
        onClick={() => {
          navigate(`/profile/${follow.did}`);
          setShowFollowing(false);
        }}
        key={user?._id}
        className="discover-user-card"
      >
        <div
          onClick={() => {
            navigate(`/profile/${follow.did}`);
            setShowFollowing(false);
          }}
          className="discover-user-img-container"
        >
          <img src={follow?.avatarURL} alt={follow.username} />
        </div>
        <div className="user-name-username-container">
          <p className="username">@{follow?.username}</p>
        </div>
      </div>
    ))
  ) : (
    <p className="no-bookmarks">Not following anyone!</p>
  );
};
