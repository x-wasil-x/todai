import './EditProfileModal.css';
import { RxCross2 } from 'react-icons/rx';
import { FiCamera } from 'react-icons/fi';
import { useLoggedInUser } from '../../../../contexts/LoggedInUserProvider';
import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
const ACCESS_TOKEN = import.meta.env.VITE_DBRO_TOKEN;
const headers = {
  headers: {
    'content-type': 'multipart/form-data',
    authorization: `Bearer ${ACCESS_TOKEN}`,
  },
};

export const EditProfileModal = ({ setIsEditProfile, className }) => {
  const { loggedInUserState, editUser } = useLoggedInUser();
  const [avatarURL, setAvatarURL] = useState(loggedInUserState.avatarURL);
  const [formValues, setFormValues] = useState({
    did: loggedInUserState.did,
    username: loggedInUserState.username,
    bio: loggedInUserState?.bio,
    website: loggedInUserState?.website,
    avatarURL: loggedInUserState?.avatarURL,
  });

  const handleUpload = useCallback(
    async (e) => {
      e.preventDefault();
      toast('Media uploading.');

      const file = e.target.files[0];

      if (!file) {
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error('File must be less than 10mb.');
      }

      if (!file.type.includes('image')) {
        toast.error('File must be Image (JPEG/PNG/WEBP).');
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);
        formData.append('description', loggedInUserState.did);
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
        setFormValues({ ...formValues, avatarURL: upload });
        setAvatarURL(URL.createObjectURL(file));
        toast.success('Profile pic updated.');
      } catch (err) {
        setFormValues({ ...formValues, avatarURL: '' });
        toast.error('Image upload error.');
      }
    },
    [loggedInUserState.did, formValues, setFormValues, setAvatarURL],
  );

  useEffect(() => {
    setFormValues({
      did: loggedInUserState.did,
      username: loggedInUserState.username,
      bio: loggedInUserState?.bio,
      website: loggedInUserState?.website,
      avatarURL: loggedInUserState?.avatarURL,
    });
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        editUser(formValues);
        setIsEditProfile(false);
      }}
      className={className}
    >
      <div className="edit-profile-modal-body">
        <div className="edit-modal-header-container">
          <span>
            <RxCross2
              className="close-icon"
              onClick={() => {
                setIsEditProfile(false);
              }}
            />
          </span>
          <span className="edit-page-heading">Edit Profile</span>
          <span>
            <button className="edit-profile-btn" type="submit">
              Save
            </button>
          </span>
        </div>

        <div className="edit-profile-img-container">
          <img src={avatarURL} alt={loggedInUserState?.username} />
          <label>
            <FiCamera />
            <input
              onChange={(e) => {
                handleUpload(e);
              }}
              type="file"
              accept="image/*,video/*"
            />
          </label>
        </div>
        <div className="username-container">
          <span>@{loggedInUserState.username}</span>
        </div>
        <div className="avatars-section">
          <p>Choose a picture from your gallery.</p>
        </div>
        <div className="bio-container">
          <label htmlFor="bio">Bio:</label>
          <textarea
            onChange={(e) => {
              setFormValues({ ...formValues, bio: e.target.value });
            }}
            id="bio"
            value={formValues?.bio}
          />
        </div>
        <div className="user-website-container">
          <label htmlFor="user-website">Website:</label>
          <input
            onChange={(e) => {
              setFormValues({ ...formValues, website: e.target.value });
            }}
            type="url"
            id="user-website"
            value={formValues?.website}
          />
        </div>
      </div>
    </form>
  );
};
