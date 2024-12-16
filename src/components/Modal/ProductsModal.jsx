import React from 'react';
import styled from 'styled-components';
import BaseModal from './BaseModal';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StoreName = styled.h2`
  font-size: var(--fs-l);
  color: ${({ theme }) => theme.colors.text};
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FilterPanel = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 1rem;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 200px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  padding: 0.5rem;
  margin-top: 0.5rem;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const ProductsModal = ({
  store,
  children,
  onClose,
  filterContent,
  sortContent,
  isFilterOpen,
  isSortOpen,
}) => {
  return (
    <BaseModal onClose={onClose}>
      <Content>
        <Header>
          <StoreName>{store.name}</StoreName>
          <Controls>{children}</Controls>
        </Header>

        <FilterPanel $isOpen={isFilterOpen}>{filterContent}</FilterPanel>

        {sortContent && (
          <Dropdown>
            <DropdownContent $isOpen={isSortOpen}>
              {sortContent}
            </DropdownContent>
          </Dropdown>
        )}
      </Content>
    </BaseModal>
  );
};

export default ProductsModal;
