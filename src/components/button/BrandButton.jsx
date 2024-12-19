import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import { borderRadius } from '../../styles/Theme';

const StyledBrandButton = styled(Button)`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.buttonColor : theme.colors.card};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.card : theme.colors.text};
  border-radius: ${borderRadius.round};
  border: ${({ $active, theme }) =>
    $active ? 'none' : `2px solid ${theme.colors.text}`};
`;

const BrandButton = ({ children, active = false, ...props }) => {
  return (
    <StyledBrandButton $active={active} {...props}>
      {children}
    </StyledBrandButton>
  );
};

export default BrandButton;
