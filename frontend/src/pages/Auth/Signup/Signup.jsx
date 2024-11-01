import './Signup.css';
import React from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthProvider';
import { Fade } from 'react-awesome-reveal';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { useSessionContext } from '../../../libs/session';
import ConnectButton from '@arcblock/did-connect/lib/Button';
import { Helmet } from 'react-helmet-async';

export default function Signup() {
  const { handleSignup, authError } = useAuth();
  const { locale, t } = useLocaleContext();
  const { connectApi } = useSessionContext();

  const requestProfile = () => {
    const action = 'request-profile';
    connectApi.open({
      locale,
      action,
      onSuccess(res) {
        handleSignup(res.result.fullName, res.result.did);
      },
      onError(e) {
        console.log(e);
      },
      messages: {
        title: t('claims.requestProfile.connect.title'),
        scan: t('claims.requestProfile.connect.scan'),
      },
    });
  };

  return (
    <main className="login-bg">
      <Helmet>
        <title>Sign Up | Tōdai</title>
      </Helmet>

      <section className="login-form-container">
        <h3 className="login-heading">Sign Up</h3>

        {authError && <div className="error-message">{authError}</div>}

        <div className="btn-container">
          <Fade duration={150} cascade>
            <ConnectButton onClick={requestProfile} />
          </Fade>
        </div>

        <p className="switch-to-signup">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </section>
    </main>
  );
}
