import React from 'react';
import styled from 'styled-components';
import Icon from './Icon';
import { borderRadius, borders } from '../../styles/Theme';

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.searchBar.color};
  border-radius: ${borderRadius.round};
  padding: 0.5rem 1rem;
  flex: 1;
  min-width: 200px;
  border: ${({ theme }) => `${borders.thin} ${theme.colors.border}`};
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  padding: 0.5rem;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.searchBar.text};
    opacity: 0.8;
  }
`;

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <SearchBarContainer>
      <Icon name='Search' color='searchBarIcon' />
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
