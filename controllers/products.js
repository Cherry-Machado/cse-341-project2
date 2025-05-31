// controllers/products.js
const mongodb = require('../data/database');
const { validateObjectId } = require('../utils/validate');
const { NotFoundError } = require('../errors/databaseErrors');
const { validateProduct, validateProductUpdate } = require('../schemas/productSchema');

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
        // Add validation here
        const validatedData = validateProduct(req.body);
        
        const response = await mongodb.getDatabase().db().collection('products').insertOne(validatedData);
        
        if (response.acknowledged) {
            res.status(201).json({ 
                id: response.insertedId,
                message: 'Product created successfully'
            });
        } else {
            throw new Error('Failed to create product');
        }
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    //#swagger.tags=["Products"];
    try {
        const productId = validateObjectId(req.params.id);
        
        // Add validation here
        const validatedData = validateProductUpdate(req.body);
        
        const response = await mongodb.getDatabase().db().collection('products').replaceOne({ '_id': productId }, validatedData);
        
        if (response.modifiedCount === 0) {
            throw new NotFoundError('validateData');
        }
        
        res.status(200).json({ 
            message: 'Product updated successfully'
        });
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