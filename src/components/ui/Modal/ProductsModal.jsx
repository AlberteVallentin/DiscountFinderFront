import React from 'react';
import styled from 'styled-components';
import BaseModal from './BaseModal';

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterPanel = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 1rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ProductsModal = ({
  isOpen,
  onClose,
  title,
  children,
  filterContent,
  isFilterOpen,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth='1200px'
    >
      <Content>
        <Controls>{children}</Controls>
        {isFilterOpen && <FilterPanel>{filterContent}</FilterPanel>}
      </Content>
    </BaseModal>
  );
};

export default ProductsModal;
