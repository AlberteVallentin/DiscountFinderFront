import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import styled from 'styled-components';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { useErrorHandler } from '../utils/errorHandler';
import { useToast } from '../hooks/useToast';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
  gap: 2rem;
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.colors.boxShadow};
  width: 100%;
  max-width: 400px;
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

const Label = styled.label`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.text};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  cursor: pointer;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text : theme.colors.border};
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.text : 'transparent')};
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { toast, showToast, hideToast } = useToast();
  const handleError = useErrorHandler(showToast);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await handleError(
        login(formData.email, formData.password)
      );
      if (result.success) {
        // Vi tjekker om login var succesfuld
        showToast('Du er nu logget ind', 'success');

        // Navigate til return path hvis det findes, ellers til stores
        const returnPath = location.state?.returnPath || '/stores';
        setTimeout(() => {
          navigate(returnPath);
        }, 1500);
      } else {
        // Hvis login ikke var succesfuld, vis fejlbesked
        showToast(
          result.error || 'Login fejlede - tjek email og password',
          'error'
        );
      }
    } catch (error) {
      // Error håndteres automatisk via handleError
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords matcher ikke', 'error');
      return;
    }

    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password
      );
      console.log('Register result:', result); // Debug log

      if (result.success) {
        showToast('Registrering gennemført! Logger ind...', 'success');
        const returnPath = location.state?.returnPath || '/stores';
        setTimeout(() => {
          navigate(returnPath);
        }, 1500);
      } else {
        // Vis den specifikke fejlbesked
        showToast(result.error, 'error');
      }
    } catch (error) {
      console.log('Register error:', error); // Debug log
      showToast(error.message || 'Der skete en fejl ved registrering', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMode = (mode) => {
    setIsLoginMode(mode === 'login');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <LoginContainer>
      <FormCard>
        <ToggleContainer>
          <ToggleButton
            onClick={() => toggleMode('login')}
            $active={isLoginMode}
            type='button'
          >
            Login
          </ToggleButton>
          <ToggleButton
            onClick={() => toggleMode('register')}
            $active={!isLoginMode}
            type='button'
          >
            Opret bruger
          </ToggleButton>
        </ToggleContainer>

        <Form onSubmit={isLoginMode ? handleLogin : handleRegister}>
          {!isLoginMode && (
            <FormGroup>
              <Label htmlFor='name'>Navn</Label>
              <Input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required={!isLoginMode}
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor='password'>Password</Label>
            <Input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          {!isLoginMode && (
            <FormGroup>
              <Label htmlFor='confirmPassword'>Gentag Password</Label>
              <Input
                type='password'
                id='confirmPassword'
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

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </LoginContainer>
  );
};

export default LoginPage;
