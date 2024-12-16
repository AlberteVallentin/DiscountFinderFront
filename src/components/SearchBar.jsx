import React from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: 0.5rem 1rem;
  flex: 1;
  min-width: 250px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  padding: 0.5rem;
  width: 100%;
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
  }
`;

const StyledSearchIcon = styled(Search)`
  width: ${({ size }) => size || 'var(--fs-n)'};
  height: ${({ size }) => size || 'var(--fs-n)'};
  color: ${({ theme }) => theme.colors.text};
`;

const SearchBar = ({ placeholder, value, onChange, iconSize }) => {
  return (
    <SearchBarContainer>
      <StyledSearchIcon size={iconSize} />
      <SearchInput
        type='text'
        placeholder={placeholder || 'Søg...'}
        value={value}
        onChange={onChange}
      />
    </SearchBarContainer>
  );
};

export default SearchBar;
