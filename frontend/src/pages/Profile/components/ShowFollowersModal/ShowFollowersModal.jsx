import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ShowFollowersModal = ({ user, setShowFollowers }) => {
  const navigate = useNavigate();

  return user?.followers.length ? (
    user?.followers?.map((follow) => (
      <div
        onClick={() => {
          navigate(`/profile/${follow.did}`);
          setShowFollowers(false);
        }}
        key={user?._id}
        className="discover-user-card"
      >
        <div
          onClick={() => {
            navigate(`/profile/${follow.did}`);
            setShowFollowers(false);
          }}
          className="discover-user-img-container"
        >
          <img src={follow?.avatarURL} alt={follow?.username} />
        </div>
        <div className="user-name-username-container">
          <p className="username">@{follow?.username}</p>
        </div>
      </div>
    ))
  ) : (
    <p className="no-bookmarks">No followers</p>
  );
};
