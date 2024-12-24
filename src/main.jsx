import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './pages/Home.jsx';
import Favorites from './pages/Favorites.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router';
import Stores from './pages/Stores.jsx';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound.jsx';
import EmptyStateDemo from './pages/EmptyStateDemo.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />} errorElement={<ErrorBoundary />}>
      <Route index element={<Home />} />
      <Route path='stores' element={<Stores />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='favorites' element={<Favorites />} />
      <Route path='empty-state-demo' element={<EmptyStateDemo />} />
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
