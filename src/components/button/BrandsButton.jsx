import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import { borderRadius, borders } from '../../styles/Theme';

const BrandButton = styled(Button)`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.buttonColor : theme.colors.card};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.card : theme.colors.text};
  border-radius: ${borderRadius.round};
  border: ${({ $active, theme }) =>
    $active ? 'none' : `2px solid ${theme.colors.text}`};
`;

const BrandsButton = ({ children, active = false, ...props }) => {
  return (
    <BrandButton $active={active} {...props}>
      {children}
    </BrandButton>
  );
};

export default BrandsButton;
