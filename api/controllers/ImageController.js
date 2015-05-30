var fs = require('fs'), Writable = require('stream').Writable;
var sid = require('shortid');
var easyimg = require('easyimage');
var IsThere = require("is-there");

module.exports={

	serveImage:function  (req,res,next) {


		console.log('SERVE IMG');
		var filePath = sails.config.PATH_TO_ADMIN+'uploads/'+req.params.size+'/'+req.params.name;
		// sails.log(filePath);
		console.log(filePath);
	    var stat = fs.statSync(filePath);
	    // setTimeout(function (argument) {
	    	res.writeHead(200, {
		        // 'Content-Type': 'image/',
		        'Content-Length': stat.size
		    });

		    var readStream = fs.createReadStream(filePath);
		    readStream.pipe(res);
	    // },500)
	    
	}

}
