import Header from "./Header";
import themes from "./themes";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { useState, createContext } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = createContext();

const Layout = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const changeTheme = () => {
    setTheme(theme == "light" ? "dark" : "light");
  };

  return (
    <App.Provider value={{ changeTheme, theme }}>
      <ThemeProvider theme={themes[theme]}>
        <ToastContainer />
        <LayoutWrapper>
          <GlobalStyle />
          <Header />
          {children}
        </LayoutWrapper>
      </ThemeProvider>
    </App.Provider>
  );
}

const GlobalStyle = createGlobalStyle`
    *, *::before, *::after {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background-color: ${(props) => props.theme.bgColor};
        color: ${(props) => props.theme.color};
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: 'Playfair Display', 'Times New Roman', serif;
        margin: 0;
        line-height: 1.1;
    }

    p {
        margin: 0;
    }

    button {
        font-family: inherit;
    }
`;

const LayoutWrapper = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.bgColor};
  background-image: ${(props) => props.theme.bgImage};
  color: ${(props) => props.theme.color};
  transition: background 0.4s ease, color 0.4s ease;
`;

export default Layout;
export { App };
