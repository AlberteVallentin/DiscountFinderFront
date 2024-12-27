import styled from 'styled-components';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: 1fr; // Makes all rows the same height as the tallest
  gap: 2rem;
  width: min(90%, 75rem);
  margin-inline: auto;
  padding: 1rem;

  > * {
    width: 100%;
    max-width: 400px;
    justify-self: center;
    height: 100%; // Ensures child elements fill the grid cell height
  }
`;

export default CardGrid;
