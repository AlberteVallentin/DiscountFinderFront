import styled from 'styled-components';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: 1fr;
  gap: 2rem;
  width: min(90%, 75rem);
  margin-inline: auto;
  padding: 1rem;
  justify-content: center;
  align-items: stretch;

  > * {
    width: 100%;
    max-width: 400px;
    justify-self: center;
    height: 100%;
    aspect-ratio: 11/7;
  }
`;

export default CardGrid;
