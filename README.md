# activeLink

## Purpose

* ActiveLink is a free and open-source 'School Management System' currently solely focused on management of extracurricular activities: manage registrations to classes and payments.
* Typical users of activeLink are:
  * teachers: offer classes for kids, receive payments.
  * vendor: several teachers can be associated into a single 'vendor', for example if the payments land onto the same bank account.
  * parents: register their kids to classes, pay for the classes.
  * kids: attend the classes.
  * plaftormMaster: manages the platform.

## References

* ActiveLink is currently in use at following locations:
  * N/A

## Installation

* try online: https://activelink.herokuapp.com

Feel free to log in as teacher, parent or platformMaster, and create classes, register to them, send payments using Stripe test card (4242 4242 4242 4242), etc.

Access codes:
//TODO
platformMaster
teacher
parent
test credit card number

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

  * Test credit card payments using the test number offered by Stripe, e.g. '4242 4242 4242 4242', as per https://stripe.com/docs/testing#cards.

* install for production

  * prerequisites: accounts by GitHub, Heroku (for app hosting), Sprite (for payments handling), mlab (for database hosting) and google (for OAuth2 authentication)
  * setup Google+ API for OAuth2 authentication
  * setup the environment variables for development and production:

    * on the development machine:
      `/config/dev.js`
      `/.env.development`
      `/.env.production`
    * on the app hosting server:

      * Heroku.com menus: select the app, then `Settings` > `Config Variables` > `Reveal Config Vars` environment variables, etc.:
        * `cookieKey`: a-z 0-9 random string
        * `GOOGLE_CLIENT_ID`: refer to google development console (Google+ API)
        * `GOOGLE_CLIENT_SECRET`: refer to google development console (Google+ API)
        * `MONGO_URI`: from mlab project
        * `STRIPE_PUBLISHABLE_KEY`: pk_test_xxxxxx
        * `STRIPE_SECRET_KEY`: sk_test_xxxxxx

push to heroku:
`git subtree push --prefix server heroku master`

force push to heroku:
`git push heroku`git subtree split --prefix server master`:master --force`

## Architecture

### Technology stack

* N.E.R.D.: Node.js, Express, React... plus any Database (Mango or PostgreSQL)

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
