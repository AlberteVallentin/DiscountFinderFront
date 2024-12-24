import React from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import Button from '../button/Button';
import { useLocation } from 'react-router';

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

const LoginModal = ({
  isOpen,
  onClose,
  onLogin,
  message = 'Du skal logge ind først',
}) => {
  const location = useLocation();

  const handleLoginClick = () => {
    if (onClose) onClose();
    if (onLogin) onLogin(location.pathname);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth='600px' minHeight='400px'>
      <ContentWrapper>
        <h2>Log ind</h2>
        <LoginDescription>{message}</LoginDescription>
        <Button onClick={handleLoginClick}>Log ind</Button>
      </ContentWrapper>
    </Modal>
  );
};

export default LoginModal;
