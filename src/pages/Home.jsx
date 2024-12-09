import styled, { keyframes } from 'styled-components';
import Logo from '../components/Logo';
import { useTheme } from '../context/ThemeContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 2rem;
  min-height: 80vh;
  animation: ${fadeIn} 0.6s ease-out;
`;

const StyledLogo = styled(Logo)`
  margin: 0 auto;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const TextContent = styled.div`
  text-align: center;
  max-width: 800px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(
    120deg,
    ${({ theme }) => theme.colors.text},
    ${({ theme }) => theme.colors.border}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.card};
  padding: 1rem;
  border-radius: 8px;
  margin: 2rem auto;
  width: fit-content;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledLink = styled.a`
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ primary, theme }) =>
      primary ? theme.colors.primary : theme.colors.secondary};
    z-index: -1;
    transition: all 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ primary, theme }) =>
      primary ? theme.colors.secondary : theme.colors.primary};
    z-index: -1;
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    opacity: 1;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    &::after {
      opacity: 1;
    }
  }

  color: ${({ theme }) => theme.colors.background};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

function Home() {
  const { theme } = useTheme();

  return (
    <HomeContainer theme={theme}>
      <StyledLogo width='300px' height='300px' />
      <Card theme={theme}>
        <TextContent>
          <Title theme={theme}>The Discount Finder API</Title>
          <Description theme={theme}>
            Discover our powerful API for finding the best discounts across all
            Salling Group stores. Access real-time data and integrate seamlessly
            with your applications.
          </Description>
          <LinksContainer theme={theme}>
            <StyledLink
              href='https://discountfinder.albertevallentin.dk/api/routes'
              target='_blank'
              rel='noopener noreferrer'
              primary
              theme={theme}
            >
              Explore API
            </StyledLink>
            <StyledLink
              href='https://github.com/AlberteVallentin/DiscountFinderDoc'
              target='_blank'
              rel='noopener noreferrer'
              theme={theme}
            >
              View Source
            </StyledLink>
          </LinksContainer>
        </TextContent>
      </Card>
    </HomeContainer>
  );
}

export default Home;
