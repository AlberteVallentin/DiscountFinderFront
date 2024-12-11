import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 20px;
  padding: 3rem;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  width: 100%;
  max-width: 800px;
`;

export default Card;
