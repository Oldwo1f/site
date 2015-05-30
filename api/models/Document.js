/**
* Document.js
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
  		description:{type:'text',defaultsTo:''},
  		date:{type:'date'},
  		nbDowload:{type:'int'},
  		size:{type:'int'},
  		type:{type:'string'},
  		tags:{collection:'tag'},
  		articles: {
            collection: 'documentarticle',
            via:'document'
        },
  		
	},
  	beforeDestroy: function (values, cb) {
  // 		console.log(values);
   		Document.findOne(values.where.id).populateAll().exec(function(err,item) {
		// 	console.log('-------------------------------------------------------');
		// 	console.log(img);



			async.parallel([

				function(callback){
			        
			        
			     	Documentarticle.find({document:item.id}).exec(function(err,res) {
			        	console.log(res);
			        	console.log(err);
			        	async.each(res, function(docarticle, cb2) {

			        		Documentarticle.destroy(docarticle.id).then(function() {
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

				},function(callback2){
			        
			        
			     	async.map(item.tags,function(rep, callback){
					      if(rep){
					        Tag.findOne(rep.id,function(err,data) {
					          if(data){
					            data.nbDocuments=Number(data.nbDocuments)-1
					            data.save(function() {
					              callback(null)
					            })
					          }
					        })
					      }
					      else{
					        callback(null)
					      }

					},function() {
						callback2(null)

					})

				},
				function(callback){
					try{
				        fs.unlink('uploads/files/'+item.filename)
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

