import React, { useState } from 'react';
import styled from 'styled-components';
import { borderRadius, borders } from '../../../styles/Theme';
import Button from '../../button/Button';
import Icon from '../../ui/Icon';

const Container = styled.div`
  position: relative;
`;

const DropdownButton = styled(Button)`
  &:hover {
    transform: none;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
`;

const DropdownContent = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  ${({ $align }) => ($align === 'right' ? 'right: 0;' : 'left: 0;')}
  background: ${({ theme }) => theme.colors.card};
  border: ${({ theme }) => `${borders.thin} ${theme.colors.border}`};
  border-radius: ${borderRadius.rounded};
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  width: 280px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

const DropdownOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: ${borderRadius.rounded};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
`;

const Dropdown = ({
  buttonText,
  icon,
  isActive,
  align = 'left',
  renderButton,
  renderOptions,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container>
      {renderButton ? (
        renderButton(() => setIsOpen(!isOpen))
      ) : (
        <DropdownButton onClick={() => setIsOpen(!isOpen)} $active={isActive}>
          <ButtonContent>
            {icon && <Icon name={icon} color='buttonText' />}
            {buttonText}
          </ButtonContent>
        </DropdownButton>
      )}

      {isOpen && (
        <>
          <Overlay onClick={() => setIsOpen(false)} />
          <DropdownContent $align={align} onClick={(e) => e.stopPropagation()}>
            {renderOptions ? renderOptions(() => setIsOpen(false)) : children}
          </DropdownContent>
        </>
      )}
    </Container>
  );
};

export { DropdownButton, DropdownOption, ButtonContent, DropdownContent };
export default Dropdown;
