import './UserInfo.css';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useLoggedInUser } from '../../../../contexts/LoggedInUserProvider';
import { useUser } from '../../../../contexts/UserProvider';
import { createdOnDate } from '../../../../utils/date';
import { ShowFollowersModal } from '../ShowFollowersModal/ShowFollowersModal';
import { ShowFollowingModal } from '../ShowFollowingModal/ShowFollowingModal';
import { CgCalendarDates, RxCross2 } from '../../../../utils/icons';
import { getUserService } from '../../../../services/UserService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ShowDidModal } from '../ShowDidModal/ShowDidModal';

export const UserInfo = ({ setIsEditProfile, postsByUser }) => {
  const { userState } = useUser();
  const { did } = useParams();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showDid, setShowDid] = useState(false);
  const [user, setUser] = useState(null);
  const { loggedInUserState, followUser, unfollowUser } = useLoggedInUser();
  const isOwnProfile = did === loggedInUserState?.did;
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const fetchUser = useCallback(async (did) => {
    const response = await getUserService(did);

    setUser(response);

    return response;
  }, []);

  useEffect(() => {
    if (did) {
      fetchUser(did);
    }
  }, [pathname]);

  useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      return await fetchUser(did);
    },
  });

  const userDetails = useMemo(
    () => userState?.allUsers?.find(({ did }) => did === user?.did),
    [userState?.allUsers, user?.did],
  );

  const isFollowing = useCallback(
    (user) => userDetails?.following?.find(({ did }) => did === user?.did),
    [userDetails?.following],
  );

  const followUnfollowHandler = useCallback(
    (e, user) => {
      e.stopPropagation();

      const userFromAllUsers = userState?.allUsers?.find(
        ({ did }) => did === user?.did,
      );

      !isFollowing(user)
        ? followUser(userFromAllUsers?._id)
        : unfollowUser(userFromAllUsers?._id);

      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    [userState?.allUsers, isFollowing, followUser, unfollowUser],
  );

  return (
    <div className="user-info-container">
      {user && (
        <>
          <div className="profilepicture-container">
            <img src={user?.avatarURL} alt={user?.username} />
            {isOwnProfile ? (
              <button onClick={() => setIsEditProfile(true)}>
                Edit Profile
              </button>
            ) : !loggedInUserState.following?.find(
                (follow) => follow._id === user?._id,
              ) ? (
              <button onClick={() => followUser(user?._id)}>Follow</button>
            ) : (
              <button onClick={() => unfollowUser(user?._id)}>Following</button>
            )}
          </div>

          <div
            className="username-container"
            onClick={() => {
              setShowDid(true);
            }}
          >
            <p className="username">@{user?.username}</p>
            <p className="did-id">{user?.did}</p>
          </div>

          {showDid && (
            <div className="like-modal">
              <div className="likes-content">
                <div className="likes-header">
                  <h2>DID</h2>
                  <RxCross2
                    className="close-icon"
                    onClick={() => {
                      setShowDid(false);
                    }}
                  />
                </div>
                <ShowDidModal user={user} setShowDid={setShowDid} />
              </div>
            </div>
          )}

          <div className="bio-container">
            <p>{user?.bio}</p>
          </div>

          <div className="website-container">
            <a href={user?.website} target="_blank" rel="noreferrer">
              {user?.website.split('//')[1]}
            </a>
            <div className="joining-date-container">
              <CgCalendarDates />
              <span>Joined: {createdOnDate(user)}</span>
            </div>
          </div>
          <div className="post-followers-following-container">
            <p>
              {postsByUser?.length}
              <span>Posts</span>
            </p>
            <p
              className="post-following-count"
              onClick={() => {
                setShowFollowing(true);
              }}
            >
              {user?.following?.length}
              <span>Following</span>
            </p>
            {showFollowing && (
              <div className="like-modal">
                <div className="likes-content">
                  <div className="likes-header">
                    <h2>Following</h2>
                    <RxCross2
                      className="close-icon"
                      onClick={() => {
                        setShowFollowing(false);
                      }}
                    />
                  </div>
                  <ShowFollowingModal
                    user={user}
                    isFollowing={isFollowing}
                    followUnfollowHandler={followUnfollowHandler}
                    setShowFollowing={setShowFollowing}
                  />
                </div>
              </div>
            )}
            <p
              className="post-follower-count"
              onClick={() => {
                setShowFollowers(true);
              }}
            >
              {user?.followers?.length}
              <span>Followers</span>
            </p>
            {showFollowers && (
              <div className="like-modal">
                <div className="likes-content">
                  {' '}
                  <div className="likes-header">
                    <h2>Followers</h2>
                    <RxCross2
                      className="close-icon"
                      onClick={() => {
                        setShowFollowers(false);
                      }}
                    />
                  </div>
                  <ShowFollowersModal
                    user={user}
                    isFollowing={isFollowing}
                    followUnfollowHandler={followUnfollowHandler}
                    setShowFollowers={setShowFollowers}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
