import React from 'react';
import styled from 'styled-components';
import * as LucideIcons from 'lucide-react';

const StyledIcon = styled.div`
  color: ${({ $color, theme }) => $color || theme.colors.text};

  svg {
    width: ${({ $size }) => `var(--icon-size-${$size}, var(--icon-size-n))`};
    height: ${({ $size }) => `var(--icon-size-${$size}, var(--icon-size-n))`};
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
