import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { borderRadius } from '../../styles/Theme';

const SliderContainer = styled.div`
  width: 300px;
  padding: 1rem;
`;

const RangeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
`;

const SliderTrack = styled.div`
  position: absolute;
  width: 100%;
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${borderRadius.round};
  top: 50%;
  transform: translateY(-50%);
`;

const SliderRange = styled.div`
  position: absolute;
  height: 4px;
  background: ${({ theme }) => theme.colors.buttonColor};
  border-radius: ${borderRadius.round};
  top: 50%;
  transform: translateY(-50%);
`;

const Thumb = styled.input`
  -webkit-appearance: none;
  appearance: none;
  position: absolute;
  width: 100%;
  height: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  pointer-events: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    pointer-events: auto;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.buttonColor};
    cursor: pointer;
    border: 2px solid ${({ theme }) => theme.colors.background};
    transition: background 0.2s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.text};
    }
  }

  &::-moz-range-thumb {
    pointer-events: auto;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.buttonColor};
    cursor: pointer;
    border: 2px solid ${({ theme }) => theme.colors.background};
    transition: background 0.2s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.text};
    }
  }
`;

const PriceDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: var(--fs-s);
`;

const RangeSlider = ({ min, max, onChange, debounceMs = 300 }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ min: minVal, max: maxVal });
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [minVal, maxVal, onChange, debounceMs]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(value);
  };

  const getPercent = (value) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <SliderContainer>
      <RangeContainer>
        <SliderTrack />
        <SliderRange
          style={{
            left: `${getPercent(minVal)}%`,
            width: `${getPercent(maxVal) - getPercent(minVal)}%`,
          }}
        />
        <Thumb
          type='range'
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
        />
        <Thumb
          type='range'
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
        />
      </RangeContainer>
      <PriceDisplay>
        <span>{minVal} kr</span>
        <span>{maxVal} kr</span>
      </PriceDisplay>
    </SliderContainer>
  );
};

export default RangeSlider;
