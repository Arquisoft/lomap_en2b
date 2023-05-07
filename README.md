# lomap_en2b

[![Actions Status](https://github.com/arquisoft/lomap_en2b/workflows/CI%20for%20LOMAP_EN2B/badge.svg)](https://github.com/arquisoft/lomap_en2b/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_lomap_en2b&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_lomap_en2b)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_lomap_en2b&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_lomap_en2b)

## Introduction to Lomap

This is an application done by a team of UniOvi students, simulating a project done by a belgian software company, for the Council of Brussels.
It is an application where the users can login with their Solid accounts and share their favourite landmarks and places all around the globe with their friends. In the application you will be able to see your friends' landmarks, and you can create landmarks on your favourite places in order to let people see what you enjoy the most about the city of Brussels and also from the whole world.

This is a website done while we learnt some technologies like **React**, **Typescript** or an endpoint using **NodeJS** with **express**.

## Team members

Andres Cadenas Blanco UO282276@uniovi.es  
Pedro Limeres Granado uo282763@uniovi.es  
Diego Villanueva Berros UO283615@uniovi.es  
Jorge Joaquín Gancedo Fernández UO282161@uniovi.es  

<p align="center">
<img src="https://blog.wildix.com/wp-content/uploads/2020/06/react-logo.jpg" height="100">
<img src="https://miro.medium.com/max/1200/0*RbmfNyhuBb8G3LWh.png" height="100">
<img src="https://miro.medium.com/max/365/1*Jr3NFSKTfQWRUyjblBSKeg.png" height="100">
</p>

## Sections

* [Quickstart guide](#quickstart-guide)
* [Webapp](#webapp)

## You might also be interested in

* [Deployment](/Deployment)
* [Other information](/OtherInformation)

## Quickstart guide

### Requirements

* [Git](https://git-scm.com/downloads)
*  [Node.js](https://nodejs.org). If you are interested in using several versions at the same time, you should consider a version manager, such as [NVM](https://github.com/nvm-sh/nvm).
* [Docker](https://docs.docker.com/get-docker/) (optionally)

Download the project with :
```bash
git clone https://github.com/arquisoft/lomap_en2b
```

The fastest way to launch everything is with docker:
```bash
docker-compose up --build
```
This will create two docker images as they don't exist in your system (the webapp and the restapi) and launch a mongo container database. It will also launch Prometheus and Grafana containers to monitor the webservice. You should be able to access everything from the following links:
 - [Webapp - http://localhost:3000](http://localhost:3000)
 - [RestApi example call - http://localhost:5000/api/users/list](http://localhost:5000/api/users/list)
 - [RestApi raw metrics - http://localhost:5000/metrics](http://localhost:5000/metrics)
 - [Prometheus server - http://localhost:9090](http://localhost:9090)
 - [Grafana server http://localhost:9091](http://localhost:9091)
 
If you want to run it without docker. Compile and run the restapi:
```shell
cd restapi
npm install
npm start
```

Now the webapp:

```shell
cd webapp
npm install
npm start
```

You should be able to access the application in [http://localhost:3000](http://localhost:3000).

## Webapp

### Running the webapp

In this case we are using React with Typescript for the webapp. Lets create the app in the directory webapp with the following command (make sure you have npm installed in your system):
```console
cd webapp
npm i
npm start
```
And open a new command console and execute
```console
cd restapi
npm i
npm run dev
```
This runs the application in local, take into account you must have nodejs installed in the system. To access the webpage access in a browser write: localhost:3000


### Testing the Webapp

#### Unit tests

Basically these tests make sure that each component work isolated. It is important to check that they render properly. These tests are done using jest and you can execute them with `npm run test`. A code coverage analysis is generated every time we run the tests. If properly configured, this can be exploited by tools like [SonarCloud](https://sonarcloud.io/) to create reports of code coverage.
Some tests needs to mock some parts of the application. For instance, the `EmailForm.tsx` component uses the api for adding a user. In the unitary tests we should mock these calls to make more robusts tests. You can check the file [EmailForm.test.tsx](src/components/EmailForm.test.tsx) to learn how this is done.
For instance:
```javascript
jest.spyOn(api,'addUser').mockImplementation((user:User):Promise<boolean> => Promise.resolve(false))
```
will mock the implementation of the addUser function. Instead of calling the API, we just return false simulating that the webservice has failed to add a new user.

### Docker image for the web app

The `Dockerfile` for the webapp is pretty simple. Just copy the app, install the dependencies, build the production version an then run a basic webserver to launch it. 

In order to run the app, we need a server. `npm start` is not good for production so we are going to use [Express](https://expressjs.com/es/). Check [server.js](webapp/server.ts) in the webapp to understand the configuration. As we will run it in port 3000 (in localhost), we have to bind this port with the port in our local machine.
