import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes";
const app: Application = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// console.log("process => ", process.env.MONGO_USER)

const MONGO_USER = "sajas";
const MONGO_PASSWORD = "gzx9fo6HRklraOr2";
const MONGO_DB = "contact_db";
// const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ptc7t.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const uri: string = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ptc7t.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.set("useFindAndModify", false);

mongoose
  .connect(uri, options)
  .then(() =>
    app.listen(port, (): void => {
      console.log(`Connected successfully on port ${port}`);
    })
  )
  .catch((error) => {
    console.error(`Error occured: ${error.message}`);
  });
