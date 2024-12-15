import styled from 'styled-components';

const BaseCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.hoverBoxShadow};
  }
`;

export default BaseCard;
