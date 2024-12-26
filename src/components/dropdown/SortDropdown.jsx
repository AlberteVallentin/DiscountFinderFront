import React from 'react';
import BaseDropdown, { DropdownOption } from './Dropdown';
import Icon from '../ui/Icon';

const SortDropdown = ({
  options,
  selectedOption,
  onSelect,
  buttonText = 'Sorter',
  align = 'left',
  icon = 'ArrowDownUp',
}) => {
  const handleSelect = (optionValue) => {
    if (selectedOption === optionValue) {
      onSelect(null);
    } else {
      onSelect(optionValue);
    }
  };

  const renderOptions = (closeDropdown) => (
    <>
      {options.map((option) => (
        <DropdownOption
          key={option.value}
          onClick={() => {
            handleSelect(option.value);
            closeDropdown();
          }}
        >
          {option.label}
          {selectedOption === option.value && <Icon name='Check' />}
        </DropdownOption>
      ))}
    </>
  );

  return (
    <BaseDropdown
      buttonText={buttonText}
      icon={icon}
      isActive={selectedOption !== null}
      align={align}
      renderOptions={renderOptions}
    />
  );
};

export default SortDropdown;
