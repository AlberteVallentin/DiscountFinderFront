import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router';
import Icon from '../../ui/Icon';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router';

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.overlay};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 90;
`;

const SideMenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${({ $isOpen }) => ($isOpen ? '0' : '-300px')};
  width: 300px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.card};
  padding: 6rem 1rem 1rem;
  transition: left 0.4s ease;
  z-index: 95;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
`;

const StyledMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin: 1rem 0;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: var(--fs-m);
  font-weight: var(--fw-medium);
  padding-left: 1rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &:hover {
    opacity: 0.8;
  }
`;

const SideMenu = ({ isOpen, onClose }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <>
      <MenuOverlay $isOpen={isOpen} onClick={onClose} />
      <SideMenuContainer $isOpen={isOpen}>
        <StyledMenu>
          <MenuItem>
            <StyledNavLink to='/' onClick={onClose}>
              <Icon name='Home' />
              Forside
            </StyledNavLink>
          </MenuItem>
          <MenuItem>
            <StyledNavLink to='/stores' onClick={onClose}>
              <Icon name='Search' />
              Find butikker
            </StyledNavLink>
          </MenuItem>
          <MenuItem>
            <StyledNavLink to='/favorites' onClick={onClose}>
              <Icon name='Heart' />
              Mine favoritter
            </StyledNavLink>
          </MenuItem>
          <MenuItem>
            {isAuthenticated ? (
              <StyledNavLink to='/' onClick={handleLogout}>
                <Icon name='User' />
                Log ud
              </StyledNavLink>
            ) : (
              <StyledNavLink to='/login' onClick={onClose}>
                <Icon name='User' />
                Login / Opret
              </StyledNavLink>
            )}
          </MenuItem>
        </StyledMenu>
      </SideMenuContainer>
    </>
  );
};

export default SideMenu;
