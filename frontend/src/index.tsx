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
import { appConfig } from "./config";

/**
 * Инициализация конфигурации приложения.
 */
appConfig.init();

/**
 * Инициализация кеша react-query.
 */

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { token, userId, login, logout, ready } = useAuth();
  const isAuthenticated = !!token;
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <GlobalStyle />
        <Normalize />
        {ready ? (
          <AuthContext.Provider
            value={{ token, userId, login, logout, isAuthenticated }}
          >
            <BrowserRouter>
              <Layout navigation={navigation} isAuthenticated={isAuthenticated}>
                <Routes isAuthenticated={isAuthenticated} />
              </Layout>
            </BrowserRouter>
          </AuthContext.Provider>
        ) : (
          "Loading . . ." // TODO: воткнуть лоадер
        )}
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

render(<App />, document.getElementById("root"));
