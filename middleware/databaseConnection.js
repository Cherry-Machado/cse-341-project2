const mongodb = require('../data/database');

exports.initDatabase = (app, port) => {
  mongodb.initDb((err) => {
    if (err) {
      console.error('Database connection failed:', err);
      process.exit(1);
    } else {
      app.listen(port, () => {
        console.log(`Database is listening and Node running on port ${port}`);
      });
    }
  });
};