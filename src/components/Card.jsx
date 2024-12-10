import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export default Card;
