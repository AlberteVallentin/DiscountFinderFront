import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import styled from 'styled-components';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import facade from '../util/apiFacade';
import Toast from '../components/Toast';

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

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e11d48;
  font-size: 0.9rem;
  padding: 0.75rem;
  background: #fef2f2;
  border-radius: 8px;
  opacity: ${({ $visible }) => ($visible ? '1' : '0')};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease;
  width: 100%;
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
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await facade.login(formData.email, formData.password);
      if (response.token) {
        const decodedToken = facade.decodeToken(response.token);
        login(response.token, {
          role: decodedToken.role,
          email: decodedToken.email,
          name: decodedToken.name,
        });
        showToast('Du er nu logget ind');

        // Navigate to return path if it exists, otherwise go to stores
        const returnPath = location.state?.returnPath || '/stores';
        setTimeout(() => {
          navigate(returnPath);
        }, 1500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Forkert email eller password. Prøv igen.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords matcher ikke');
      return;
    }

    try {
      const registerResponse = await facade.fetchData('/auth/register', true, {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          roleType: 'USER',
        }),
      });

      if (registerResponse.token) {
        showToast('Registrering gennemført! Logger ind...');

        const decodedToken = facade.decodeToken(registerResponse.token);
        login(registerResponse.token, {
          role: decodedToken.role,
          email: decodedToken.email,
          name: decodedToken.name,
        });

        const returnPath = location.state?.returnPath || '/stores';
        setTimeout(() => {
          navigate(returnPath);
        }, 1500);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registrering fejlede. Prøv igen.');
    }
  };

  const handleChange = (e) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMode = (mode) => {
    setIsLoginMode(mode === 'login');
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <LoginContainer>
      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

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

          {error && (
            <ErrorMessage $visible={!!error}>
              <AlertCircle size={16} />
              {error}
            </ErrorMessage>
          )}
        </Form>
      </FormCard>
    </LoginContainer>
  );
};

export default LoginPage;
