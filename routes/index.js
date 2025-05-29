const router = require('express').Router();
router.use('/', require('./swagger'));

//#swagger.tags=["Hello World"];
router.get('/', (req, res) => {res.send('Welcome to my Store Project!')});

router.use('/customers', require('./customers'));
router.use('/products', require('./products'));

module.exports = router;