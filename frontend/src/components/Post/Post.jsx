import './Post.css';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AttentionSeeker, Slide } from 'react-awesome-reveal';
import { toast } from 'react-hot-toast';
import {
  FaBookmark,
  RiHeart3Fill,
  RiHeart3Line,
  FaRegBookmark,
  FaRegComment,
  RxDotsHorizontal,
  RxCross2,
  FiShare2,
} from '../../utils/icons';
import { useLoggedInUser } from '../../contexts/LoggedInUserProvider';
import { useAuth } from '../../contexts/AuthProvider';
import { usePosts } from '../../contexts/PostsProvider';
import { EditPostForm } from '../EditPostForm/EditPostForm';
import { useUser } from '../../contexts/UserProvider';
import { Comment } from './components/Comment/Comment';
import { getTimeDifference } from '../../utils/date';
import { LikesModal } from './components/LikesModal/LikesModal';
import axios from 'axios';
const ACCESS_TOKEN = import.meta.env.VITE_DBRO_TOKEN;
const headers = {
  headers: {
    'content-type': 'application/json',
    authorization: `Bearer ${ACCESS_TOKEN}`,
  },
};

export const Post = ({ post }) => {
  const navigate = useNavigate();
  const [isEditPostClicked, setIsEditPostClicked] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [actionMenu, setActionMenu] = useState(false);
  const { likePost, dislikePost, deletePost } = usePosts();
  const [commentData, setCommentData] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { addBookmark, removeBookmark, loggedInUserState } = useLoggedInUser();
  const { auth } = useAuth();
  const { addComment } = usePosts();
  const { userState } = useUser();

  const isBookmarkedAlready =
    loggedInUserState?.bookmarks &&
    loggedInUserState?.bookmarks?.find((postId) => postId === post?._id);

  const loggedInUser = useMemo(() => {
    return userState?.allUsers?.find((user) => user?._id === auth?._id);
  }, [userState?.allUsers, auth?._id]);

  const isFollowing = useMemo(() => {
    return (user) =>
      loggedInUser?.following &&
      loggedInUser.following.some(({ _id }) => _id === user?._id);
  }, [loggedInUser?.following]);

  const isLikedAlready = useMemo(() => {
    return post?.likes?.likedBy
      ? post.likes.likedBy.some((user) => user._id === loggedInUserState._id)
      : false;
  }, [post?.likes?.likedBy, loggedInUserState._id]);

  const copyHandler = (link) => {
    navigator.clipboard.writeText(link);
    toast.success('Link successfully copied!');
  };

  const handleDelete = async (e, post) => {
    try {
      e.preventDefault();

      if (post?.mediaURL) {
        const cid = post?.mediaURL?.split('/').pop();

        await axios.post(
          'https://api.decentralbros.tech/v1/delete',
          { cid: cid, _id: post._id },
          headers,
        );
      }

      await deletePost(post._id);
      setActionMenu(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="post-card">
      <div className="profile-picture-container">
        <img
          onClick={() => {
            navigate(`/profile/${post?.did}`);
          }}
          src={post?.avatarURL}
          alt={post.username}
        />{' '}
      </div>

      <div className="post-card-content">
        <div className="name-container">
          <div
            onClick={() => {
              navigate(`/profile/${post?.did}`);
            }}
            className="username-container"
          >
            <div
              onClick={() => {
                navigate(`/profile/${post?.did}`);
              }}
              className="username"
            >
              {`@${post?.username}: ${getTimeDifference(post?.createdAt)}`}
            </div>
            <br />
            <br />

            {loggedInUserState.did === post?.did && (
              <div
                className="edit"
                onClick={(e) => {
                  e.stopPropagation();
                  setActionMenu(!actionMenu);
                }}
              >
                <RxDotsHorizontal className="three-dots-icon" />
              </div>
            )}
            {actionMenu && (
              <div className="action-menu-container">
                <AttentionSeeker effect="headShake">
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditPostClicked(!isEditPostClicked);
                      setActionMenu(false);
                    }}
                  >
                    Edit Post
                  </p>
                  <p onClick={(e) => handleDelete(e, post)}>Delete Post</p>
                </AttentionSeeker>
              </div>
            )}
          </div>
        </div>
        {isEditPostClicked && (
          <div className="create-post-modal">
            <EditPostForm
              className="modal-content"
              setIsEditPostClicked={setIsEditPostClicked}
              post={post}
              setActionMenu={setActionMenu}
            />
          </div>
        )}

        <div className="caption-container">
          <p>{post?.content}</p>
        </div>

        <div
          onClick={() => navigate(`/post-detail/${post?._id}`)}
          className="media"
        >
          {post?.mediaURL && post.type.includes('video') && (
            <video controls muted loop>
              <source src={post?.mediaURL} />
            </video>
          )}
          {post?.mediaURL && post?.type.includes('image') && (
            <img src={post?.mediaURL} alt="" />
          )}
        </div>

        <div className="post-actions-container">
          <Slide
            fraction="0"
            duration="350"
            direction="up"
            cascade
            damping={0.3}
          >
            <div
              onClick={() => setShowComments(!showComments)}
              className="comments-container"
            >
              {/* <Slide cascade direction="up"> */}
              <FaRegComment className="comment-icon" />
              {/* </Slide> */}
              <span className="number-of-comments">
                <Slide direction="up">{post?.comments?.length}</Slide>
              </span>
            </div>
            <div className="comments-container">
              {/* <Slide direction="up"> */}
              {!isLikedAlready ? (
                <RiHeart3Line
                  className="like-icon"
                  onClick={() => likePost(post?._id)}
                />
              ) : (
                <RiHeart3Fill
                  className="like-icon like-done-icon"
                  onClick={() => dislikePost(post?._id)}
                />
              )}
              {/* </Slide> */}
              <span
                onClick={() => {
                  setShowLikesModal(true);
                }}
              >
                <Slide direction="up">{post?.likes?.likeCount}</Slide>
              </span>
            </div>
            <div className="comments-container">
              <FiShare2
                className="share-icon"
                onClick={() =>
                  copyHandler(
                    `https://${window.location.hostname}/post-detail/${post?._id}`,
                  )
                }
              />
              <span></span>
            </div>
            <div className="comments-container">
              {!isBookmarkedAlready ? (
                <FaRegBookmark
                  className="bookmark-icon"
                  onClick={() => addBookmark(post?._id)}
                />
              ) : (
                <FaBookmark
                  className="bookmark-icon bookmark-done-icon"
                  onClick={() => removeBookmark(post?._id)}
                />
              )}
              <span></span>
            </div>
          </Slide>
        </div>
        <div className="likes-details-container">
          {showLikesModal && (
            <div className="like-modal">
              <div className="likes-content">
                <div className="likes-header">
                  <h2>Liked By</h2>
                  <RxCross2
                    className="close-likes-icon"
                    onClick={() => {
                      setShowLikesModal(false);
                    }}
                  />
                </div>
                <LikesModal post={post} isFollowing={isFollowing} />
              </div>
            </div>
          )}
        </div>

        {showComments && (
          <div className="comments-section-container">
            {/* <Slide duration={1000} cascade> */}
            <div className="comments-input-section-container">
              <div className="user-profile-img-container">
                <img src={loggedInUserState?.avatarURL} alt={post.username} />
              </div>

              <div className="comments-textarea-btn-container">
                <textarea
                  placeholder="What do you think?"
                  onChange={(e) => setCommentData(e.target.value)}
                  value={commentData}
                  type="text"
                />
                <div className="comment-button-container">
                  <button
                    disabled={!commentData}
                    onClick={() => {
                      addComment(
                        loggedInUserState?.did,
                        post._id,
                        commentData,
                        loggedInUserState?.avatarURL,
                      );
                      setCommentData('');
                    }}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>

            <div className="all-comments-container">
              {post?.comments
                ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                ?.map((comment) => (
                  <Comment key={comment?._id} comment={comment} post={post} />
                ))}
            </div>

            {/* </Slide> */}
          </div>
        )}
      </div>
    </div>
  );
};
