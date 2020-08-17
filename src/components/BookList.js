import React from "react";
import { graphql } from "react-apollo"; //helps to bind apollo to react
import { getBooksQuery } from "../queries/queries";

function BookList(props) {
  //to get data from graphql, check props might have to reload the app or server or both

  function displayBooks() {
    var data = props.data;

    if (data.loading) {
      return <div>Loading...</div>;
    } else {
      return data.books.map((book, i) => {
        return <li key={book.id}>{book.name}</li>;
      });
    }
  }

  return (
    <div>
      <ul id="book-list">{displayBooks()}</ul>
    </div>
  );
}

export default graphql(getBooksQuery)(BookList); //binding getBooksQUery to component
