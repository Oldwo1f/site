var jwt = require('jwt-simple');

module.exports = function(req, res, next) {
  sails.log('ensure AUTH')

  // if(req.socket){
  //   console.log('SOCKET CALL');
  //   console.log('<<<<<<<<<<<<<<<<------------');
  //   console.log('route',req.route.path);
  //   console.log('header',req.headers);
  // }
  console.log(req.headers.authorization);
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, sails.config.TOKEN_SECRET);

  if (payload.exp <= Date.now()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  // sails.log(payload.sub);
  req.user = payload.sub;
  next();
};
