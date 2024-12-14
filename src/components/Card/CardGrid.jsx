import styled from 'styled-components';

const StoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  justify-items: center;

  > * {
    width: 100%;
    max-width: 400px;
  }
`;

export default StoreGrid;
