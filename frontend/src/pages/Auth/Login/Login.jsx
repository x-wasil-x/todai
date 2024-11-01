import './Login.css';
import { Link } from 'react-router-dom';
import { Fade } from 'react-awesome-reveal';
import { useAuth } from '../../../contexts/AuthProvider';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { useSessionContext } from '../../../libs/session';
import ConnectButton from '@arcblock/did-connect/lib/Button';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

export default function Login() {
  const { handleLogin, authError } = useAuth();
  const { locale, t } = useLocaleContext();
  const { connectApi } = useSessionContext();

  const requestProfile = () => {
    const action = 'request-profile';
    connectApi.open({
      locale,
      action,
      onSuccess(res) {
        handleLogin(res.result.did);
      },
      onError(e) {
        console.log(e);
        toast.error('Please register to login.');
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
        <title>Login | Tōdai</title>
      </Helmet>

      <section className="login-form-container">
        <h1 className="login-form-heading">Welcome to Quack!</h1>

        <h3 className="login-heading">Login </h3>

        {authError && <div className="error-message">{authError}</div>}

        <div className="btn-container">
          <Fade duration={150} cascade>
            <ConnectButton onClick={requestProfile} />
          </Fade>
        </div>

        <p className="switch-to-signup">
          Dont have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </section>
    </main>
  );
}
