import './Comment.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { RxDotsHorizontal } from 'react-icons/rx';

import { usePosts } from '../../../../contexts/PostsProvider';
import { useAuth } from '../../../../contexts/AuthProvider';
import { getTimeDifference } from '../../../../utils/date';

export const Comment = ({ comment, post }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { deleteComment, editComment } = usePosts();
  const { did, avatarURL, username, text, createdAt } = comment;
  const [showCommentToolbar, setShowCommentToolbar] = useState(false);
  const [isEditComment, setIsEditComment] = useState(false);
  const [userComment, setUserComment] = useState(text);

  return (
    <div className="comment-card">
      <div>
        <img
          onClick={() => navigate(`/profile/${did}`)}
          className="comment-user-image"
          src={avatarURL}
          alt={username}
        />
      </div>

      <div className="comment-main-section">
        <div className="username-container">
          <div
            onClick={() => {
              navigate(`/profile/${did}`);
            }}
            className="username"
          >
            {`@${username}: ${getTimeDifference(createdAt)}`}
          </div>
          <br />
          <br />

          {did === auth?.did && (
            <div className="comment-toolbar">
              <div
                className="edit"
                onClick={() => setShowCommentToolbar(!showCommentToolbar)}
              >
                <RxDotsHorizontal className="three-dots-icon" />
              </div>
              {showCommentToolbar && (
                <div className="comment-toolbar-menu-container">
                  <p
                    onClick={() => {
                      setIsEditComment(true);
                      setShowCommentToolbar(false);
                    }}
                  >
                    Edit
                  </p>
                  <p
                    onClick={() => {
                      deleteComment(post?._id, comment);
                    }}
                  >
                    Delete
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {!isEditComment ? (
          <div className="user-comment">{text}</div>
        ) : (
          <div className="edit-comment-container">
            <textarea
              onChange={(e) => setUserComment(e.target.value)}
              value={userComment}
            />
            <button
              onClick={() => {
                editComment(post._id, { ...comment, text: userComment });
                setIsEditComment(false);
              }}
            >
              Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
