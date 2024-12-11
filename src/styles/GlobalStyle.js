import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');


  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

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
    width: 100vw;

    /* Breakpoints */
    --tablet: 768px;
    --laptop: 1024px;
    --desktop: 1440px;

    /* Font sizes using clamp */
    --fs-s: clamp(0.8333rem, 0.7754rem + 0.2899vi, 1rem);
    --fs-n: clamp(1rem, 0.913rem + 0.4348vi, 1.25rem);
    --fs-m: clamp(1.2rem, 1.0739rem + 0.6304vi, 1.5625rem);
    --fs-l: clamp(1.44rem, 1.2615rem + 0.8924vi, 1.9531rem);
    --fs-xl: clamp(1.8rem, 1.5rem + 1.25vi, 2.5rem);

    /* Font weights */
    --fw-light: 300;
    --fw-normal: 400;
    --fw-medium: 500;
    --fw-semi-bold: 600;
    --fw-bold: 700;

    /* Typography */
    font-family: 'Poppins', sans-serif;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  

  main {
    min-height: 80vh;
    padding: 1rem;
    margin-top: 10vh;
    display: flex;
    flex-direction: column;
  
  }


  footer {
    display: flex;
    justify-content: space-evenly;
  }

  /* Typography rules */
  h1 {
    font-size: var(--fs-xl);
    font-weight: var(--fw-bold);
    text-align: center;
    padding: 1rem;
  }

  h2 {
    font-size: var(--fs-l);
    font-weight: var(--fw-semi-bold);
  }

  h3 {
    font-size: var(--fs-m);
    font-weight: var(--fw-medium);
  }

  p, select, option, input, label, textarea {
    font-size: var(--fs-n);
    font-weight: var(--fw-normal);
  }
`;

export default GlobalStyle;
