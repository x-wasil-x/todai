import './Discover.css';
import React, { useMemo } from 'react';
import { useUser } from '../../contexts/UserProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import { useLoggedInUser } from '../../contexts/LoggedInUserProvider';

export const Discover = () => {
  const { auth } = useAuth();
  const { loggedInUserState, followUser } = useLoggedInUser();
  const { userState } = useUser();
  const navigate = useNavigate();

  const whoToFollow = useMemo(() => {
    // Return early if required data is not available
    if (
      !userState?.allUsers ||
      !auth?.username ||
      !loggedInUserState?.following
    ) {
      return [];
    }

    return userState.allUsers.filter(
      (user) =>
        userState.username !== auth.username &&
        loggedInUserState.following.every(
          (following) => following?.username !== userState.username,
        ),
    );
  }, [
    userState?.allUsers,
    userState?.username,
    auth?.username,
    loggedInUserState?.following,
  ]);

  return (
    <main className="discover">
      {userState?.username && (
        <div className="discover-container">
          <div className="discover-header">
            <p>Who to follow?</p>
          </div>
          <div className="discover-body">
            {whoToFollow?.length ? (
              whoToFollow?.map((user) => (
                <div
                  onClick={() => {
                    navigate(`/profile/${user.username}`);
                  }}
                  key={userState?._id}
                  className="discover-user-card"
                >
                  <div
                    onClick={() => {
                      navigate(`/profile/${user.username}`);
                    }}
                    className="discover-user-img-container"
                  >
                    <img src={userState?.avatarURL} alt={user.username} />
                  </div>
                  <div className="user-name-username-container">
                    <p className="name">{userState?.username}</p>
                    <p className="username">@{userState?.username}</p>
                  </div>
                  <div className="follow-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        followUser(userState?._id, auth.token);
                      }}
                    >
                      Follow
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-bookmarks">No more suggestions!</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
