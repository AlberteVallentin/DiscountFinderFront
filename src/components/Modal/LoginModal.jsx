import React from 'react';
import styled from 'styled-components';
import Modal from './Modal';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
`;

const LoginTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-l);
  margin-bottom: 1.5rem;
`;

const LoginDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-n);
  margin-bottom: 2rem;
  max-width: 400px;
  line-height: 1.6;
`;

const LoginButton = styled.button`
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.card};
  border: none;
  border-radius: 8px;
  padding: 1rem 3rem;
  font-size: var(--fs-n);
  font-weight: var(--fw-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth='500px'
      closeOnOutsideClick={false}
    >
      <LoginContainer>
        <LoginTitle>Log ind for at se tilbud</LoginTitle>
        <LoginDescription>
          Du skal være logget ind for at se tilbuddene i denne butik.
        </LoginDescription>
        <LoginButton onClick={onLogin}>Log ind</LoginButton>
      </LoginContainer>
    </Modal>
  );
};
