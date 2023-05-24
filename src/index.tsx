import 'reflect-metadata';
import React from 'react';
import { createRoot } from 'react-dom/client';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import App from './App';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { KeycloakClient, KeycloakProvider } from '@eten-lab/sso';
import { createUploadLink } from 'apollo-upload-client';

const uploadLink = createUploadLink({
  uri: `${process.env.REACT_APP_CPG_SERVER_URL}/graphql`,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: uploadLink,
});

const kcClient = new KeycloakClient({
  uri: process.env.REACT_APP_KEYCLOAK_URL!,
  realm: process.env.REACT_APP_KEYCLOAK_REALM!,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID!,
  clientSecret: process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET!,
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <KeycloakProvider client={kcClient}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </KeycloakProvider>
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
