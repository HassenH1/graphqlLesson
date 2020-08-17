const graphql = require("graphql");
// const _ = require("lodash") //if needed
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull, //not accept null values
} = graphql; //destructoring

const Book = require("../models/book");
const Author = require("../models/author");

//dumb data aka test data
// var books = [
//   { name: "book1", genre: "fan", id: "1", authorId: "1" },
//   { name: "book2", genre: "adv", id: "2", authorId: "2" },
//   { name: "book3", genre: "scifi", id: "3", authorId: "3" },
//   { name: "book4", genre: "fan", id: "4", authorId: "2" },
//   { name: "book5", genre: "fan", id: "5", authorId: "3" },
//   { name: "book6", genre: "fan", id: "6", authorId: "3" },
// ];

// var authors = [
//   { name: "Pat", agg: 44, id: "1" },
//   { name: "Brandon", age: 42, id: "2" },
//   { name: "Terry", age: 66, id: "3" },
// ];

const BookType = new GraphQLObjectType({
  name: "Book",
  //must wrapper fields in a function
  fields: () => ({
    id: { type: GraphQLID }, //like mongo schema
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType, //relationship between two types
      resolve(parent, args) {
        // return authors.find((author) => author.id === parent.authorId); //this is where the parent object comes in handy

        //now from mongoDB
        return Author.findById(parent.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID }, //like mongo schema
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType), //list of books basically
      resolve(parent, args) {
        // return books.filter((book) => book.authorId === parent.id);
        return Book.find({ authorId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      //finding individual book
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //resolve function is gonna find the data and return it back
        //code to get data from db / other source
        //npm i lodash if necessary
        console.log(typeof args.id); //proof that id is string even if its a type of GraphQLID
        // return books.find((book) => book.id === args.id); //this works

        return Book.findById(args.id);
      },
    },
    author: {
      //finding individual author
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return authors.find((author) => author.id === args.id);
        return Author.findById(args.id);
      },
    },

    books: {
      //list of all the books
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books.map((book) => book) or you can just return books
        //return books;
        return Book.find({}); //return all books
      },
    },

    authors: {
      //list of all the authors
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors;
        return Author.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }, //fields cannot be null
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        //created new instances of author
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        return author.save(); //save new author in db
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }, //cannot be null
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
