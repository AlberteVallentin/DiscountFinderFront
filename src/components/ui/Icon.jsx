import React from 'react';
import styled from 'styled-components';
import * as LucideIcons from 'lucide-react';

const iconSizes = {
  s: 'var(--fs-s)',
  n: 'var(--fs-n)',
  m: 'var(--fs-m)',
  l: 'var(--fs-l)',
  xl: 'var(--fs-xl)',
};

const StyledIcon = styled.div`
  color: ${({ $color, theme }) => theme.colors[$color] || theme.colors.text};

  svg {
    width: ${({ $size }) => iconSizes[$size] || iconSizes.n};
    height: ${({ $size }) => iconSizes[$size] || iconSizes.n};
  }
`;

const Icon = ({ name, size = 'n', color }) => {
  const LucideIcon = LucideIcons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return (
    <StyledIcon $size={size} $color={color}>
      <LucideIcon />
    </StyledIcon>
  );
};

export default Icon;
