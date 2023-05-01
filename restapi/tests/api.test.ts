import request, {Response} from 'supertest';
import express, { Application } from 'express';
import * as http from 'http';
import bp from 'body-parser';
import cors from 'cors';
import api from '..';

let app:Application;
let server:http.Server;

beforeAll(async () => {
    app = express();
    const port: number = 5000;
    const options: cors.CorsOptions = {
        origin: ['http://localhost:3000']
    };
    app.use(cors(options));
    app.use(bp.json());
    app.use("/api", api);

    server = app.listen(port, ():void => {
        console.log('Restapi server for testing listening on '+ port);
    }).on("error",(error:Error)=>{
        console.error('Error occured: ' + error.message);
    });
});

afterAll(async () => {
    server.close() //close the server
})

describe('user ', () => {

    /**
     * Test that we can search users that exist.
     */
    it('can be found',async () => {
        const response:Response = await request(app).get("/users/plg22");
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual("application/json");
    });

    /**
     * Test that we can search users that exist.
     */
    it('cannot be found',async () => {
        const response:Response = await request(app).get("/users/abcdefghi");
        expect(response.statusCode).toBe(404);
    });

    /**
     * Test that we can find by his id a user that exist.
     */
    it('can be found by id',async () => {
        const response:Response = await request(app).get("/users/id/6433c2435e3283d2f3f7207e");
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual("application/json");
    });

    /**
     * Test that we cannot find by his id a user that does not exist.
     */
    it('cannot be found by id',async () => {
        const response:Response = await request(app).get("/users/id/pepe");
        expect(response.statusCode).toBe(404);
    });


    /**
     * Test that we can retrieve some users from our mongo.
     */
    it('can retrieve the user from our database',async () => {
        const response:Response = (await request(app).patch("/users/").send({
            webId: "https://arqsoftlomapen2b.inrupt.net/profile/card"
        }));
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual("application/json");
    });

    /**
     * Test that we cannot retrieve some users that are not in mongo.
     */
    it('cannot retrieve a non existant user',async () => {
        const response:Response = (await request(app).patch("/users/").send({
            webId: "https://pepe.inrupt.net/profile/card"
        }));
        expect(response.statusCode).toBe(404);
    });

    /**
     * Test that we can add a user to our mongo.
     */
    it('can add a user to our mongo',async () => {
        const response:Response = (await request(app).post("/users/").send({
            solidURL: "https://juan.inrupt.net/profile/card"
        }));
        expect(response.statusCode).toBe(201);
        expect(response.type).toEqual("application/json");

        const response2:Response = (await request(app).delete("/users/").send({
            solidURL: "https://juan.inrupt.net/profile/card"
        }));
        expect(response.statusCode).toBe(201);
        expect(response.type).toEqual("application/json");
    });

    /**
     * Test that we cannot add a user to our mongo when we dont receive the correct params.
     */
    it('cannot add a user to our mongo when we dont receive the correct params',async () => {
        const response:Response = (await request(app).post("/users/").send({  /* EMPTY */  }));
        expect(response.statusCode).toBe(400);
    });


    //SOLID tests

    /**
     * Test that we retrieve the information for the profile.
     */
    it('can find profile info',async () => {
        const response:Response = await request(app).get("/solid/643425320fcf0094a003db0f");
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual("application/json");
    });

    /**
     * Test that we retrieve the information for the profile.
     */
    it('cannot find profile info of non existant user',async () => {
        const response:Response = await request(app).get("/solid/pepe");
        expect(response.statusCode).toBe(500);
    });

    /**
     * Test that we retrieve the friends of some user.
     */
    it('can find friends info',async () => {
        const response:Response = await request(app).get("/solid/643425320fcf0094a003db0f/friends");
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual("application/json");
    });

    /**
     * Test that we cannot retrieve friends of a non existant user.
     */
    it('cannot find friends info of non existant user',async () => {
        const response:Response = await request(app).get("/solid/pepe/frineds");
        expect(response.statusCode).toBe(500);
    });

    //Add friend


    //Landmark Tests

    /**
     * Test that we can retrieve landmarks from a user(friend).
     */
    it('can retrieve landmarks',async () => {
        const response:Response = (await request(app).post("/landmarks/friend").send({
            webID: "https://juan.inrupt.net/profile/card"
        }));
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual("application/json");
    });

    /**
     * Test that we cannot retrieve landmarks from a user(friend) that does not exist.
     */
    it('cannot retrieve landmarks',async () => {
        const response:Response = (await request(app).post("/landmarks/friend").send({
            webID: "pepe"
        }));
        expect(response.statusCode).toBe(500);
    });


    /**
     * Test that we add a landmark in mongo.
     */
    it('can add a landmark in mongo',async () => {
        const rname = Math.random()*100;
        const response:Response = (await request(app).post("/landmarks/").send({
            name: "prueba" + rname,
            category: "Bar" ,
            latitude: 45 ,
            longitude: 45,
            webID: "https://arqsoftlomapen2b.inrupt.net/profile/card"
        }));
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual("application/json");
    });

    /**
     * Test that we cannot add an erroneous landmark in mongo.
     */
    it('cannot add an erroneous landmark in mongo',async () => {
        const response:Response = (await request(app).post("/landmarks/").send({
            /* EMPTY */
        }));
        expect(response.statusCode).toBe(500);
    });
    

    /**
     * Tests that a user can be created through the productService without throwing any errors.
     */
    /* it('can be created correctly', async () => {
        let username:string = 'Pablo'
        let email:string = 'gonzalezgpablo@uniovi.es'
        const response:Response = await request(app).post('/api/users/add').send({name: username,email: email}).set('Accept', 'application/json')
        expect(response.statusCode).toBe(200);
    }); */
});