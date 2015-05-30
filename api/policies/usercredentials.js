var UAParser = require('ua-parser-js');


module.exports = function(req, res, next) {
  sails.log(' usercredentials')
  var user=req.body;
async.parallel([
		    function(callback){
		    	// callback(null, 'emailOk');
		    		User.findOne({email: user.email }).exec(function (err,result){
		    			console.log(result);
			            if(err){
			            	callback(null, 'emailOk');
							
						}else{

							if(typeof(result) !='undefined')
							{	
								callback('emailError');
							}else{

								callback(null, 'emailOk');
							}
						}

					});
		    },
		    function(callback){
		            User.findOne({pseudo: user.pseudo }).exec(function (err,result){
		            	console.log(result);
		            	console.log("checkpseudoerr");
		            	console.log(err);
		            	if(err){
			            	callback(null, 'pseudoOk');
							
						}else{

							if(typeof(result) !='undefined')
							{	
								callback('pseudoError');
							}else{

								callback(null, 'pseudoOk');
							}
						}

					});
		    }
		],
		function(err, results){
				console.log('parrarell error');
				console.log(err);
				console.log(results);
			if(err){

				res.status(401).send(err);
			}
			else{
				next();
			}

			

		});

 

};		  