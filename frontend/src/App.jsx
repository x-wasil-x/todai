import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout/Layout';
import { NavRoutes } from './Routes/NavRoutes';
import { AuthProvider } from './contexts/AuthProvider';
import { PostsProvider } from './contexts/PostsProvider';
import { UserProvider } from './contexts/UserProvider';
import { LoggedInUserProvider } from './contexts/LoggedInUserProvider';
import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import { ThemeProvider } from '@arcblock/ux/lib/Theme';
import { SessionProvider } from './libs/session';
import { HelmetProvider } from 'react-helmet-async';
import { translations } from './locales';
import './App.css';

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider translations={translations}>
        <ThemeProvider>
          <SessionProvider>
            <HelmetProvider>
              <Router>
                <UserProvider>
                  <LoggedInUserProvider>
                    <AuthProvider>
                      <PostsProvider>
                        <Layout>
                          <NavRoutes />
                        </Layout>
                      </PostsProvider>
                    </AuthProvider>
                  </LoggedInUserProvider>
                </UserProvider>
              </Router>
            </HelmetProvider>
          </SessionProvider>
        </ThemeProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}
