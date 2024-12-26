import React, { useState } from 'react';
import styled from 'styled-components';
import { borderRadius, borders } from '../../styles/Theme';
import Button from '../button/Button';
import Icon from '../ui/Icon';

const Container = styled.div`
  position: relative;
`;

const SortStyledButton = styled(Button)`
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

const Option = styled.div`
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
  padding: 0.5rem 0;
  height: 100%;
`;

const SortLabel = styled.span`
  color: ${({ theme }) => theme.colors.buttonText};
  font-size: var(--fs-s);
  margin-left: 0.5rem;
`;

const SortDropdown = ({
  options,
  selectedOption,
  onSelect,
  buttonText = 'Sorter',
  align = 'left',
  icon = 'ArrowDownUp',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <Container>
      <SortStyledButton
        onClick={() => setIsOpen(!isOpen)}
        $active={selectedOption !== null}
      >
        <ButtonContent>
          <Icon name={icon} />
          {buttonText}
          {selectedOption && (
            <SortLabel>
              : {options.find((opt) => opt.value === selectedOption)?.label}
            </SortLabel>
          )}
        </ButtonContent>
      </SortStyledButton>

      {isOpen && (
        <>
          <Overlay onClick={() => setIsOpen(false)} />
          <DropdownContent $align={align} onClick={(e) => e.stopPropagation()}>
            {options.map((option) => (
              <Option
                key={option.value}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
                {selectedOption === option.value && <Icon name='Check' />}
              </Option>
            ))}
          </DropdownContent>
        </>
      )}
    </Container>
  );
};

export default SortDropdown;
