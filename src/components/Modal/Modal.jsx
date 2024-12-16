import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

const StyledDialog = styled.dialog`
  padding: 0;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  max-width: ${({ $maxWidth }) => $maxWidth || '600px'};
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;

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

const ModalContent = styled.div`
  padding: 2rem;
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
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.text};
    outline-offset: 2px;
  }
`;

const Modal = ({
  isOpen,
  onClose,
  children,
  maxWidth,
  title,
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

  return (
    <StyledDialog ref={dialogRef} $maxWidth={maxWidth}>
      <CloseButton onClick={onClose}>
        <X size={24} />
      </CloseButton>
      <ModalContent>
        {title && <h2>{title}</h2>}
        {children}
      </ModalContent>
    </StyledDialog>
  );
};

export default Modal;
