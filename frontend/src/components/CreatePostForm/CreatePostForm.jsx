import './CreatePostForm.css';
import React, { useState, useEffect } from 'react';
import { IoMdClose, VscSmiley, ImFilePicture } from '../../utils/icons';
import { useLoggedInUser } from '../../contexts/LoggedInUserProvider';
import { usePosts } from '../../contexts/PostsProvider';
import { EmojiModal } from '../EmojiModal/EmojiModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
const ACCESS_TOKEN = import.meta.env.VITE_DBRO_TOKEN;
const headers = {
  headers: {
    'content-type': 'multipart/form-data',
    authorization: `Bearer ${ACCESS_TOKEN}`,
  },
};

export const CreatePostForm = ({ setIsCreateNewPostClicked, className }) => {
  const { createPost } = usePosts();
  const { loggedInUserState } = useLoggedInUser();
  const navigate = useNavigate();
  const username = loggedInUserState?.username;
  const avatarURL = loggedInUserState?.avatarURL;
  const did = loggedInUserState?.did;
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [postForm, setPostForm] = useState({
    did,
    username,
    avatarURL,
    content: '',
    mediaURL: '',
    type: '',
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    toast('Media uploading.');

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error('File must be less than 20mb.');
    }

    if (!file.type.includes('image') && !file.type.includes('video')) {
      toast.error('File must be Image (JPEG/PNG/WEBP) or Video (MOV/MPEG4).');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('description', did);
      formData.append('fileType', file.type);
      formData.append('fileSize', file.size);

      const hash = (
        await axios.post(
          `https://api.decentralbros.tech/v1/upload`,
          formData,
          headers,
        )
      ).data;

      const upload = `https://gateway.decentralbros.tech/ipfs/${hash}`;
      setPostForm({ ...postForm, type: file.type, mediaURL: upload });
      toast.success('Post media uploaded.');
    } catch (err) {
      setPostForm({
        ...postForm,
        type: '',
        mediaURL: '',
      });
      console.log(err);
      toast.error('Media upload error.');
    }
  };

  useEffect(() => {
    setPostForm((prev) => ({ ...prev, username }));
  }, [loggedInUserState]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost(e, postForm);
          setPostForm({
            did,
            username,
            avatarURL,
            content: '',
            type: '',
            mediaURL: '',
          });
          setIsCreateNewPostClicked && setIsCreateNewPostClicked(false);
        }}
        className={`new-post-container ${className}`}
      >
        <div
          onClick={() => navigate(`/profile/${did}`)}
          className="img-container"
        >
          <img src={loggedInUserState?.avatarURL} alt={username} />
        </div>

        <div className="input-container">
          <div className="text-content-container">
            <textarea
              onChange={(e) =>
                setPostForm((prev) => ({ ...prev, content: e.target.value }))
              }
              value={postForm.content}
              placeholder="What is happening?!"
            />
            {setIsCreateNewPostClicked && (
              <IoMdClose
                onClick={() => {
                  setIsCreateNewPostClicked && setIsCreateNewPostClicked(false);
                }}
                className="close-create-post-modal"
              />
            )}
          </div>

          {postForm?.mediaURL && postForm.type.includes('video') && (
            <div className="media-container">
              <video muted loop controls>
                <source src={postForm?.mediaURL} />
              </video>
              <IoMdClose
                onClick={() => {
                  setPostForm({ ...postForm, mediaURL: '' });
                }}
                className="close-media"
              />
            </div>
          )}

          {postForm?.mediaURL && postForm.type.includes('image') && (
            <div className="media-container">
              <img src={postForm?.mediaURL} alt="" />
              <IoMdClose
                onClick={() => {
                  setPostForm({ ...postForm, mediaURL: '' });
                }}
                className="close-media"
              />
            </div>
          )}

          <div className="input-btn-container">
            <div className="toolbar-container">
              <label htmlFor="mediaForCreate">
                <ImFilePicture className="file-icon" />
              </label>
              <input
                onChange={handleUpload}
                type="file"
                accept="image/*,video/*"
                id="mediaForCreate"
              />

              <VscSmiley
                className="smily-emoji"
                onClick={() => setShowEmojiModal(true)}
              />
            </div>
            <div className="post-btn-container">
              <button
                disabled={!postForm.content && !postForm.mediaURL}
                type="submit"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </form>
      <EmojiModal
        showEmojiModal={showEmojiModal}
        setShowEmojiModal={setShowEmojiModal}
        setPostForm={setPostForm}
      />
    </>
  );
};
