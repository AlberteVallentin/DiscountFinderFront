import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Icon from '../ui/Icon';
import { borderRadius, borders } from '../../styles/Theme';

const ModalDialog = styled.dialog`
  padding: 0;
  background: ${({ theme }) => theme.colors.background};
  border: ${({ theme }) => `${borders.thin} ${theme.colors.border}`};
  border-radius: ${borderRadius.rounded};
  max-width: ${({ $maxWidth }) => $maxWidth || '600px'};
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  &::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  &[open] {
    animation: fade-in 0.3s ease normal;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;

const ModalHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem;
`;

const ModalContent = styled.div`
  padding: 0 2rem 2rem 2rem;
  flex: 1;
`;

const CloseButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: none;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const Modal = ({
  isOpen,
  onClose,
  children,
  maxWidth,
  closeOnEscape = true,
  closeOnOutsideClick = true,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !closeOnEscape) {
        e.preventDefault();
      }
    };

    const handleClick = (e) => {
      if (closeOnOutsideClick && e.target === dialog) {
        onClose();
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);
    dialog.addEventListener('click', handleClick);

    return () => {
      dialog.removeEventListener('keydown', handleKeyDown);
      dialog.removeEventListener('click', handleClick);
    };
  }, [closeOnEscape, closeOnOutsideClick, onClose]);

  if (!isOpen) return null;

  return (
    <ModalDialog ref={dialogRef} $maxWidth={maxWidth}>
      <ModalHeader>
        <CloseButton onClick={onClose}>
          <Icon name='X' size='l' />
        </CloseButton>
      </ModalHeader>
      <ModalContent>{children}</ModalContent>
    </ModalDialog>
  );
};

export default Modal;
