import express from "express";

const app = express();

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("<h1>This is our App</h1>");
});
app.get("/login", (req, res) => {
  res.send("<h1>This is our login page</h1>");
});

app.listen(port, () => {
  console.log(`Your app is listening on PORT ${port}`);
});
