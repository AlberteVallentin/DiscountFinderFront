import React from 'react';
import styled from 'styled-components';
import EmptyState from '../components/EmptyState';
import OutletContainer from '../components/layout/OutletContainer';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const DemoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DemoTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-m);
  margin-bottom: 1rem;
`;

const EmptyStateDemo = () => {
  return (
    <OutletContainer>
      <DemoTitle>Empty State Demonstrations</DemoTitle>
      <DemoContainer>
        <DemoSection>
          <h3>Standard Empty State - No Products</h3>
          <EmptyState type='NO_PRODUCTS' />
        </DemoSection>

        <DemoSection>
          <h3>Empty State - No Favorites</h3>
          <EmptyState type='NO_FAVORITES' />
        </DemoSection>

        <DemoSection>
          <h3>Empty State - No Search Results</h3>
          <EmptyState type='NO_SEARCH_RESULTS' />
        </DemoSection>

        <DemoSection>
          <h3>Empty State - Custom Message</h3>
          <EmptyState
            type='NO_PRODUCTS'
            customTitle='Min egen titel'
            customMessage='Her er min egen besked som jeg gerne vil vise i empty state.'
          />
        </DemoSection>
      </DemoContainer>
    </OutletContainer>
  );
};

export default EmptyStateDemo;
