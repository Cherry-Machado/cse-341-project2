const router = require('express').Router();

const productsControllers = require('../controllers/customers');

router.get('/', productsControllers.getAll);

router.get('/:id', productsControllers.getSingle);

router.post('/', productsControllers.createProduct);

router.put('/:id', productsControllers.updateProduct);

router.delete('/:id', productsControllers.deleteProduct);

module.exports = router;