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
        const response:Response = await request(app).get("users/plg22");
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual("application/json");
    });

    /**
     * Test that we can search users that exist.
     */
    it('cannot be found',async () => {
        const response:Response = await request(app).get("users/abcdefghi");
        expect(response.statusCode).toBe(404);
    });

    /**
     * Test that we can find by his id a user that exist.
     */
    it('cannot be found',async () => {
        const response:Response = await request(app).get("users/id/6433c2435e3283d2f3f7207e");
        expect(response.statusCode).toBe(200);
        expect(response.type).toEqual("application/json");
    });

    /**
     * Test that we cannot find by his id a user that does not exist.
     */
    it('cannot be found',async () => {
        const response:Response = await request(app).get("users/id/pepe");
        expect(response.statusCode).toBe(404);
    });

    

    /**
     * Tests that a user can be created through the productService without throwing any errors.
     */
    it('can be created correctly', async () => {
        let username:string = 'Pablo'
        let email:string = 'gonzalezgpablo@uniovi.es'
        const response:Response = await request(app).post('/api/users/add').send({name: username,email: email}).set('Accept', 'application/json')
        expect(response.statusCode).toBe(200);
    });
});