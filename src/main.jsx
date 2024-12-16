import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './pages/Home.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router';
import Stores from './pages/Stores.jsx';
import LoginPage from './pages/LoginPage';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />} errorElement={<ErrorBoundary />}>
      <Route index element={<Home />} />
      <Route path='stores' element={<Stores />} />
      <Route path='/login' element={<LoginPage />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
