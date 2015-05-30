/**
* Image.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var fs = require('fs'), Writable = require('stream').Writable;
module.exports = {
	schema: true,
  	attributes: {
  		filename:{type:'string',required:true},
  		name:{type:'string',required:true},
  		alt:{type:'text'},
  		size:{type:'int'},
  		type:{type:'string'},
  		index:{type:'float'},
  		
        articles: {
            collection: 'imagearticle',
            via:'image'
        },
  // 		user: {
		// 	model: 'user',
		// },
  // 		article: {
		// 	model: 'article',
		// },
  // 		projectcategory: {
		// 	model: 'categoryProject',
		// },
  // 		project: {
		// 	model: 'project',
		// },
  // 		galery: {
		// 	model: 'galery',
		// },
  // 		ingredient: {
		// 	model: 'ingredient',
		// }
	},
  	beforeDestroy: function (values, cb) {
  // 		console.log(values);
   		Image.findOne(values.where.id).populateAll().exec(function(err,img) {
		// 	console.log('-------------------------------------------------------');
		// 	console.log(img);



			async.parallel([
				function(callback){
			        
			        
			        

			        	console.log('-------------------------------------------------img.user');
			        	
				        Imagearticle.find({image:img.id}).exec(function(err,res) {
				        	console.log(res);
				        	console.log(err);
				        	async.each(res, function(imagearticle, cb2) {

				        		Imagearticle.destroy(imagearticle.id).then(function() {
				        			cb2(null);
				        		})
				        		
							  
							}, function(err){
							    // if( err ) {
							    //   console.log('A file failed to process');
							    // } else {
							    //   	console.log('All files have been processed successfully');
				        			callback(null)

							    // }
							});
				        });




			    },
		
			    function(callback){
					try{
			            fs.unlink('uploads/originalsize/'+img.filename)
			        }catch(e){

			        }
			        callback(null)
			    },
		
			    function(callback){
					try{
			            fs.unlink('uploads/adminThumbs/'+img.filename)
			        }catch(e){

			        }
			        callback(null)
			    }
			],
			// optional callback
			function(err, results){
				if (err) {
					console.log('ERRRRRRRROR');
					sails.log(err)
				};
			    // the results array will equal ['one','two'] even though
			    // the second function had a shorter timeout.
			    return cb();
			});

		});
  	}
};

