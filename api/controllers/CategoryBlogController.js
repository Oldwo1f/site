/**
 * CategoryBlogController
 *
 * @description :: Server-side logic for managing categoryblogs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var Promise = require('bluebird');
module.exports = {
	fetchAll:function(req,res,next) {
		var filter = {}
		filter.page = req.query.page || 1;
		filter.perPage = req.query.perPage || 10;
		filter.order = req.query.order || 'createdAt DESC';

		
		filter.slug = req.query.slug || '';

		async.parallel({
		    data:function(callback){
		    	// callback(null, 'emailOk');
		    		console.log('filterPage========================>' +filter.page);
		    		// {filename:{'contains':filter.slug}}
		    		// .sort(filter.order).limit(filter.perPage).skip(filter.perPage*filter.page-filter.perPage)
				CategoryBlog.find({name:{'contains':filter.slug}}).sort(filter.order).limit(filter.perPage).skip(filter.perPage*filter.page-filter.perPage).populateAll().exec(function (err,users){
					
					console.log('err==',err);
						if(err)
							callback(err)
						callback(null,users)
						// res.status(200).send({users:users,total:})
						
				});
		    },
		    count:function(callback){

		    	console.log('FIND DOCUMENTS');
		            CategoryBlog.count({name:{'contains':filter.slug}}).exec(function (err,count){
						if(err)
							callback(err)
						callback(null,count)
						// res.status(200).send({users:users,total:})
						
				});
		    }
		},
		function(err, results){
				
				// console.log(results);
			if(err){

				res.status(401).send(err);
			}
			else{

				res.status(200).send({data:results.data,total:results.count})
			}

			

		});

	},
	list:function(req,res,next) {
		  console.log('LIST');
				CategoryBlog.find().sort('name ASC').exec(function (err,datas){
					
					if(err){
						res.status(400).send(err);
					}
					else{
						console.log(datas);
						res.status(200).send(datas)
					}
						
				});
		   
		
	},
	
};

