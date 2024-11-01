import './EditPostForm.css';
import React, { useState, useEffect } from 'react';
import { IoMdClose, ImFilePicture, BsEmojiSmile } from '../../utils/icons';
import '../CreatePostForm/CreatePostForm.css';
import { useLoggedInUser } from '../../contexts/LoggedInUserProvider';
import { usePosts } from '../../contexts/PostsProvider';
import { EmojiModal } from '../EmojiModal/EmojiModal';
import { toast } from 'react-hot-toast';

export const EditPostForm = ({
  setIsEditPostClicked,
  className,
  post,
  setActionMenu,
}) => {
  const { editPost } = usePosts();
  const { loggedInUserState } = useLoggedInUser();
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const username = loggedInUserState?.username;
  const avatarURL = loggedInUserState?.avatarURL;
  const did = loggedInUserState?.did;
  const [postEditForm, setPostEditForm] = useState({
    did,
    username,
    avatarURL,
    content: post?.content,
    mediaURL: post?.mediaURL,
    type: post?.type,
  });

  const handleEditMediaInput = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file?.type?.startsWith('image/') || file?.type?.startsWith('video/')) {
      if (file.size < 20 * 1024 * 1024) {
        setPostEditForm((prev) => ({
          ...prev,
          mediaURL: URL.createObjectURL(file),
          type: file?.type?.startsWith('image/') ? 'image' : 'video',
        }));
      } else {
        toast.error('file must be less than 20mb');
      }
    } else {
      toast.error('file must be a Video (MP4/MOV) or an Image (JPEG/PNG)');
    }
  };

  useEffect(() => {
    setPostEditForm((prev) => ({ ...prev, username }));
  }, [loggedInUserState]);

  return (
    <>
      <form
        onSubmit={(e) => {
          editPost(e, post._id, postEditForm);
          setPostEditForm({
            did,
            username,
            avatarURL,
            content: '',
            mediaURL: '',
            type: '',
          });
          setIsEditPostClicked(false);
          setActionMenu(false);
        }}
        className={`new-post-container ${className}`}
      >
        <div className="img-container">
          <img
            src={loggedInUserState?.avatarURL}
            alt={loggedInUserState?.firstName}
          />
        </div>
        <div className="input-container">
          <div className="text-content-container">
            <textarea
              onChange={(e) =>
                setPostEditForm((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              value={postEditForm.content}
              placeholder="What is happening?!"
            />
            {setIsEditPostClicked && (
              <IoMdClose
                onClick={() => {
                  setIsEditPostClicked && setIsEditPostClicked(false);
                }}
                className="close-create-post-modal"
              />
            )}
          </div>
          {postEditForm?.mediaURL && postEditForm?.type !== 'image' && (
            <div className="media-container">
              <video muted loop>
                <source src={postEditForm?.mediaURL} />
              </video>
              <IoMdClose
                onClick={() => {
                  setPostEditForm({ ...postEditForm, mediaURL: '' });
                }}
                className="close-media"
              />
            </div>
          )}
          {postEditForm?.mediaURL && postEditForm.type === 'image' && (
            <div className="media-container">
              <img src={postEditForm?.mediaURL} alt="" />
              <IoMdClose
                onClick={() => {
                  setPostEditForm({ ...postEditForm, mediaURL: '' });
                }}
                className="close-media"
              />
            </div>
          )}
          <div className="input-btn-container">
            <div className="toolbar-container">
              <label htmlFor="media">
                <ImFilePicture className="file-icon" />
              </label>
              <input onChange={handleEditMediaInput} type="file" id="media" />

              <BsEmojiSmile
                className="smily-emoji"
                onClick={() => setShowEmojiModal(true)}
              />
            </div>
            <div className="post-btn-container">
              <input
                disabled={!postEditForm.content && !postEditForm.mediaURL}
                type="submit"
                value="Update"
              />
            </div>
          </div>
        </div>
      </form>

      <EmojiModal
        showEmojiModal={showEmojiModal}
        setShowEmojiModal={setShowEmojiModal}
        setPostForm={setPostEditForm}
      />
    </>
  );
};
