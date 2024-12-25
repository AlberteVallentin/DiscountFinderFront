import { Outlet } from 'react-router';
import GlobalStyle from '../styles/GlobalStyle';
import styled, { ThemeProvider } from 'styled-components';
import TopMenu from '../components/layout/menu/TopMenu';
import { useTheme } from '../context/ThemeContext';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

function MainLayout() {
  const { theme } = useTheme();
  const { toast, showToast } = useToast();

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
        {(toast.visible || toast.message) && (
          <Toast
            visible={toast.visible}
            message={toast.message}
            type={toast.type}
            onClose={() => {}}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default MainLayout;
