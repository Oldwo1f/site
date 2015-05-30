var nodemailer = require('nodemailer');
var moment = require('moment');
module.exports={
	login:function(req,res) {

		console.log(sails.config.TOKEN_SECRET);
		// function createToken(req, user,data) {
		//   var payload = {
		//     iss: req.hostname,
		//     data:data,
		//     sub: user.id,
		//     iat: moment().valueOf(),
		//     exp: moment().add(14, 'days').valueOf()
		//   };
		//   return jwt.encode(payload, sails.config.TOKEN_SECRET);
		// }
		// var errormes = res.__('Erreur d\'email ou de mots de passe');
 	// 	User.findOne({ email: req.body.email }).exec(function(err, user) {
		//     if (!user) {
		//       return res.status(401).send({ message: errormes});
		//     }
		//     user.comparePassword(req.body.password, function(err, isMatch) {
		//       if (!isMatch) {
		//         return res.status(401).send({ message: errormes});
		//       }
		//       var d={};
		//       if(user.role=='admin' || user.role=='user')
		//       		d.intern=true;

		//       d.role=user.role;
		//       res.send({ token: createToken(req, user,d) });
		//     });
	 //  	});
	},
	
}
