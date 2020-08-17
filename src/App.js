import React from "react";
import BookList from "./components/BookList";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import AddBook from "./components/AddBook";
import "./index.css";

//apolloclient setup
const client = new ApolloClient({
  uri: "http://localhost:5000/graphql", //server endpoint
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div id="main">
        <h1>Hello world</h1>
        <BookList />
        <AddBook />
      </div>
    </ApolloProvider>
  );
}

export default App;
