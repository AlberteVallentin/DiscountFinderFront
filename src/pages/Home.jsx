import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router';
import Icon from '../components/ui/Icon';
import Button from '../components/button/Button';
import OutletContainer from '../components/layout/container/OutletContainer';
import ScrollToTop from '../components/layout/navigation/ScrollToTop';
import { borderRadius } from '../styles/Theme';

const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const PageContainer = styled(OutletContainer)`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem;
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.colors.card} 0%, ${theme.colors.background} 100%)`};
  border-radius: ${borderRadius.rounded};
  margin: 0 auto 4rem auto;
  position: relative;
  max-width: 1200px;
  width: calc(100% - 2rem);
  animation: ${fadeIn} 0.8s ease-out;
`;

/**
 * Decorative accent element for hero section
 */
const HeroAccent = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  background: ${({ theme }) => theme.colors.buttonColor}10;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  ${({ $position }) => $position};
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const HeroSubtitle = styled.p`
  font-size: var(--fs-l);
  max-width: 600px;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.text}CC;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${borderRadius.rounded};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 350px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${({ theme }) =>
      `linear-gradient(90deg, ${theme.colors.buttonColor}, ${theme.colors.buttonColor}50)`};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.colors.boxShadow};

    &::before {
      opacity: 1;
    }
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.buttonColor};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${borderRadius.rounded};
`;

const FeatureTitle = styled.h3`
  font-size: var(--fs-m);
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: var(--fw-semi-bold);
`;

const FeatureDescription = styled.p`
  font-size: var(--fs-n);
  color: ${({ theme }) => theme.colors.text}CC;
  line-height: 1.6;
`;

/**
 * Call-to-action section
 */
const CTASection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 6rem 2rem;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${borderRadius.rounded};
  margin: 2rem auto 0 auto;
  position: relative;
  overflow: hidden;
  max-width: 1200px;
  width: calc(100% - 2rem);
`;

/**
 * CTA section title
 */
const CTATitle = styled.h2`
  font-size: var(--fs-xl);
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: var(--fw-bold);
`;

/**
 * CTA section description
 */
const CTADescription = styled.p`
  font-size: var(--fs-m);
  max-width: 600px;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.text}CC;
  line-height: 1.6;
`;

/**
 * Stats display bar
 */
const StatsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin: 4rem auto;
  flex-wrap: wrap;
  max-width: 1000px;
  width: calc(100% - 2rem);
`;

/**
 * Individual stat item
 */
const StatItem = styled.div`
  text-align: center;
`;

/**
 * Stat value display
 */
const StatValue = styled.div`
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: ${({ theme }) => theme.colors.buttonColor};
  margin-bottom: 0.5rem;
`;

/**
 * Stat label display
 */
const StatLabel = styled.div`
  font-size: var(--fs-n);
  color: ${({ theme }) => theme.colors.text}CC;
`;

// ============= Component Definition =============
/**
 * Home page component displaying marketing content and call-to-actions
 * Includes features, statistics, and registration prompts
 */
const Home = () => {
  // ============= Hooks =============
  const navigate = useNavigate();

  // ============= Features Configuration =============
  const features = [
    {
      icon: <Icon name='ShoppingCart' size='l' />,
      title: 'Intelligent tilbudssøgning',
      description:
        'Find præcis de tilbud du leder efter med vores smarte søgefunktion.',
    },
    {
      icon: <Icon name='Heart' size='l' />,
      title: 'Personlige favoritter',
      description:
        'Skræddersy din oplevelse ved at gemme dine foretrukne butikker.',
    },
    {
      icon: <Icon name='MapPin' size='l' />,
      title: 'Lokale tilbud',
      description:
        'Opdag de bedste tilbud i nærheden af dig med postnummer-søgning.',
    },
    {
      icon: <Icon name='Star' size='l' />,
      title: 'Prisoverblik',
      description:
        'Se øjeblikkeligt hvor meget du sparer på hvert enkelt tilbud.',
    },
  ];

  // ============= Render =============
  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroAccent $position='top: -150px; right: -150px;' />
        <HeroAccent $position='bottom: -100px; left: -100px;' />
        <HeroContent>
          <HeroTitle>Oplev en smartere måde at spare penge</HeroTitle>
          <HeroSubtitle>
            Din personlige guide til de bedste tilbud fra Netto, Føtex og Bilka.
            Få overblik, spar penge og gør dine indkøb nemmere.
          </HeroSubtitle>
          <Button onClick={() => navigate('/stores')}>
            Se tilbud&nbsp;
            <Icon name='MoveRight' size='m' color='buttonText' />
          </Button>
        </HeroContent>
      </HeroSection>

      {/* Statistics Section */}
      <StatsBar>
        <StatItem>
          <StatValue>50.000+</StatValue>
          <StatLabel>Aktive tilbud</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>681</StatValue>
          <StatLabel>Butikker</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>25%</StatValue>
          <StatLabel>Gns. besparelse</StatLabel>
        </StatItem>
      </StatsBar>

      {/* Features Section */}
      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <IconWrapper>{feature.icon}</IconWrapper>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>

      {/* Call-to-Action Section */}
      <CTASection>
        <CTATitle>Start din sparerejse i dag</CTATitle>
        <CTADescription>
          Tilmeld dig gratis og få adgang til alle funktioner. Begynd at spare
          penge på dine daglige indkøb med det samme.
        </CTADescription>
        <Button onClick={() => navigate('/login')}>
          Tilmeld dig&nbsp;
          <Icon name='MoveRight' size='m' color='buttonText' />
        </Button>
      </CTASection>

      <ScrollToTop />
    </PageContainer>
  );
};

export default Home;
