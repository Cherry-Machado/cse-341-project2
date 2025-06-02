const router = require('express').Router();
const productsControllers = require('../controllers/products');
const isAuthenticated = require('../middleware/authenticate'); 

router.get('/', productsControllers.getAll);

router.get('/:id', productsControllers.getSingle);

router.post('/', isAuthenticated, productsControllers.createProduct);

router.put('/:id', isAuthenticated, productsControllers.updateProduct);

router.delete('/:id', isAuthenticated, productsControllers.deleteProduct);

module.exports = router;