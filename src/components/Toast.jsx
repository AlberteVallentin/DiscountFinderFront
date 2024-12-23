import React, { useEffect } from 'react';
import styled from 'styled-components';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { createPortal } from 'react-dom';

const ToastContainer = styled.div`
  position: fixed;
  top: ${({ $visible }) => ($visible ? '20px' : '-100px')};
  right: 20px;
  background: ${({ $type }) => ($type === 'success' ? '#10B981' : '#EF4444')};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: top 0.3s ease;
  z-index: 9999; // Øger z-index for at sikre den er øverst

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Toast = ({ visible, message, type = 'success', onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 3000); // Fast 5 sekunders duration

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return createPortal(
    <ToastContainer $visible={visible} $type={type}>
      {type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
      {message}
    </ToastContainer>,
    document.body
  );
};

export default Toast;
