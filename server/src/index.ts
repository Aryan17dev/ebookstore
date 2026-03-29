import express from "express";
import dotenv from "dotenv";

const app = express();

dotenv.config();

const port = process.env.PORT ;

app.post('/auth/generate-link', (req, res) => {
    //generate authentication link
    // send that link to users email 
})

app.listen(port, () => {
  console.log(`Your app is listening on PORT ${port}`);
});
