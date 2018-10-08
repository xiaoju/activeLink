# activeLink

## Purpose

* ActiveLink is a free and open-source 'School Management System' currently solely focused on management of extracurricular activities: manage registrations to classes and payments.
* Typical users of activeLink are:
  * teachers: offer classes for kids, receive payments.
  * vendors: the organization behind a group of teachers, for example if the payments of these several teachers land onto the same bank account.
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

* github authentication:
  * create credentials for the activeLink app: github.com > profile menu, upper right of screen > settings > developper settings > OAuth Apps > New OAuth App > fill in the form:
    Homepage URL: http://localhost:3000
    Authorization callback URL: http://localhost:3000/auth/github/callback
    And copy the 'client ID' and 'Client Secret' to '/server/config/dev.js'

- clone the repository:
  `clone https://github.com/xiaoju/activeLink.git`
  `cd activeLink`

- add credentials for Google Developer and mlab projects, into a new `/config/dev.js` file, using same format as per `/config/dev_template.js`

- install:
  `npm install`

- start:
  `cd server`
  `npm run dev`

- A browser window should automatically open at http://localhost:3000

- Test credit card payments using the test number offered by Stripe, e.g. '4242 4242 4242 4242', as per https://stripe.com/docs/testing#cards.

- install for production

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

- create to heroku apps (staging and production), fed by the same github repo). Make them "remotes" for the github repo.

- push to production server on heroku:
`git subtree push --prefix server production master`

- push to heroku staging server:
`git subtree push --prefix server staging master`

- force push to heroku staging:
`git push staging `git subtree split --prefix server master`:master --force`

- create the assos collection inside your mlab MongoDB database, and create one document there with the content of `/server/models/assoSeed.json`

- check logs:
  `heroku logs --tail --remote production --source app`

- create also a first user, from inside your mlab interface:
old version:
```
{
  "primaryEmail": "jc@xiaoju.io",
  "admin": "true"
}
```

```
{
  "primaryEmail": "admin.name@example.com",
  "roles": {
    "platformMaster": true,
    "admin": ["a0"],
    "teacher": [],
    "parent": ["a0"]
    }
  }
```
// BUG this user gets "" as a UUID! Anyway, don't use an admin account to book classes!


### database backup
  - install mongoDB locally to get the mongodumb command:
    - on mac: `
      ```
      brew update
      brew install mongodb
      mongodump -h ds247347.mlab.com:47347 -d activelink-prod -u <user> -p <password> -o <output directory>
      ```

  - backup from production database to local folder:
    `mongodump -h dsxxxxxx.mlab.com:xxxxx -d <production_database_name> -u <user_name-prod-RO> -p <password> -o <local-folder>`

    where `user_name-prod-RO` is the name of a user with read-only rights on the production database `production_database_name`.

  - restore (for example restore to the -staging database)
    - delele all collections from the target database (`staging_database_name`), because mongorestore doesn't replace documents with same IDs.
    - restore
      - for mongoDB version older than 3.4:
    `mongorestore -h dsxxxxxx.mlab.com:xxxxx -d <staging_database_name> -u <user_name-staging-W> -p <password> <local-folder/production_database_name>`

      - for mongoDB version from 3.4:
    `mongorestore -h dsxxxxxx.mlab.com:xxxxx -d <staging_database_name> -u <user_name-staging-W> -p <password> <local-folder/production_database_name>`

  - see `/MongodbCommands.md` (outside of git version control) for commands including passwords.

## Architecture

### IDs
- Authentication is performed at 'family' level: it's a 'family' who authenticates to the app.
A 'family' consists of some 'parents' and 'kids'. In practice, this means that the parents and kids who want to connect to the app must communicate this one login and password set to each others.
- The 'family', each 'kid', and each 'parent' all got an separate IDs. We usually refer to these IDs as `familyId`, `kidId` and `parentId`.
- IDs are produced by the UUID4 package. For illustration in the documentation, we use shorter IDs, such as `k0`, `k1`, `p0`, `p1`, etc.

### proxy
/api/* and /auth/* routes are handled by the express server. Other routes are hanled by the react front end. As defined in /client/package.json (`proxy` section)

### folders structure
- The (`git`) root folder `/` contains `.gitignore`, `.prettierignore`, `README.md` and `TODO.md` .
- The app is stored in `/server`
- The react/redux part of the app is stored in /server/Client
- Don't mix up the package.json files from server and client. They are distinct:
  - Scripts in `/server/package.json` manage the app start, and `heroku` postbuild step.
  - Settings for proxying are in `/server/client/package.json`.
- To install packages to the client, the console must be opened in `/server/client`.

###
- Total price is calculated within the front end, to allow for a fast interface and avoid useless calls to the backend as each checkbox gets toggled.
- However the payment is based on a value calculated in the backend, based on the selected checkboxes (from frontend) and prices per item (from backend), to ensure the user cannot tinker with the amount to be paid.

### Variables derived from the Redux store
- Variables that are derived from the redux store aren't stored into the redux store itself, they are managed by selectors (see /client/scr/selectors).
- [reselect](https://github.com/reduxjs/reselect#motivation-for-memoized-selectors) is used for memoized selectors.

### redux store format:

`
...
`

### API

`/auth/google`          login through Google Oauth2 process

`/api/current_user`     retrieve user Id, etc

`/api/logout `          log out!

## initial seeding of Database
- using a mongoDB GUI like MongoHub or Robo3T, or from the management interface in mlabadd, create one `association` record, including one event and its items, as per example file `/server/models/assoSeed.json`.
- NB a .json file can be obtained from a .js by running JSON.stringify({object.js}) in the Chrome console.

## authentication process

## roles
- Some routes require `admin` property set to `true` for this `family`, as defined in `requireAdmin` Express middleware. The admin property must be set by editing manually the Mongo document.

### initial invitation
- platformManager goes to `/invite`, creates a list of "new parents", with their name, surname, email addresses (mandatory), kids info.
- then selects parents and clicks "send invitation".
- For each parent, a temporary password is created and stored (hashed+salted),
- and an invitation email is sent to parents with the clear text password inside a link (same kind of email as if parent asked to reset password)
- parent clicks link, and is logged in through his email + temporary password,
- which only give access to sign up page only.
- Parent arrives to signup page, there he chooses login method (email+password or social)
- then either logs in with social, either choose a new password,
- if social login works / a password got typed, then parent profile is updated

### normal log in
- click `sign in` (if signed in already, then this becomes a `members` menu)
- `/signin` opens
- user clicks social auth button or fills in email + password + click
- logged in! (or back to non-members page with a flash message)

### building the app
- build the front end, very basic, but all the pages: `/signin`, `/signup`, `/invite`, `/members`.
- create the routes.
- build the auth logic, starting with

  - simple /signup page:
    - needs email + password (from an email link) to access
    - link to /auth/github
- /auth/github/callback page

### pages content
- `/signin`:
  - form: `email`, `password` + `login` button
  - buttons for each social auth (Github, google, ...) (links to `/auth/github`, etc ) / ...
  - link back to non-members area
  - "forgot password" link to '/passwordLost'
  - link to `/requestInvitation`
- `/signup`
- `/requestInvitation`: a contact form for parents to request an invitation. Needs give name/surname of parent, phone number, email, and for each kid: number of kids in school, name/surname of kid, birth date of kid, class)
- `/members`: the landing page for members
  - 'Next events:' (cards, pulled from database)
  - link to `/invite` (only for platform masters: to invite parents to the platform)
  - link to `/profile` (to view and edit the information about me)
- `/invite`: only access for teachers (and platform master), to invite new parents to the platform
  - a form to upload a .txt list of emails (mandatory), name, surname, kids info.
  - show preview of the data
  - teachers validates, and data goes into database and invitation emails are sent out.


### Technology stack
- M.E.R.N.: Mango, Express, React (instead of Angular), Nodes.js
- N.E.R.D.: Node.js, Express, React... plus any Database (Mango or PostgreSQL)

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

## License

* If you want to use this app or a derivative in production, please inform me per email to `info@xiaoju.io`

## Contributing
### Style
- Mostly following [Udacity style guides](https://udacity.github.io/git-styleguide/).
### versioning
  - [Semantic versioning guidelines](http://semver.org/).
#### Git commits:
  - feat: a new feature
  - fix: a bug fix
  - docs: changes to documentation
  - style: formatting, missing semi colons, etc; no code change
  - refactor: refactoring production code
  - test: adding tests, refactoring test; no production code change
  - chore: updating build tasks, package manager configs, etc; no production code change
#### Linter
  - using Prettier
#### Redux
- Redux selectors are named `getFoo`.
- We use fat reducers and thin action creators (i.e. the reducers contain a lot of logic.)

#### Credits

- The app architecture is based on https://www.udemy.com/node-with-react-fullstack-web-development/learn/v4/overview by Stephen Grider.
- The code for local authentication is based on http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/ by Sahat Yalkabov.


#### Resources

- timeStamps generation: as long as generation of timestamps is not implemented within the app, just do it in console:
  `new Date(2018,9,30).getTime();`
  `new Date(1540854000000).toLocaleDateString('en-US', {  day : 'numeric',month : 'short',year : 'numeric'});`
  `Date.now()`

①②③④⑤⑥⑦⑧⑨⑩
🄌➊➋➌➍➎➏➐➑➒➓
