import './Header.css';
import React from 'react';
import { LuBird } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { AttentionSeeker } from 'react-awesome-reveal';

export const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <AttentionSeeker effect="swing">
        <img
          src="https://assets.coingecko.com/coins/images/2341/standard/arcblock.png"
          onClick={() => navigate('/')}
          className="header-logo"
        />
      </AttentionSeeker>

      <p onClick={() => navigate('/')}>Tōdai</p>
    </div>
  );
};
