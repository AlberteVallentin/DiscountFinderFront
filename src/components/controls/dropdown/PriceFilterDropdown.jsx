import React, { useState } from 'react';
import styled from 'styled-components';
import Dropdown, { DropdownOption } from './Dropdown';
import { borderRadius } from '../../../styles/Theme';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${borderRadius.rounded};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  width: 100px;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-s);
  min-width: 40px;
`;

const ApplyButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.buttonColor};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  border-radius: ${borderRadius.rounded};
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const PriceFilterDropdown = ({ onApply, currentRange }) => {
  const [minPrice, setMinPrice] = useState(currentRange?.min || '');
  const [maxPrice, setMaxPrice] = useState(currentRange?.max || '');

  const handleApply = (closeDropdown) => {
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;

    onApply({ min, max });
    closeDropdown();
  };

  const getButtonText = () => {
    if (!currentRange) return 'Pris';
    return `${currentRange.min || 0} - ${
      currentRange.max === Infinity ? '∞' : currentRange.max
    } kr`;
  };

  const renderOptions = (closeDropdown) => (
    <InputContainer>
      <InputGroup>
        <Label>Min:</Label>
        <Input
          type='number'
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder='0'
        />
      </InputGroup>
      <InputGroup>
        <Label>Max:</Label>
        <Input
          type='number'
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder='∞'
        />
      </InputGroup>
      <ApplyButton onClick={() => handleApply(closeDropdown)}>
        Anvend filter
      </ApplyButton>
    </InputContainer>
  );

  return (
    <Dropdown
      buttonText={getButtonText()}
      icon='CircleDollarSign'
      isActive={!!currentRange}
      renderOptions={renderOptions}
    />
  );
};

export default PriceFilterDropdown;
