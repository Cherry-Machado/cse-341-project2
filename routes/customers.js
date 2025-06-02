const router = require('express').Router();
const customersControllers = require('../controllers/customers');
const isAuthenticated = require('../middleware/authenticate'); 

router.get('/', customersControllers.getAll);

router.get('/:id', customersControllers.getSingle);

router.post('/', isAuthenticated, customersControllers.createCustomer);

router.put('/:id', isAuthenticated, customersControllers.updateCustomer);

router.delete('/:id', isAuthenticated, customersControllers.deleteCustomer);

module.exports = router;