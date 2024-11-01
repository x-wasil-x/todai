import React from 'react';
import './Error.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Error() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Error | Tōdai</title>
      </Helmet>

      <div className="error-page-container feed">
        <h1>Error 404</h1>
        <p>The page you are searching for does not exist</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </>
  );
}
