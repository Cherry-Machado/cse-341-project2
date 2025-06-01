const mongodb = require('../data/database');
const { validateObjectId } = require('../utils/validate');
const { NotFoundError } = require('../errors/databaseErrors');
const validateCustomer = require('../schemas/customerSchema');

const getAll = async (req, res, next) => {
    //#swagger.tags=["Customers"];
    try {
        const result = await mongodb.getDatabase().db().collection('customers').find();
        const customers = await result.toArray();
        res.setHeader('Content-Type','application/json');
        res.status(200).json(customers);
    } catch (error) {
        next(error);
    }
};

const getSingle = async (req, res, next) => {
    //#swagger.tags=["Customers"];
    try {
        const customerId = validateObjectId(req.params.id);
        const customer = await mongodb.getDatabase().db().collection('customers').findOne({ '_id': customerId });
        if (!customer) {
            throw new NotFoundError('customer');
        }
        res.setHeader('Content-Type','application/json');
        res.status(200).json(customer);
    } catch (error) {
        next(error);
    }
};

const createCustomer = async (req, res, next) => {
    //#swagger.tags=["Customers"];
    try {
        const customerData = validateCustomer(req.body);
        const response = await mongodb.getDatabase().db().collection('customers').insertOne(customerData);
        if (response.acknowledged) {
            res.status(201).json({ id: response.insertedId });
        } else {
            throw new Error('Error al crear el cliente');
        }
    } catch (error) {
        next(error);
    }
};

const updateCustomer = async (req, res, next) => {
    //#swagger.tags=["Customers"];
    try {
        const customerId = validateObjectId(req.params.id);
        const customerData = validateCustomer(req.body);
        const response = await mongodb.getDatabase().db().collection('customers').replaceOne({ '_id': customerId }, customerData);
        if (response.modifiedCount === 0) {
            throw new NotFoundError('customer');
        }
        res.status(200).send();
    } catch (error) {
        next(error);
    }
};

const deleteCustomer = async (req, res, next) => {
    //#swagger.tags=["Customers"];
    try {
        const customerId = validateObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('customers').deleteOne({ '_id': customerId });
        if (response.deletedCount === 0) {
            throw new NotFoundError('customer');
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getSingle,
    createCustomer,
    updateCustomer,
    deleteCustomer
};