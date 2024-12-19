import React from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import Button from '../button/Button';

const LoginDescription = styled.p`
  margin-bottom: 2rem;
  margin-top: 1rem;
  max-width: 400px;
  text-align: center;
`;

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const handleLoginClick = () => {
    if (onClose) onClose();
    if (onLogin) onLogin();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth='500px'>
      <h2>Log ind for at se tilbud</h2>
      <LoginDescription>
        Du skal være logget ind for at se tilbuddene i denne butik.
      </LoginDescription>
      <Button onClick={handleLoginClick}>Log ind</Button>
    </Modal>
  );
};

export default LoginModal;
