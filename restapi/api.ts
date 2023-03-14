const express = require("express");
import { Request, Response } from "express"
const cookieSession = require("cookie-session");
const cors = require("cors");
const User = require("./models/User")

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(
  console.log('Connected to MongoDB')
);

const { 
  getSessionFromStorage,
  getSessionIdFromStorageAll,
  Session
} = require("@inrupt/solid-client-authn-node");

const app = express();
app.use(cors({origin:"http://localhost:3000"}))
const port = 8800;

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
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: false,
  })
);


app.get("/login", async (req : any, res : any, next : any) => {
  // 1. Create a new Session
  const session = new Session();
  req.session.sessionId = session.info.sessionId;
  console.log(session)

  const redirectToSolidIdentityProvider = (url : string) => {
    // Since we use Express in this example, we can call `res.redirect` to send the user to the
    // given URL, but the specific method of redirection depend on your app's particular setup.
    // For example, if you are writing a command line app, this might simply display a prompt for
    // the user to visit the given URL in their browser.
    res.redirect(url);
  };

  // 2. Start the login process; redirect handler will handle sending the user to their
  //    Solid Identity Provider.
  await session.login({
    // After login, the Solid Identity Provider will send the user back to the following
    // URL, with the data necessary to complete the authentication process
    // appended as query parameters:
    redirectUrl: "http://localhost:3000",
    // Set to the user's Solid Identity Provider; e.g., "https://login.inrupt.com" 
    oidcIssuer: "https://inrupt.net",
    // Pick an application name that will be shown when asked 
    // to approve the application's access to the requested data.
    clientName: "LoMap",
    handleRedirect: redirectToSolidIdentityProvider,
  });
});

app.get("/redirect-from-solid-idp", async (req : any, res : any) => {
  // 3. If the user is sent back to the `redirectUrl` provided in step 2,
  //    it means that the login has been initiated and can be completed. In
  //    particular, initiating the login stores the session in storage, 
  //    which means it can be retrieved as follows.
  const session = await getSessionFromStorage(req.session.sessionId);

  // 4. With your session back from storage, you are now able to 
  //    complete the login process using the data appended to it as query
  //    parameters in req.url by the Solid Identity Provider:
  await session.handleIncomingRedirect(`http://localhost:${port}${req.url}`);

  // 5. `session` now contains an authenticated Session instance.
  if (session.info.isLoggedIn) {
    return res.status(200).json(session.info.webId)
  }
});

// 6. Once you are logged in, you can retrieve the session from storage, 
//    and perform authenticated fetches.
app.get("/fetch", async (req : any, res : any, next : any) => {
  if(typeof req.query["resource"] === "undefined") {
    res.send(
      "<p>Please pass the (encoded) URL of the Resource you want to fetch using `?resource=&lt;resource URL&gt;`.</p>"
    );
  }
  const session = await getSessionFromStorage(req.session.sessionId);
  console.log(await (await session.fetch(req.query["resource"])).text());
  res.status(200).json(session);
});

// 7. To log out a session, just retrieve the session from storage, and 
//    call the .logout method.
app.get("/logout", async (req : any, res : any, next : any) => {
  const session = await getSessionFromStorage(req.session.sessionId);
  session.logout();
  res.send(`<p>Logged out.</p>`);
});

// 8. On the server side, you can also list all registered sessions using the
//    getSessionIdFromStorageAll function.
app.get("/", async (req : any, res : any, next : any) => {
  const sessionIds = await getSessionIdFromStorageAll();
  for(const sessionId in sessionIds) {
    // Do something with the session ID...
  }
  res.send(
    sessionIds.get(0)
  );
});

app.listen(port, () => {
  console.log(
    `Server running on port [${port}]. `
  );
});

app.post("/user/add", async (req : Request, res : Response, next : any) => {
  
  try {
    const newUser = new User({
      solidURL: "Pepe",
      username: "Pepe",
    });
    const user = await newUser.save();

    const newUser2 = new User({
      solidURL: "Pedro",
      username: "Pepe",
    });
    const user2 = await newUser2.save();

    res.status(201).json(user);
  }
  catch (err){
    res.status(500).json(err);
  }
});

app.get("/user/search/:text", async (req : any, res : any, next : any) => {
  const searchText = req.params.text;
  try {
    const result = await User.find({
      username: searchText
    })
    console.log(result);
    console.log(searchText);
    res.status(200).json(result);
  }
  catch (err){
    res.status(500).json(err);
  }
});

export default app;