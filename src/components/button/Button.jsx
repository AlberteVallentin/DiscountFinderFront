import React from 'react';
import styled from 'styled-components';
import { borderRadius, borders } from '../../styles/Theme';

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  padding: 1rem 0rem;
  width: 11rem;
  font-size: var(--fs-n);
  border-radius: ${borderRadius.round};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.buttonColor};
  color: ${({ theme }) => theme.colors.buttonText};

  border: none;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Button = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
