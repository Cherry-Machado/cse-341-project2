const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

let database;
let client;

const initDb = async (callback) => {
    if (database) {
        console.log('Database is already initialized!');
        return callback(null, database);
    }
    
    try {
        client = await MongoClient.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000
        });

        database = client;
        const db = client.db();

        // Crear colecciones necesarias
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        if (!collectionNames.includes('users')) {
            await db.createCollection('users');
            await db.collection('users').createIndex({ githubId: 1 }, { unique: true });
            console.log('Created "users" collection with index');
        }

        if (!collectionNames.includes('sessions')) {
            await db.createCollection('sessions');
            console.log('Created "sessions" collection');
        }

        callback(null, database);
    } catch (err) {
        console.error('Database connection failed:', err);
        callback(err);
    }
};

const getDatabase = () => {
    if (!database) {
        throw new Error('Database not initialized');
    }
    return database;
};

const getDbInstance = () => {
    if (!database) {
        throw new Error('Database not initialized');
    }
    return database.db();
};

// Cierre limpio de la conexión
process.on('SIGINT', async () => {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    }
});

module.exports = {
    initDb,
    getDatabase,
    getDbInstance
};