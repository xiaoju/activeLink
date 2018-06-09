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

push to heroku:
`git subtree push --prefix server heroku master`

force push to heroku:
`git push heroku`git subtree split --prefix server master`:master --force`

## Architecture

- Total price is calculated within the front end, to allow for a fast interface and avoid useless calls to the backend as each checkbox gets toggled.
- However the payment is based on a value calculated in the backend, based on the selected checkboxes (from frontend) and prices per item (from backend), to ensure the user cannot tinker with the amount to be paid.


- redux store format:


selectionReducer = {
  total: 30,
  kid1: {
    r1: false,
    r2: false,
    r3: false,
    r4: false,
    r5: false,
    r6: false,
    r7: false
  },
  kid2: {
    r1: false,
    r2: false,
    r3: false,
    r4: false,
    r5: false,
    r6: false,
    r7: false
  }

authReducer = {
  parents: {
    parent1: {
      id: 'parent1',
      kids: ['kid1', 'kid2'],
      firstName: 'Jerome',
      familyName: 'Obama',
      hashedPassword: 'qwerty',
      email: 'obama@xiaoju.io',
      googleId: '123123123123123'
    }
  },
  kids: {
    kid1: {
      id: 'kid1',
      parents: ['parent1'],
      firstName: 'Mulan',
      familyName: 'Obama',
      grade: 'CE2'
    },
    kid2: {
      id: 'kid2',
      parents: ['parent1'],
      firstName: 'Zilan',
      familyName: 'Trump',
      grade: 'GS'
    }
  },
  events: {
    e01: {
      id: 'e01',
      name: 'This is the title',
      items: ['r0', 'r1'],
      instructions: [
        'line 1',
        'line 2',
      ]
    }
  },
  items: {
    r0: {
      id: 'r0',
      name: 'Registration to the association',
      description:
        'The registration to the English Link association is required to join the activities.',
      priceFamily: 30,
      mandatory: true
    },
    r1: {
      id: 'r1',
      name: 'English classes in GS',
      tags: ['2018-2019', 'class'],
      position: 1,
      grades: ['GS'],
      description:
        'English Classes for bilingual kids of Grande Section. Twice 45 min a week during class time. Price includes books and other learning materials. The discounted price is applicable starting from the second kid of a same family who join the english classes in maternelle or primary.',
      priceFirstKid: 225,
      priceSecondKid: 165,
      teacherName: 'Donald Obama'
    }
  }
}




## authentication process

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
