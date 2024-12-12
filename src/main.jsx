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
import Vision from './pages/Vision.jsx';
import Endpoints from './pages/Endpoints.jsx';
import Stores from './pages/Stores.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path='stores' element={<Stores />} />
      <Route path='vision' element={<Vision />} />
      <Route path='endpoints' element={<Endpoints />} />
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
