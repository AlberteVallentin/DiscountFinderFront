import { Outlet } from 'react-router';
import GlobalStyle from '../styles/GlobalStyle';
import styled from 'styled-components';
import TopMenu from '../components/TopMenu';
import { useTheme } from '../context/ThemeContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: var(--small-device);
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

function MainLayout() {
  const { theme } = useTheme();

  return (
    <>
      <GlobalStyle theme={theme} />
      <Container theme={theme}>
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
    </>
  );
}

export default MainLayout;
