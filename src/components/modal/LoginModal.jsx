import React from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import Button from '../button/Button';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex: 1;
`;

const LoginDescription = styled.p`
  margin-bottom: 1rem;
  max-width: 400px;
  text-align: center;
`;

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const handleLoginClick = () => {
    if (onClose) onClose();
    if (onLogin) onLogin();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth='600px' minHeight='400px'>
      <ContentWrapper>
        <h2>Log ind for at se tilbud</h2>
        <LoginDescription>
          Du skal være logget ind for at se tilbuddene i denne butik.
        </LoginDescription>
        <Button onClick={handleLoginClick}>Log ind</Button>
      </ContentWrapper>
    </Modal>
  );
};

export default LoginModal;
