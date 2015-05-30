/**
* Comment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,
  	attributes: {
  		author:{type:'string',required:true},
  		email:{type:'string',required:true,email:true},
  		content:{type:'text',required:true},
  		status:{type:'string',required:true},
  		article: {
			model: 'article',
		},
		project:{
			model:'project'
		},
		reponses: {
			collection: 'reponse',
			via:'comment'
		}
	},
  	beforeDestroy: function (values, cb) {
   		Comment.findOne(values.where.id).populateAll().exec(function(err,item) {
			async.map(item.reponses,
			function(rep, callback){
			        if(rep){
			        	Reponse.destroy(rep.id,function(err,data) {
			        		callback(null)
			        	})
			        }
			        else{
				        callback(null)
			        }
			},
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

