const router = require('express').Router();

const customersControllers = require('../controllers/customers');

router.get('/', customersControllers.getAll);

router.get('/:id', customersControllers.getSingle);

router.post('/', customersControllers.createCustomer);

router.put('/:id', customersControllers.updateCustomer);

router.delete('/:id', customersControllers.deleteCustomer);

module.exports = router;