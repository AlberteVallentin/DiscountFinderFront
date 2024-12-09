import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
  }
  * {
    margin: 0;
  }
  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }
  input, button, textarea, select {
    font: inherit;
  }
  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }
  p {
    text-wrap: pretty;
  }
  h1, h2, h3, h4, h5, h6 {
    text-wrap: balance;
  }
  #root, #__next {
    isolation: isolate;
  }

  :root {
    font-size: 16px;
    font-family: 'Poppins', sans-serif;
    
    /* Breakpoints */
    --mobile: 320px;
    --tablet: 768px;
    --laptop: 1024px;
    --desktop: 1440px;
    
    /* Container widths */
    --container-small: 600px;
    --container-medium: 720px;
    --container-large: 960px;
    --container-xlarge: 1140px;
  }

  a {
    text-decoration: none;
    color: inherit;
    
    &:hover {
      opacity: 0.8;
    }
  }

  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  header, main, footer {
    width: 100%;
    padding: 1rem;
    margin: 0 auto;

    @media (min-width: 320px) {
      max-width: var(--container-small);
    }

    @media (min-width: 768px) {
      max-width: var(--container-medium);
    }

    @media (min-width: 1024px) {
      max-width: var(--container-large);
    }

    @media (min-width: 1440px) {
      max-width: var(--container-xlarge);
    }
  }

  header {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  main {
    min-height: 80vh;
    padding: 2rem 1rem;
  }

  footer {
    display: flex;
    justify-content: space-evenly;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }

  h1 {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;

    @media (min-width: 768px) {
      font-size: 2.5rem;
    }

    @media (min-width: 1024px) {
      font-size: 3rem;
    }
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 500;

    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1rem;
    font-weight: 400;
  }
`;

export default GlobalStyle;