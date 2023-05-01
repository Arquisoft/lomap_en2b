const express = require("express");

const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');
const cors = require("cors");
import bp from 'body-parser';
import promBundle from 'express-prom-bundle';
import {RequestHandler} from "express";
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const solid = require("./controllers/solid");
const users = require("./controllers/users");
const landmarks = require("./controllers/landmarks");

const app = express();
app.disable("x-powered-by");
const metricsMiddleware:RequestHandler = promBundle({includeMethod: true});


dotenv.config();



app.use(metricsMiddleware);


app.use(bp.json());





mongoose.connect(process.env.MONGO_URL).then(
  console.log('Succesfully connected to MongoDB')
);

app.use(cors({origin:"http://localhost:3000"}))


app.use(cookieParser());


// The following snippet ensures that the server identifies each user's session
// with a cookie using an express-specific mechanism
app.use(
  cookieSession({
    name: "session",
    // These keys are required by cookie-session to sign the cookies.
    keys: [
      "Required, but value not relevant for this demo - key1",
      "Required, but value not relevant for this demo - key2",
    ],
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  })
);


app.use("/solid", solid);
app.use("/users", users);
app.use("/landmarks",landmarks );

app.listen(8800, ():void => {
  console.log('Restapi listening on 8800');
}).on("error",(error:Error)=>{
  console.error('Error occured: ' + error.message);
});


export default app;