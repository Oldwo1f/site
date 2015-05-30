/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
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
				Project.find({title:{'contains':filter.slug}}).populateAll().sort(filter.order).limit(filter.perPage).skip(filter.perPage*filter.page-filter.perPage).exec(function (err,items){
					
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
				// Project.find({title:{'contains':filter.slug}}).populateAll().sort(filter.order).limit(filter.perPage).skip(filter.perPage*filter.page-filter.perPage).then(function(projects) {
				    
				// 	console.log('ids images',_.pluck(projects.images, 'image'));
				//     var images = Image.find({
				//         id: _.pluck(projects.images, 'image')
				//       })
				//       .then(function(images) {
				//         return images;
				//       });
				//     return [projects, images];
				// })
				// .spread(function(projects, images) {
				//     var images = _.indexBy(images, 'id');
				//     //_.indexBy: Creates an object composed of keys generated from the results of running each element of the collection through the given callback. The corresponding value of each key is the last element responsible for generating the key
				//     projects.comments = _.map(post.comments, function(comment) {
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

		            Project.count({title:{'contains':filter.slug}}).exec(function (err,count){
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
		
				Project.find(req.params.id).populateAll().exec(function (err,items){
					
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
								var project= items[0];
								// console.log('item',item);
								async.series({
								image:function(cbparalelle) {
									async.map(project.images,
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
									async.map(project.documents,
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
											// console.log(project.comments);
											var allcomments = [];
									async.mapSeries(project.comments,
									function(item1,cb1) {
										console.log('item1',item1);
										Comment.find(item1.id).populate('reponses').exec(function(err,data) {
											// item1.comment=data
											console.log(data);
											console.log('------------------------------');
											// console.log(project.comments.indexOf(item1));
											// item1=data
											// project.comments.splice(project.comments.indexOf(item1),1,data[0])
											allcomments.push(data[0])
											// console.log(data);
											cb1(null,item1)
										})

									},function(err, results) {
										
										project.comments=allcomments;
										console.log('allcomments',allcomments);
										cbparalelle(null,allcomments)
									})
								}},function(err,ress) {

 										console.log('DELETE');
									if(project.category)
										project.category=project.category.id;
									if(project.author)
										project.author=project.author.id;

									var projecttogo = _.clone(project)

									delete projecttogo.comments
									projecttogo.comments=ress.comment
									console.log(projecttogo.comments);
									console.log(projecttogo);
									console.log('Final Data');
									console.log('fetch ONE Project', projecttogo);
									res.status(200).send(projecttogo)
								})
								
							}
							
								
								// callback(null,items);

	
						
				});
		
		   
	},
	list:function(req,res,next) {
		  console.log('LIST');
				Project.find().sort('name ASC').exec(function (err,datas){
					
					if(err){
						res.status(400).send(err);
					}
					else{
						console.log(datas);
						res.status(200).send(datas)
					}
						
				});
		   
		
	},
	add:function  (req,res,next) {
		console.log('ADD ARTICLE');
		

		if(req.body)
		{
			var tags = req.body.tags;
			delete req.body.tags;
			console.log('images',req.body.images);
			if(req.body.images.length>0)
			{
						var imagesId = _.pluck(req.body.images,'id');
						console.log(imagesId);
						delete req.body.images;
			}
			if(req.body.documents.length>0)
			{
						var documentsId = _.pluck(req.body.documents,'id');
						console.log(documentsId);
						delete req.body.documents;
			}
			req.body.author = req.user;
			Project.create(req.body).exec(function (err,project) {
				if(err)
					res.status(400).send(err)

				async.parallel({
				    tags: function(callback){
				        if(tags)
						{
							async.map(tags,function (item, callback) {
								console.log('for',item);
								Tag.find({text:item.text}).exec(function (err,data) {
									console.log('data1',data);
									if(data.length==0)
									{
										Tag.create(item).exec(function (err,data) {
											if(err)
												callback(err)

											console.log('datacreated',data);
											callback(null,data)
										})
									}else{
										console.log('callbackExist');
										callback(null,data[0])
									}

								})

							},function (err,results) {
								if(err)
									callback(err)

								for(var i in results)
								{
									if(!_.contains(_.pluck(project.tags, 'id'),results[i].id)){
										project.tags.add(results[i]);
										results[i].nbProjects= Number(results[i].nbProjects)+1;
										results[i].save(function (err,data) {
											console.log(data);
										})
									}
								}
								console.log('project.tags.length:',project.tags.length);
								for(var i=0; i< project.tags.length;i++)
								{

									console.log('data.tags[i].text',project.tags[i].text , 'id:',project.tags[i].id);
									if(!_.contains(_.pluck(tags,'text'),project.tags[i].text)){
										project.tags.remove(project.tags[i].id);
										Tag.find(project.tags[i].id).exec(function (err,tag) {
											console.log('tag',tag);
											tag=tag[0]
											tag.nbProjects= Number(tag.nbProjects)-1;
											tag.save(function (err,data) {
												console.log(data);
											})
										})
									}
								}

								console.log('------------------------');
								
								project.save(function (err,data) {
								if(err)
									callback(err)
									// res.status(400).send(err)
									// res.status(200).send(project)
									callback(null,project)
								});
							})
							
							
						}else{
							callback(null,[])
						}
				    },
				    images: function(callback){
				        if(imagesId)
						{
							async.map(imagesId,function (id, callback) {
								console.log('for',id);
								Image.findOne(id).exec(function (err,img) {
									
									if(err)
										console.log('error find img',err);

									Imagearticle.create({rank:Number(imagesId.indexOf(id))}).exec(function(err,imageproject) {
										if(err)
										console.log('error create jointable',err);
										console.log('ImageProjectcreated',img);
										project.images.add(imageproject);
										project.save(function(err,result) {
											if(err)
												console.log('error save project',err);
											img.projects.add(imageproject);
											img.save(function(err,result) {
												if(err)
													console.log('error save img',err);
												callback(null,img)
											})
										})

									})

								})

							},function (err,results) {
								if(err)
									callback(err)

								console.log(results);
								callback(null,[])
							})
							
							
						}else{
							callback(null,[])
						}
				    },
				    documents: function(callback){
				        if(documentsId)
						{
							async.map(documentsId,function (id, callback) {
								console.log('for',id);
								Document.findOne(id).exec(function (err,doc) {
									
									if(err)
										console.log('error find img',err);

									Documentarticle.create({rank:Number(documentsId.indexOf(id))}).exec(function(err,documentproject) {
										if(err)
										console.log('error create jointable',err);
										console.log('DocumentProjectcreated',doc);
										project.documents.add(documentproject);
										project.save(function(err,result) {
											if(err)
												console.log('error save project',err);
											doc.projects.add(documentproject);
											doc.save(function(err,result) {
												if(err)
													console.log('error save img',err);
												callback(null,doc)
											})
										})

									})

								})

							},function (err,results) {
								if(err)
									callback(err)

								console.log(results);
								callback(null,[])
							})
							
							
						}else{
							callback(null,[])
						}
				    },
				    category: function(callback){
				        if(req.body.category)
						{
							

									CategoryProject.findOne(req.body.category).exec(function(err,category) {
										
										category.nbProjects= Number(category.nbProjects)+1;
										category.save(function(err,category1) {
											if(err)
												console.log('error save project',err);
									
												callback(null,category1)
											
										})

									})

							
						}else{
							callback(null,[])
						}
				    }
				},
				function(err, results) {
				    // results is now equals to: {one: 1, two: 2}
				    if(err)
				    	console.log('final err',err);

				    console.log(results);

				    Project.find(project.id).populateAll().exec(function(err,data) {
				    	if(err)res.status(200).send(err)

				    		console.log(data);
				    	Notification.create({type:'projectcreated',status:'ok',info1:req.body.title,info2:'par '+data[0].author.pseudo}).exec(function (err,notif){
				    		if(err)
				    			console.log(err);
				    		notif.users.add(req.user);
				    		notif.save()
				    		console.log('notif',notif);
				    	})
				    	res.status(200).send(data)
				    })
				});
				
				
				// else
				// {
					
				// 	res.status(200).send(data)
					
				// }

				// res.status(200).send(data);
			})
		}
	},

	update:function (req,res,next) {
		
		console.log('EDIT ARTICLE');
		if(req.body)
		{
			var tags = req.body.tags;
			var imagesTab = req.body.images;
			var documentsTab = req.body.documents;
			var commentsTab = req.body.comments;
			var translations = req.body.translations;
			var oldcategory = '';
			// console.log(req.body);
			console.log(req.body.id);

			return Promise.bind({})
			.then(function find_project(){
			    return Project.findOne(req.body.id).populateAll()
			})
			.then(function save_project(oldproject){
				this.oldcategory=false;
				if(typeof(oldproject.category)=='object')
					this.oldcategory = oldproject.category.id
			    this.project = oldproject;
			    oldproject.title= req.body.title;
			    oldproject.content= req.body.content;
			    oldproject.shortcontent= req.body.shortcontent;
			    oldproject.description= req.body.description;
			    oldproject.rewriteurl= req.body.rewriteurl;
			    oldproject.keyword= req.body.keyword;
			    oldproject.date= req.body.date;
			    console.log('here');
			    oldproject.category= req.body.category;
			        console.log('here2');
			    oldproject.author= req.body.author;
			    oldproject.status= req.body.status;
			    oldproject.publishVideo= req.body.publishVideo;
			    // console.log(req.body.activeComent);
			    oldproject.activeComent= req.body.activeComent;
			    oldproject.video= req.body.video;
			    return this.project.save()
			    
			})
			.then(function(projectsaved) {
				var oldCat = this.oldcategory
				this.project = projectsaved;
				return new Promise(function(resolve,rej){
					if(oldCat){
						return CategoryProject.findOne(oldCat).then(function(category) {
							category.nbProjects= Number(category.nbProjects)-1;
							return category.save(function() {resolve(true)})
						})
					}else{
			        	resolve(true)
						
					}
			    });
				
			}).then(function() {
				if(this.project.category){
					return CategoryProject.findOne(this.project.category.id).then(function(category) {
						category.nbProjects= Number(category.nbProjects)+1;
						return category.save(function(saved) { console.log('saved :',saved);
							return true;})
					})
				}else{
					return true;
				}
			})
			
			.then(function find_or_create_tags(savedproject) {
				// console.log('savedproject',savedproject);
				
				return Promise.map(tags,function(tag){
			        return Tag.findOrCreate({text:tag.text},tag);
			    })
			})
			.then(function link_tag_to_project(foundTags){
			     var thisProject = this.project;
			    _.forEach(foundTags,function(tag){

			    	if(!_.contains(_.pluck(thisProject.tags, 'id'),tag.id)){
						thisProject.tags.add(tag);
						tag.nbProjects= Number(tag.nbProjects)+1;
						tag.save(function (err,data) {
						})
					}

			    });
			    for(var i=0; i< thisProject.tags.length;i++)
				{

					if(!_.contains(_.pluck(tags,'text'),thisProject.tags[i].text)){
						// console.log('-----------------------------------------------------');
						thisProject.tags.remove(thisProject.tags[i].id);
						Tag.find(thisProject.tags[i].id).exec(function (err,tag) {
							// console.log('tag',tag);
							tag=tag[0]
							tag.nbProjects= Number(tag.nbProjects)-1;
							tag.save(function (err,data) {
		
							})
						})
					}
				}
			    return new Promise(function(resolve,rej){
			        //thisProject is available here since it's defined in the outer scope
			        thisProject.save(function(err,data) {
			        	resolve(data)
			        });
			    });
			})
			.then(function (thisProject){
			    // console.log('--------------->>>>', thisProject);
			    return Promise.map(imagesTab,function(imageproject,index){
			        return new Promise(function(resolve,rej){

			        	Imagearticle.find({id:imageproject.id}).then(function(foundedimagesprojects) {
			        		// console.log('foundedimagesprojects',foundedimagesprojects);
			        		if(foundedimagesprojects.length!=0)
			        		{
			        			resolve([foundedimagesprojects[0],index])
			        		}else{
			        			// resolve(
			        				// console.log(imageproject.image);
			        				return Image.find({id:imageproject.image.id}).then(function(img) {
				        				return Imagearticle.create({rank:0}).then(function(createdimageproject) {
				        					// console.log('img',img);
				        					createdimageproject.image = img[0].id;
				        					createdimageproject.project = thisProject.id;
				        					return createdimageproject.save().then(function(data){
				        						// imagesTab.splice(imagesTab.indexOf(imageproject),1,data)
				        						// console.log('data',data);
				        						resolve([data,index])
				        					})
				        				})
				        			})
			        			// )
			        			
			        		}
			        	})

			    	})
			    })
			})
			.then(function (imgproject,index){
				return Promise.map(imgproject,function(datas) {
					return Imagearticle.update(datas[0].id,{rank:datas[1]})
				})
			})
			.then(function (){
					
				return Promise.map(this.project.images,function(oldimg) {
					if(!_.contains(_.pluck(imagesTab,'id'),oldimg.id)){
						// console.log('NOT CONTAIN imageproject');
						return Imagearticle.destroy(oldimg.id)
					}else{
						return true;
					}
				})
				
			})
			.then(function (){
				var thisProject=this.project;
			    // console.log('--------------->>>>', thisProject);
			    return Promise.map(documentsTab,function(documentproject,index){
			        return new Promise(function(resolve,rej){

			        	Documentarticle.find({id:documentproject.id}).then(function(foundeddocumentsprojects) {
			        		// console.log('foundeddocumentsprojects',foundeddocumentsprojects);
			        		if(foundeddocumentsprojects.length!=0)
			        		{
			        			resolve([foundeddocumentsprojects[0],index])
			        		}else{
			        			// resolve(
			        				// console.log(documentproject.document);
			        				return Document.findOne({id:documentproject.document.id}).then(function(doc) {
			        					// console.log('doc',img);
				        				return Documentarticle.create({rank:0}).then(function(createddocumentproject) {
				        					// console.log('img',img);
				        					createddocumentproject.document = doc.id;
				        					createddocumentproject.project = thisProject.id;
				        					return createddocumentproject.save().then(function(data){resolve([data,index])})
				        				})
				        			})
			        			// )
			        			
			        		}
			        	})

			    	})
			    })
			})
			.then(function (docproject,index){
				// imgproject.rank=
				// console.log(docproject);
				// console.log('------' );
				return Promise.map(docproject,function(datas) {
					datas[0].rank=datas[1]
					return datas[0].save()
				})
				// return imgproject
			})
			.then(function (){
					
				return Promise.map(this.project.documents,function(oldimg) {
					// console.log('olddoc',oldimg);
					if(!_.contains(_.pluck(documentsTab,'id'),oldimg.id)){
						// console.log('NOT CONTAIN documentproject');
						return Documentarticle.destroy(oldimg.id)
					}else{
						return true;
					}
				})
				
			})
			.then(function (){
				var thisProject=this.project;
			    // console.log('--------------->>>>', thisProject);
			    return Promise.map(commentsTab,function(comment){
			    	
				    	var status= comment.status;
				    	var reponses= comment.reponses;
				    	// console.log('comment.comments',comment.comments);

				    			return new Promise(function(resolve,rej){

						        	Comment.find({id:comment.id}).populateAll().then(function(founded) {
						        		// console.log('foundeddocumentsprojects',foundeddocumentsprojects);
						        		if(founded.length!=0)
						        		{
						        			resolve([founded[0],status])
						        		}else{
						        			// resolve(
						        				// console.log(documentproject.document);
							        				return Comment.create(comment).then(function(createdcomment) {
							        					// console.log('img',img);
							        					createdcomment.project = thisProject.id;
							        					// console.log('HERE2');
							        					// createddocumentproject.project = thisProject.id;
							        					return createdcomment.save().then(function(data){resolve([data,status])})
							        				})

						        			// )
						        			
						        		}
						        	})
						    	}).then(function(result) {
						    		return new Promise(function(resolve,rej){

							    		if(reponses){
								    		
							    			// var reponses = comment.reponses;

								    		// console.log('COmment.reponses',reponses);
								    		
										    	return Promise.map(reponses,function(reponse){

										    		// console.log("reponse",reponse);
										    		// console.log("reponse.id",reponse.id);
										    		// console.log('CREATE');
										    		if(reponse.id)
										    		{
										    			return Reponse.findOne(reponse.id).then(function(re){

										    			// data.comment = comment.id
										    			// return data
										    				// console.log('datafound',re);
										    				re.status= reponse.status;
											    			return re.save().then()

										    			// resolve(then)
										    			})
										    		}else{
										    			// console.log(comment.id);
										    			reponse.comment=comment.id
										    			return Reponse.create(reponse).then(function(re){
										    				// console.log('re',re);
										    				re.comment=comment.id
											    			// console.log('data',re);
											    			// console.log('commentId=',comment.id);
											    			// console.log('commentId=',comment.id);
											    			// re.comment.add(comment.id);
											    			// re.email= 'comment@ttttttttttttttttttttttttttttttttttttttttttttttt.fr';
											    			return re.save().then()
										    			})
										    		}
										    		

										    	}).then(function(c) {

										    		// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><',c);
					
													// return Promise.map(c.comments,function(oldcom) {
													// 	// console.log('olddoc',oldimg);
													// 	if(!_.contains(_.pluck(commentsTab,'id'),oldcom.id)){
													// 		console.log('NOT CONTAIN');
													// 		return Comment.destroy(oldcom.id).then(function() {
													// 			resolve(result)
													// 		})

													// 	}else{
															resolve(result)
													// 	}
													// })
				
			
							    					 

										    	}) 
						    		// resolve(then)
					    				}else{
							    			resolve(result) 
							    		}
						    		})
						    	})
						    		
				    	
			    })
			})

			.then(function (comments,index){
				console.log('HERE3');
				// imgproject.rank=
				// console.log(comments);
				// console.log('------' );
				return Promise.map(comments,function(datas) {
					// console.log('datas',datas);
					// console.log('datas',datas);
					var com = datas[0];
					// console.log(com);
					var status = datas[1];
					// console.log(status);
					// data=datas[0]
					// console.log(data);
					// delete com.reponses;
					com.status=status;
					return Comment.update(com.id,{status:status})
				})
				// return imgproject
			})
			.then(function(comments) {
			    	return Promise.map(comments,function(oldcom) {
					// console.log('oldcom',oldcom);
						return Comment.findOne(oldcom[0].id).populate('reponses').then(function(foundedCom) {
							// console.log('foundedCom',foundedCom);
							// console.log('commentsTab',commentsTab);
							// console.log(_.pluck(commentsTab,'id'));
							var foundedInTabs = _.find(commentsTab,function(c) {
								console.log('c',c);
								if(c.nouvo==true)
									return true
								else
									return c.id ==foundedCom.id}
								);
							// console.log('foundedInTabs',foundedInTabs);

							return Promise.map(foundedCom.reponses,function(rep) {
								console.log('rep',rep);
								if(!_.contains(_.pluck(foundedInTabs.reponses,'content'),rep.content))
								{
									// console.log('NOT CONTAINT reponse');
									return Reponse.destroy(rep.id)
								}else
								{
									return true
								}
							})
							
						})
					// if(!_.contains(_.pluck(commentsTab,'id'),oldcom.id)){
					// 	console.log('NOT CONTAIN');
					// 	return Comment.destroy(oldcom.id)
					// }else{
					// 	return true;
					// }
				})
			})
			.then(function (){
					
				return Promise.map(this.project.comments,function(oldcom) {
					// console.log('olddoc',oldimg);
					if(!_.contains(_.pluck(commentsTab,'id'),oldcom.id)){
						// console.log('NOT CONTAIN Comment');
						return Comment.destroy(oldcom.id)
					}else{
						return true;
					}
				})
				
			})

			.then(function() {
				console.log('this.project',this.project);
				var oldtrans = this.project.translations
				return Promise.map(translations,function(translation) {
					// console.log(translation.id);
					// console.log(translation);
					if(translation.id){
						return ProjectTraduction.findOne(translation.id).then(function(founded) {
							return ProjectTraduction.update(translation.id,translation)
						})
					}else{
						translation.project = req.body.id;
						// console.log('translation = this.project.id;',req.body.id);
						return ProjectTraduction.create(translation).then(function(founded) {
							// console.log('founded',founded);
							founded.project = req.body.id
							return founded.save().then(function(toto) {
								// console.log('toto',toto);
							})

						})
					}
					
				}).then(function() {
					return Promise.map(oldtrans,function(trans) {
						console.log('trans',trans);
					if(!_.contains(_.pluck(translations,'id'),trans.id))
					{
						// console.log('NOT CONTAINT reponse');
						return ProjectTraduction.destroy(trans.id)
					}else
					{
						return true
					}
					})
					
				})
			})
			
			.then(function (){
				return Notification.find({'item':'project','itemid':req.body.id,'status':{'!' :['ok']}}).then(function (arguments) {
					
					console.log(arguments);
					return Promise.map(arguments,function (item) {
						item.status='ok';

						return item.save().then(function function_name (item) {
							Notification.publishUpdate(item.id,item)
						});
					})
				})
			})
			.then(function (thisProject){
				return Project.findOne(req.body.id).populateAll()
			})
			.then(function (project){
				// console.log(project);
				this.project = project
				return Promise.map(project.images,function(imageproject) {
					return Imagearticle.findOne(imageproject.id).populate('image')
				})
			})
			.then(function (allimage){
				// console.log('allimage',allimage);
				// console.log('one image',one image);
				this.project.images = allimage
				if(this.project.category)
				this.project.category = this.project.category.id
				if(this.project.author)
				this.project.author = this.project.author.id
				return Promise.map(this.project.documents,function(documentproject) {
					return Documentarticle.findOne(documentproject.id).populate('document')
				})
			})
			.then(function (alldocument){
				// console.log('alldocument',alldocument);
				this.project.documents = alldocument
				return Promise.map(this.project.comments,function(comment) {
					return Comment.findOne(comment.id).populate('reponses')
				})
			})
			.then(function (allcomment){
				// console.log('allcomment',allcomment);
				var projecttogo = _.clone(this.project)
				projecttogo.comments = allcomment;
				this.project = projecttogo;
				
			})
			.done(function() {
				console.log('DONE');
				// console.log(this.project);
				res.status(200).send(this.project)
				// this.project.save(function(err,data) {
				// 	console.log('SAVED');
				// })
			},function(e) {
				console.log('ERROR FUNCTION');
				console.log(e);
				res.status(400).send(e)
			});
			


		}
		else{
			return res.status(400).send('no body');
		}
	},
	delete:function  (req,res,next) {
		sails.log('delete');
		Project.destroy(req.params.id,function (err) {
				if(err) 
					res.status(400).send(err)
				else
					res.status(200).send({deleted:req.params.id})
		})
	}
};

