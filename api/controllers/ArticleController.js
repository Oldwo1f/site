/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var Q = require('q')
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
				Article.find({title:{'contains':filter.slug}}).populateAll().sort(filter.order).limit(filter.perPage).skip(filter.perPage*filter.page-filter.perPage).exec(function (err,items){
					
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
							async.map(items,
							function(item,cb) {
								// console.log('item',item);
								async.map(item.images,
								function(item1,cb1) {
									// console.log('item1',item1);
									Image.findOne(item1.image).exec(function(err,data) {
										item1.image=data
										cb1(null,item1)
									})

								},function(err, results) {
									// console.log('results',results);
									cb(null,results)
								})
							},
							function(err,datas) {
								callback(null,items);
							})
						}else{
							callback(null)
						}
						
				});
				// Article.find({title:{'contains':filter.slug}}).populateAll().sort(filter.order).limit(filter.perPage).skip(filter.perPage*filter.page-filter.perPage).then(function(articles) {
				    
				// 	console.log('ids images',_.pluck(articles.images, 'image'));
				//     var images = Image.find({
				//         id: _.pluck(articles.images, 'image')
				//       })
				//       .then(function(images) {
				//         return images;
				//       });
				//     return [articles, images];
				// })
				// .spread(function(articles, images) {
				//     var images = _.indexBy(images, 'id');
				//     //_.indexBy: Creates an object composed of keys generated from the results of running each element of the collection through the given callback. The corresponding value of each key is the last element responsible for generating the key
				//     articles.comments = _.map(post.comments, function(comment) {
				//       comment.user = images[comment.user];
				//       return comment;
				//     });
				//     callback(null,post);
				// })
				// .catch(function(err) {
				//     if (err) {
				//       callback(err);
				//     }
				// });
		    },
		    count:function(callback){

		            Article.count({title:{'contains':filter.slug}}).exec(function (err,count){
						if(err)
							callback(err)
						callback(null,count)
						
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
	fetch:function(req,res,next) {
		
		console.log("FETCH ONE ARTICLE");
		
				Article.find(req.params.id).populateAll().exec(function (err,items){
					
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
								var article= items[0];
								// console.log('item',item);
								async.series({
								image:function(cbparalelle) {
									async.map(article.images,
									function(item1,cb1) {
										// console.log('item1',item1);
										Image.findOne(item1.image).exec(function(err,data) {
											item1.image=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								document:function(cbparalelle) {
									async.map(article.documents,
									function(item1,cb1) {
										// console.log('item1',item1);
										Document.findOne(item1.document).exec(function(err,data) {
											item1.document=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								comment:function(cbparalelle) {
											console.log('------------------------------');
											// console.log(article.comments);
											var allcomments = [];
									async.mapSeries(article.comments,
									function(item1,cb1) {
										console.log('item1',item1);
										Comment.find(item1.id).populate('reponses').exec(function(err,data) {
											// item1.comment=data
											console.log(data);
											console.log('------------------------------');
											// console.log(article.comments.indexOf(item1));
											// item1=data
											// article.comments.splice(article.comments.indexOf(item1),1,data[0])
											allcomments.push(data[0])
											// console.log(data);
											cb1(null,item1)
										})

									},function(err, results) {
										
										article.comments=allcomments;
										console.log('allcomments',allcomments);
										cbparalelle(null,allcomments)
									})
								}},function(err,ress) {

 										console.log('DELETE');
									if(article.category)
										article.category=article.category.id;
									if(article.author)
										article.author=article.author.id;

									var articletogo = _.clone(article)

									delete articletogo.comments
									articletogo.comments=ress.comment
									console.log(articletogo.comments);
									console.log(articletogo);
									console.log('Final Data');
									console.log('fetch ONE Article', articletogo);
									res.status(200).send(articletogo)
								})
								
							}
							
								
								// callback(null,items);

	
						
				});
		
		   
	},
	list:function(req,res,next) {
		  console.log('LIST');
				Article.find().sort('name ASC').exec(function (err,datas){
					
					if(err){
						res.status(400).send(err);
					}
					else{
						console.log(datas);
						res.status(200).send(datas)
					}
						
				});
		   
		
	}
};

