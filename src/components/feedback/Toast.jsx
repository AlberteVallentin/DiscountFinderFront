import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { createPortal } from 'react-dom';

const slideInDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOutUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  right: 20px;
  top: 20px;
  background: ${({ $type }) => ($type === 'success' ? '#10B981' : '#EF4444')};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 9999;
  animation: ${({ $visible }) => ($visible ? slideInDown : slideOutUp)} 0.5s
    ease-in-out forwards;
  pointer-events: none;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Toast = ({ visible, message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!isVisible && !visible) return null;

  return createPortal(
    <ToastContainer $visible={visible} $type={type}>
      {type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
      {message}
    </ToastContainer>,
    document.body
  );
};

export default Toast;
