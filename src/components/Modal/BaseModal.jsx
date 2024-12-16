import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || '600px'};
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-l);
  margin-bottom: 1.5rem;
`;

const BaseModal = ({ isOpen, onClose, children, title, maxWidth }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} $maxWidth={maxWidth}>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>
        {title && <ModalTitle>{title}</ModalTitle>}
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default BaseModal;
