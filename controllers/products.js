const mongodb = require('../data/database');
const { validateObjectId } = require('../utils/validate');
const { NotFoundError } = require('../errors/databaseErrors');

const getAll = async (req, res, next) => {
    //#swagger.tags=["Products"];
    try {
        const result = await mongodb.getDatabase().db().collection('products').find();
        const products = await result.toArray();
        res.setHeader('Content-Type','application/json');
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

const getSingle = async (req, res, next) => {
    //#swagger.tags=["Products"];
    try {
        const productId = validateObjectId(req.params.id);
        const product = await mongodb.getDatabase().db().collection('products').findOne({ '_id': productId });
        if (!product) {
            throw new NotFoundError('product');
        }
        res.setHeader('Content-Type','application/json');
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    //#swagger.tags=["Products"];
    try {
        const product = {
            name: req.body.name,
            brand: req.body.brand,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
            isAvailable: req.body.isAvailable,
            specifications: req.body.specifications
        };
        const response = await mongodb.getDatabase().db().collection('products').insertOne(product);
        if (response.acknowledged) {
            res.status(201).json({ id: response.insertedId });
        } else {
            throw new Error('Error al crear el producto');
        }
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    //#swagger.tags=["Products"];
    try {
        const productId = validateObjectId(req.params.id);
        const product = {
            name: req.body.name,
            brand: req.body.brand,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
            isAvailable: req.body.isAvailable,
            specifications: req.body.specifications
        };
        const response = await mongodb.getDatabase().db().collection('products').replaceOne({ '_id': productId }, product);
        if (response.modifiedCount === 0) {
            throw new NotFoundError('product');
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    //#swagger.tags=["Products"];
    try {
        const productId = validateObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('products').deleteOne({ '_id': productId });
        if (response.deletedCount === 0) {
            throw new NotFoundError('product');
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getSingle,
    createProduct,
    updateProduct,
    deleteProduct
};