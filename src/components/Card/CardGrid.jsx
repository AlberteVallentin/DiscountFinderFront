import styled from 'styled-components';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  width: min(90%, 75rem);
  margin-inline: auto;
  padding: 1rem;
  justify-content: center;

  > * {
    width: 100%;
    max-width: 400px;
    justify-self: center;
  }
`;

export default CardGrid;
