import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import BaseCard from '../components/Card/BaseCard';
import styled from 'styled-components';

function Vision() {
  const { theme } = useTheme();

  return (
    <>
      <BaseCard />
    </>
  );
}

export default Vision;
