import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Search, ShoppingBag, Percent } from 'lucide-react';
import OutletContainer from '../components/layout/OutletContainer';
import BaseCard from '../components/card/BaseCard';

const Hero = styled.section`
  text-align: center;
  max-width: 800px;
  margin: 2rem auto;
`;

const Title = styled.h1`
  font-size: var(--fs-xl);
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: var(--fs-m);
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: min(90%, 1200px);
  margin: 0 auto;
`;

const FeatureCard = styled(BaseCard)`
  text-align: center;
  padding: 2rem;

  svg {
    width: 48px;
    height: 48px;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 1rem;
  }
`;

const FeatureTitle = styled.h3`
  font-size: var(--fs-m);
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  font-size: var(--fs-n);
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
`;

const CTAButton = styled.button`
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: var(--fs-m);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 2rem;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <OutletContainer>
      <Hero>
        <Title>Find de bedste tilbud i din lokale butik</Title>
        <Subtitle>
          Reducer madspild og spar penge ved at finde nedsatte varer i Netto,
          Føtex og Bilka. Vi hjælper dig med at finde de bedste tilbud tæt på
          dig.
        </Subtitle>
        <CTAButton onClick={() => navigate('/stores')}>
          Find tilbud nu
        </CTAButton>
      </Hero>

      <FeaturesGrid>
        <FeatureCard>
          <Search />
          <FeatureTitle>Find lokale tilbud</FeatureTitle>
          <FeatureDescription>
            Søg efter butikker i dit område og se alle deres aktuelle tilbud på
            ét sted.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <Percent />
          <FeatureTitle>Store besparelser</FeatureTitle>
          <FeatureDescription>
            Find varer med op til 50% rabat og få mest muligt for dine penge.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <ShoppingBag />
          <FeatureTitle>Reducer madspild</FeatureTitle>
          <FeatureDescription>
            Hjælp med at reducere madspild ved at købe varer, der snart udløber,
            til en nedsat pris.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
    </OutletContainer>
  );
};

export default Home;
