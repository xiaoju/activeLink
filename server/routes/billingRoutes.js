const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    const charge = await stripe.charges.create({
      amount: 12300,
      currency: 'eur',
      description: '123 EUR for order xxx.', // backend message
      source: req.body.token.id
    });
    console.log('BACKEND, received payload: ', req.body);
    // req.user.credits += 5;
    const user = await req.user.save();
    res.send(user);
  });
};
