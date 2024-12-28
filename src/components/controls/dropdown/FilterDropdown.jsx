import React from 'react';
import styled from 'styled-components';
import Dropdown, { DropdownOption } from './Dropdown';
import { borderRadius } from '../../../styles/Theme';
import Icon from '../../ui/Icon';

const SelectedCount = styled.span`
  background: ${({ theme }) => theme.colors.buttonText};
  color: ${({ theme }) => theme.colors.buttonColor};
  padding: 0.25rem 0.75rem;
  border-radius: ${borderRadius.round};
  font-size: var(--fs-s);
  margin-left: 0.5rem;
`;

const FilterDropdown = ({
  categories,
  selectedCategories,
  onCategoryToggle,
}) => {
  const selectedCount = selectedCategories.size;

  const renderOptions = () => (
    <>
      {categories.map((category) => (
        <DropdownOption
          key={category}
          onClick={() => {
            onCategoryToggle(category);
          }}
        >
          {category}
          {selectedCategories.has(category) && <Icon name='Check' />}
        </DropdownOption>
      ))}
    </>
  );

  return (
    <Dropdown
      buttonText={
        <>
          Filter
          {selectedCount > 0 && <SelectedCount>{selectedCount}</SelectedCount>}
        </>
      }
      icon='SlidersHorizontal'
      renderOptions={renderOptions}
    />
  );
};

export default FilterDropdown;
