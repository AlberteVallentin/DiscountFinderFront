// BaseCard.jsx
import styled from 'styled-components';

const BaseCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;

  &:hover {
    ${({ interactive }) =>
      interactive &&
      `
      transform: translateY(-4px);
      box-shadow: ${({ theme }) => theme.colors.boxShadow};
    `}
  }
`;

export default BaseCard;
