import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import BaseCard from '../components/Card/BaseCard';
import CardGrid from '../components/Card/CardGrid';
import styled from 'styled-components';

function Vision() {
  const { theme } = useTheme();

  return (
    <>
      <h1>Vision</h1>
      <CardGrid>
        <BaseCard>
          <h2>Our Vision</h2>
          <p>
            Our vision is to provide the best possible experience for our users
            and to help them achieve their goals.
          </p>
        </BaseCard>
        <BaseCard>
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide the best possible tools for our users to
            help them achieve their goals.
          </p>
        </BaseCard>
        <BaseCard>
          <h2>Our Vision</h2>
          <p>
            Our vision is to provide the best possible experience for our users
            and to help them achieve their goals.
          </p>
        </BaseCard>
      </CardGrid>
    </>
  );
}

export default Vision;
