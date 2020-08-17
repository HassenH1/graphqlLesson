import React, { useState } from "react";
import { graphql } from "react-apollo"; //helps to bind apollo to react //compose is used to combine the queries at the bottom
import {
  getAuthorsQuery,
  addBookMutation,
  getBooksQuery,
} from "../queries/queries";
import { flowRight as compose } from "lodash";

function AddBook(props) {
  const [state, setState] = useState({
    name: "",
    genre: "",
    authorId: "",
  });

  function displayAuthors() {
    // var data = props.data; //this got replace cuz we gave a name property at the bottom
    var data = props.getAuthorsQuery;
    if (data.loading) {
      return <option disabled>loading...</option>;
    } else {
      return data.authors.map((author) => {
        return (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        );
      });
    }
  }

  const submitForm = (e) => {
    e.preventDefault();
    props.addBookMutation({
      variables: {
        name: state.name,
        genre: state.genre,
        authorId: state.authorId,
      }, //pass query variables here
      refetchQueries: [{ query: getBooksQuery }], //refetch whatever query you pass it
    });
  };

  return (
    <form id="add-book" onSubmit={submitForm}>
      <div className="field">
        <label>Book Name:</label>
        <input
          type="text"
          onChange={(e) =>
            setState({
              ...state,
              name: e.target.value,
            })
          }
        />
      </div>

      <div className="field">
        <label>Genre:</label>
        <input
          type="text"
          onChange={(e) =>
            setState({
              ...state,
              genre: e.target.value,
            })
          }
        />
      </div>

      <div className="field">
        <label>Author:</label>
        <select
          onChange={(e) =>
            setState({
              ...state,
              authorId: e.target.value,
            })
          }
        >
          <option>Select Authors</option>
          {displayAuthors()}
        </select>
      </div>

      <button type="submit">+</button>
    </form>
  );
}

export default compose(
  graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
  graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);
