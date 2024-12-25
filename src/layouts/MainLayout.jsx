import { Outlet } from 'react-router';
import GlobalStyle from '../styles/GlobalStyle';
import styled, { ThemeProvider } from 'styled-components';
import TopMenu from '../components/layout/menu/TopMenu';
import { useTheme } from '../context/ThemeContext';
import Toast from '../components/Toast'; // Tilføj denne import
import { useToast } from '../hooks/useToast'; // Tilføj denne import
import { useEffect } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

function MainLayout() {
  const { theme } = useTheme();
  const { toast, showToast, hideToast } = useToast();

  // Sikrer at kun én toast vises ad gangen
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(hideToast, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, hideToast]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <header>
          <TopMenu />
        </header>
        <main>
          <Outlet context={{ showToast }} />
        </main>
        <footer></footer>
        {toast.visible && (
          <Toast
            visible={toast.visible}
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default MainLayout;
