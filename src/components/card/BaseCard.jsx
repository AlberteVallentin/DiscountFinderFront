import styled, { css } from 'styled-components';
import { borderRadius, borders } from '../../styles/Theme';

const BaseCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${borderRadius.rounded};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  border: ${({ theme }) => `${borders.thin} ${theme.colors.border}`};
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;

  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:hover {
    ${({ $clickable }) =>
      $clickable &&
      css`
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.colors.boxShadow};
      `}
  }
`;

export default BaseCard;
