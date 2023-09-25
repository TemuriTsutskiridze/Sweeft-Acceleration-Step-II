import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-size: 62.5%;
  }

  #root {
    padding: 0.8rem;
    min-height: 100vh;
  }
`;

export default GlobalStyle;
