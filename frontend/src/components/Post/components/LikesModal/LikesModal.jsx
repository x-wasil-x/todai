import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LikesModal = ({ post }) => {
  const navigate = useNavigate();

  return post?.likes?.likedBy.map((user) => (
    <div
      onClick={() => {
        navigate(`/profile/${user.did}`);
      }}
      key={user?._id}
      className="discover-user-card"
    >
      <div
        onClick={() => {
          navigate(`/profile/${user.did}`);
        }}
        className="discover-user-img-container"
      >
        <img src={user.avatarURL} alt={user.username} />
      </div>
      <div className="user-name-username-container">
        <p className="username">@{user?.username}</p>
      </div>
    </div>
  ));
};
