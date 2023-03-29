import express from "express";

const router = express.Router();

const {
    getSessionFromStorage,
    getSessionIdFromStorageAll,
    Session
} = require("@inrupt/solid-client-authn-node");

const dotenv = require("dotenv").config();


router.get("/login", async (req: any, res: any, next: any) => {
    // 1. Create a new Session
    const session = new Session();
    req.session.sessionId = session.info.sessionId;

    const redirectToSolidIdentityProvider = (url: string) => {
        // Since we use Express in this example, we can call `res.redirect` to send the user to the
        // given URL, but the specific method of redirection depend on your app's particular setup.
        // For example, if you are writing a command line app, this might simply display a prompt for
        // the user to visit the given URL in their browser.
        res.redirect(url);
    };

    const cookieValue = req.cookies.provider;

    // 2. Start the login process; redirect handler will handle sending the user to their
    //    Solid Identity Provider.
    await session.login({
        // After login, the Solid Identity Provider will send the user back to the following
        // URL, with the data necessary to complete the authentication process
        // appended as query parameters:
        redirectUrl: "http://localhost:" + process.env.WEBAPP_PORT,
        // Set to the user's Solid Identity Provider; e.g., "https://login.inrupt.com" 
        oidcIssuer: cookieValue,
        // Pick an application name that will be shown when asked 
        // to approve the application's access to the requested data.
        clientName: "LoMap",
        handleRedirect: redirectToSolidIdentityProvider,
    });
});

router.get("/redirect-from-solid-idp", async (req: any, res: any) => {
    try {
        // 3. If the user is sent back to the `redirectUrl` provided in step 2,
        //    it means that the login has been initiated and can be completed. In
        //    particular, initiating the login stores the session in storage, 
        //    which means it can be retrieved as follows.
        const session = await getSessionFromStorage(req.session.sessionId);

        // 4. With your session back from storage, you are now able to 
        //    complete the login process using the data appended to it as query
        //    parameters in req.url by the Solid Identity Provider:
        await session.handleIncomingRedirect(`http://localhost:${process.env.RESTAPI_PORT}${req.url}`);

        // 5. `session` now contains an authenticated Session instance.
        if (session.info.isLoggedIn) {
            return res.status(200).json(session.info.webId);
        }
        else {
            res.status(401).json("Error logging in");
        }
    } catch (e) {
        res.status(500).json(e);
    }
});

// 6. Once you are logged in, you can retrieve the session from storage, 
//    and perform authenticated fetches.
router.get("/fetch", async (req: any, res: any, next: any) => {
    try {
        if (typeof req.query["resource"] === "undefined") {
            res.send(
                "<p>Please pass the (encoded) URL of the Resource you want to fetch using `?resource=&lt;resource URL&gt;`.</p>"
            );
        }
        const session = await getSessionFromStorage(req.session.sessionId);
        console.log(await (await session.fetch(req.query["resource"])).text());
        res.status(200).json(session);
    } catch (e) {
        res.status(500).json(e);
    }
});

// 7. To log out a session, just retrieve the session from storage, and 
//    call the .logout method.
router.get("/logout", async (req: any, res: any, next: any) => {
    try {
        const session = await getSessionFromStorage(req.session.sessionId);
        session.logout();
        res.status(302).json("Logged out succesfuly");
    } catch (e) {
        res.status(500).json(e);
    }
});

// 8. On the server side, you can also list all registered sessions using the
//    getSessionIdFromStorageAll function.
router.get("/", async (req: any, res: any, next: any) => {
    const sessionIds = await getSessionIdFromStorageAll();
    for (const sessionId in sessionIds) {
        // Do something with the session ID...
    }
    res.send(
        sessionIds.get(0)
    );
});

module.exports = router;