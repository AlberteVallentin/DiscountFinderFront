import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import styled from 'styled-components';

const ScrollButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.75rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  pointer-events: ${({ isVisible }) => (isVisible ? 'all' : 'none')};
  z-index: 10;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.8;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
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
      isVisible={isVisible}
      aria-label='Scroll to top'
    >
      <ChevronUp />
    </ScrollButton>
  );
};

export default ScrollToTop;
