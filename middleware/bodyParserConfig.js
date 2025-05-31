const bodyParser = require('body-parser');

exports.jsonParser = bodyParser.json({
  strict: true,
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf.toString());
    } catch (e) {
      const error = new SyntaxError('Invalid JSON');
      error.status = 400;
      error.type = 'invalid_json';
      throw error;
    }
  }
});

exports.urlencodedParser = bodyParser.urlencoded({ extended: true });