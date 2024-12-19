import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const BrandButton = styled(Button)`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.text : theme.colors.card};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.card : theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.text};
  border-radius: 2rem;
  padding: 0.75rem 2rem;
`;

const BrandsButton = ({ children, active = false, ...props }) => {
  return (
    <BrandButton $active={active} {...props}>
      {children}
    </BrandButton>
  );
};

export default BrandsButton;
