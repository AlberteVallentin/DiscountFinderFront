import React from 'react';
import logo from '../assets/logo.svg';

function Logo({ width = '50px', height = '50px' }) {
  return <img src={logo} alt='Logo' style={{ width, height }} />;
}

export default Logo;
