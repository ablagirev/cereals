import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { render } from "react-dom";
import { ErrorBoundary } from "./components";
import { Routes } from "./routes";
import { navigation } from "./routes/navigation";
import { Layout } from "./components/Layout/Layout";
import "@fontsource/rubik";
import { Normalize } from "styled-normalize";
import { GlobalStyle } from "./globalStyles";
import { useAuth } from "./hooks";
import { AuthContext } from "./context";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Loader } from "./uikit/Loader";

/**
 * Инициализация кеша react-query.
 */

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { token, tokenType, login, logout, ready } = useAuth();

  const isAuthenticated = !!token;

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <GlobalStyle />
        <Normalize />
        {ready ? (
          <AuthContext.Provider
            value={{ token, tokenType, login, logout, isAuthenticated }}
          >
            <BrowserRouter>
              <Layout navigation={navigation}>
                <Routes />
              </Layout>
            </BrowserRouter>
          </AuthContext.Provider>
        ) : (
          <Loader />
        )}
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

render(<App />, document.getElementById("root"));
