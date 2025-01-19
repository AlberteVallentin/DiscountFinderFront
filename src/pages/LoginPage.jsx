import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useOutletContext } from 'react-router';
import { useFavorites } from '../context/FavoritesContext';
import OutletContainer from '../components/layout/container/OutletContainer';
import { borderRadius, borders } from '../styles/Theme';

const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 2rem;
  border-radius: ${borderRadius.rounded};
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: ${({ theme }) => `${borders.thin} ${theme.colors.border}`};
  border-radius: ${borderRadius.rounded};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.text};
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.buttonColor};
  color: ${({ theme }) => theme.colors.buttonText};
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${borderRadius.round};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  padding: 1rem;
  cursor: pointer;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text : theme.colors.border};
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.text : 'transparent')};
  transition: all 0.3s ease;
`;

// ============= Component =============
/**
 * LoginPage component handling both login and registration
 * @returns {JSX.Element} Login/Register form
 */
const LoginPage = () => {
  // ============= Hooks =============
  const { login, register } = useAuth();
  const { loadFavorites } = useFavorites();
  const { showToast } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  // ============= State =============
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // ============= Event Handlers =============
  /**
   * Handles form submission for both login and register
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate password match for registration
      if (!isLoginMode && formData.password !== formData.confirmPassword) {
        showToast('Passwords matcher ikke', 'error');
        return;
      }

      // Attempt login or registration
      const result = isLoginMode
        ? await login(formData.email, formData.password)
        : await register(formData.name, formData.email, formData.password);

      if (result.success) {
        // Load user data and redirect
        if (isLoginMode) await loadFavorites();
        showToast(
          `Du er nu ${isLoginMode ? 'logget ind' : 'registreret'}!`,
          'success'
        );

        const returnPath = location.state?.returnPath || '/stores';
        setTimeout(() => navigate(returnPath), 1500);
      } else {
        showToast(result.error || 'Der opstod en fejl', 'error');
      }
    } catch (error) {
      showToast('Der opstod en uventet fejl', 'error');
    }
  };

  /**
   * Updates form data state on input change
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ============= Render =============
  return (
    <OutletContainer>
      <FormCard>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <ToggleButton
            onClick={() => setIsLoginMode(true)}
            $active={isLoginMode}
            type='button'
          >
            Login
          </ToggleButton>
          <ToggleButton
            onClick={() => setIsLoginMode(false)}
            $active={!isLoginMode}
            type='button'
          >
            Opret bruger
          </ToggleButton>
        </div>

        <Form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <FormGroup>
              <Input
                type='text'
                placeholder='Navn'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required={!isLoginMode}
              />
            </FormGroup>
          )}
          <FormGroup>
            <Input
              type='email'
              placeholder='Email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Input
              type='password'
              placeholder='Password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          {!isLoginMode && (
            <FormGroup>
              <Input
                type='password'
                placeholder='Gentag Password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLoginMode}
              />
            </FormGroup>
          )}
          <Button type='submit'>
            {isLoginMode ? 'Log ind' : 'Opret bruger'}
          </Button>
        </Form>
      </FormCard>
    </OutletContainer>
  );
};

export default LoginPage;
