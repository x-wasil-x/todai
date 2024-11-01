import './ShowDidModal.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

export const ShowDidModal = ({ user, setShowDid }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/profile/${user?.did}`);
        setShowDid(false);
      }}
      className="discover-user-did"
    >
      <div className="user-name-did-container">
        {user?.did && (
          <QRCode
            size={256}
            style={{
              height: 'auto',
              maxWidth: '100%',
              width: '100%',
            }}
            value={user.did}
            viewBox={`0 0 256 256`}
          />
        )}
      </div>
    </div>
  );
};
