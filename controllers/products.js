const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId; // This is the Id assigned automatically by MDB. 


const getAll = async (req, res) => {
    //#swagger.tags=["Products"];
    const result = await mongodb.getDatabase().db().collection('products').find();
    result.toArray().then((products) => {
        res.setHeader('Content-Type','application/json');
        res.status(200).json(products);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=["Products"];
    const productId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('products').find({ '_id': productId });
    result.toArray().then((products) => {
        res.setHeader('Content-Type','application/json');
        res.status(200).json(products[0]);
    });
};

const createProduct = async (req, res) => {
    //#swagger.tags=["Products"];
    const product = {
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category,
        isAvailable: req.body.isAvailable,
        specifications: req.body.specifications
    }
    const response = await mongodb.getDatabase().db().collection('products').insertOne(product);
    if (response.acknowledged > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the product.');
    }
};

const updateProduct = async (req, res) => {
    //#swagger.tags=["Products"];
    const productId = new ObjectId(req.params.id);
    const product = {
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category,
        isAvailable: req.body.isAvailable,
        specifications: req.body.specifications
    }
    const response = await mongodb.getDatabase().db().collection('products').replaceOne({ '_id': productId }, product);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the product.');
    }
};

const deleteProduct = async (req, res) => {
    //#swagger.tags=["Products"];
    const productId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('products').deleteOne({ '_id': productId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the product.');
    }
};


module.exports = {
    getAll,
    getSingle,
    createProduct,
    updateProduct,
    deleteProduct
}