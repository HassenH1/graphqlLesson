const express = require("express");
const app = express();
const PORT = 5000;
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(
  "mongodb+srv://@cluster0.uv9pk.mongodb.net/graphqltest?retryWrites=true&w=majority"
);
mongoose.connection.once("open", () => {
  console.log("connected to db successfully", "<--------------------------");
});

app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    //put schema here
    //you can shorten schema with es6
    schema: schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log("app listening on " + PORT);
});
