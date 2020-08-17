import React, { useEffect } from "react";
import { graphql } from "react-apollo"; //helps to bind apollo to react
import { getBookQuery } from "../queries/queries";

function BookDetails(props) {
  function displayBookDetails() {
    const { book } = props.data;
    if (book) {
      return (
        <div>
          <h2>{book.name}</h2>
          <p>{book.genre}</p>
          <p>{book.author.name}</p>
          <p>All Books by this Author</p>
          <ul className="other-books">
            {book.author.books.map((book) => {
              return <li key={book.id}>{book.name}</li>;
            })}
          </ul>
        </div>
      );
    } else {
      return <div>No Book selected</div>;
    }
  }

  return (
    <div>
      <ul id="book-details">{displayBookDetails()}</ul>
    </div>
  );
}

export default graphql(getBookQuery, {
  options: (props) => {
    return {
      variables: {
        id: props.bookId,
      },
    };
  },
})(BookDetails);
