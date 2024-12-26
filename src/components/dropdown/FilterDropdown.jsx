import React, { useState } from 'react';
import styled from 'styled-components';
import Icon from '../ui/Icon';
import { borderRadius, borders } from '../../styles/Theme';
import Button from '../button/Button';

const Container = styled.div`
  position: relative;
`;

const FilterStyledButton = styled(Button)`
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
  left: 0;
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

const CategoryOption = styled.div`
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

const SelectedCount = styled.span`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.25rem 0.75rem;
  border-radius: ${borderRadius.round};
  font-size: var(--fs-s);
  margin-left: 0.5rem;
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterDropdown = ({
  categories,
  selectedCategories,
  onCategoryToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCount = selectedCategories.size;

  return (
    <Container>
      <FilterStyledButton
        onClick={() => setIsOpen(!isOpen)}
        $active={selectedCount > 0}
      >
        <ButtonContent>
          <Icon name='SlidersHorizontal' color='buttonText' />
          Filter
          {selectedCount > 0 && <SelectedCount>{selectedCount}</SelectedCount>}
        </ButtonContent>
      </FilterStyledButton>

      {isOpen && (
        <>
          <Overlay onClick={() => setIsOpen(false)} />
          <DropdownContent onClick={(e) => e.stopPropagation()}>
            {categories.map((category) => (
              <CategoryOption
                key={category}
                onClick={() => onCategoryToggle(category)}
              >
                {category}
                {selectedCategories.has(category) && <Icon name='Check' />}
              </CategoryOption>
            ))}
          </DropdownContent>
        </>
      )}
    </Container>
  );
};

export default FilterDropdown;
