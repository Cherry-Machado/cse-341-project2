// models/user.js
const { getDbInstance } = require('../data/database');

class User {
    constructor(id, displayName, username, profileUrl) {
        this.githubId = id;
        this.displayName = displayName;
        this.username = username;
        this.profileUrl = profileUrl;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    static async findOrCreate(profile) {
        const db = getDbInstance();
        const usersCollection = db.collection('users');
        
        // Find user by githubId
        const existingUser = await usersCollection.findOne({ githubId: profile.id });
        
        if (existingUser) {
            // Update data if neccesary
            await usersCollection.updateOne(
                { _id: existingUser._id },
                { $set: { updatedAt: new Date() } }
            );
            return existingUser;
        }

        // Creat new user if not exist
        const newUser = new User(profile);
        const result = await usersCollection.insertOne(newUser);
        return { ...newUser, _id: result.insertedId };
    }

    static async findById(id) {
        const db = getDbInstance();
        const usersCollection = db.collection('users');
        const ObjectId = require('mongodb').ObjectId;
        try {
            return await usersCollection.findOne({ 
                _id: new ObjectId(id) 
            });
        } catch (err) {
            console.error('Error finding user by ID:', err);
            return null;
        }
    }
}

module.exports = User;