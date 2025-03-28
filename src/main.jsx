// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router';

// Page components
import Home from './pages/Home.jsx';
import Favorites from './pages/Favorites.jsx';
import Stores from './pages/Stores.jsx';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound.jsx';
import ErrorTest from './pages/ErrorTest.jsx';

// Layout og error components
import MainLayout from './components/layout/MainLayout.jsx';
import ErrorBoundary from './components/error/ErrorBoundary.jsx';
import ProtectedRoute from './components/route/ProtectedRoute';

// Context providers
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />} errorElement={<ErrorBoundary />}>
      {/* Public routes */}
      <Route index element={<Home />} />
      <Route path='stores' element={<Stores />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='error' element={<ErrorTest />} />

      {/* Protected routes */}
      <Route
        path='favorites'
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route for 404 */}
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

// ============= Application Entry =============
/**
 * Main application entry point
 * Sets up the application with all required providers and router
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Authentication provider wraps entire app */}
    <AuthProvider>
      {/* Favorites provider for managing user favorites */}
      <FavoritesProvider>
        {/* Theme provider for consistent styling */}
        <ThemeProvider>
          {/* Router provider with configured routes */}
          <RouterProvider router={router} />
        </ThemeProvider>
      </FavoritesProvider>
    </AuthProvider>
  </StrictMode>
);
