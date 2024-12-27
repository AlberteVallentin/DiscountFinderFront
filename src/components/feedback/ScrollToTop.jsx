import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Icon from '../ui/Icon';
import { borderRadius } from '../../styles/Theme';

const ScrollButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.75rem;
  border-radius: ${borderRadius.round};
  background-color: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  cursor: pointer;
  transition: all 0.3s ease;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  z-index: 10;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.8;
  }
`;

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <ScrollButton
      onClick={scrollToTop}
      $visible={visible}
      aria-label='Scroll to top'
      aria-hidden={!visible}
    >
      <Icon name='ChevronUp' size='m' />
    </ScrollButton>
  );
};

export default ScrollToTop;
