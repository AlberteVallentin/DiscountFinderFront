import { Outlet } from 'react-router';
import GlobalStyle from '../styles/GlobalStyle';
import styled, { ThemeProvider } from 'styled-components';
import TopMenu from '../components/TopMenu';
import { useTheme } from '../context/ThemeContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

function MainLayout() {
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <header>
          <TopMenu />
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
          <p>&copy; Jon Bertelsen</p>
          <p>Todo system v. 0.9</p>
        </footer>
      </Container>
    </ThemeProvider>
  );
}

export default MainLayout;
