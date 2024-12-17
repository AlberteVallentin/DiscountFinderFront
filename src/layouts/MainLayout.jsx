import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import GlobalStyle from '../styles/GlobalStyle';
import styled, { ThemeProvider } from 'styled-components';
import TopMenu from '../components/TopMenu';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import facade from '../util/apiFacade';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

function MainLayout() {
  const { theme } = useTheme();
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check token on mount and page reload
    const token = facade.getToken();
    if (token) {
      try {
        const decodedToken = facade.decodeToken(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken && decodedToken.exp > currentTime) {
          // Token er stadig gyldig
          login(token, {
            role: decodedToken.role,
            email: decodedToken.email,
            name: decodedToken.name,
          });
        } else {
          // Token er udløbet
          facade.logout();
          logout();
          navigate('/login');
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        facade.logout();
        logout();
        navigate('/login');
      }
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <header>
          <TopMenu />
        </header>
        <main>
          <Outlet context={{ isAuthenticated }} />
        </main>
        <footer></footer>
      </Container>
    </ThemeProvider>
  );
}

export default MainLayout;
