# activeLink

## Purpose

* ActiveLink is a web-based platform to manage extra-curricular activities at a school:
  * users:
    * plaftormMaster: manages the platform.
    * providers: offer classes for kids, receive paiements.
    * parents: register their kids to classes, pay for the classes.
    * kids: attend the classes.

## References

* ActiveLink is currently in use at following locations:
  * N/A

## Installation

* try online: https://activelink.herokuapp.com
* try locally:

  * prerequisites: available accounts at heroku.com, mLab.com and google developers.
  * clone the repository:
    `clone https://github.com/xiaoju/activeLink.git`
    `cd activeLink`

  * add credentials for Google Developer and mlab projects, into a new `/config/dev.js` file, using same format as per `/config/dev_template.js`

  * install:
    `npm install`

  * start:
    `npm run dev`

  * A browser window should automatically open at http://localhost:3000

* install for production
  * prerequisites: GitHub, Heroku, mlab and google accounts
  *
  // TODO

## Architecture

### Web stack

* front end: React, Redux
* back end: node.js, Express, Passport, oauth2, mongoose
* database: mongoDB (hosted on mlab.com) / PostgreSQL
* https
* app scaffolding as per Stephen Grieder Udemy class ['Node with React: fullstack web development']([https://www.udemy.com/node-with-react-fullstack-web-development/)

### Development environment

* The code of the React development server (/server/client) is stored as a subfolder of the backend server folder.
* In development, running `npm run dev` starts both backend and frontend (React) servers. This is achieved through use of the `concurrently` package, of which parameters are stored in the `scripts` section of `/server/package.json`.
* Hot reloading is managed by `nodemon` for the backend server, and by `create-react-app` for the React development server.
* React development server is to be reached on http://localhost:3000.
* Backend server is to be reached on http://localhost:5000.

### Production environment

* Hosted on heroku.com
*

## License

* If you want to use this app or a derivative in production, please inform me per email to `me@xiaoju.io`

## Contributing
