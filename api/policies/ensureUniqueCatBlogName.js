var UAParser = require('ua-parser-js');


module.exports = function(req, res, next) {

  sails.log('ensureUniqueCatBlogName')
  var cat=req.body;


	CategoryBlog.findOne({name: cat.name }).exec(function (err,result){
		
		if(err){
	    	next();
			
		}else{

			if(typeof(result) !='undefined')
			{	
				res.status(400).send('exist');
			}else{

				next();
			}
		}

	});


 

};		  