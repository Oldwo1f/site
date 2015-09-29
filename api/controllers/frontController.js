var Promise = require('bluebird');
var nodemailer = require('nodemailer');
var moment = require('moment');
var marked = require('marked');
var truncate = require('html-truncate');

module.exports={
	home:function(req,res,next) {

		console.log('home');
		
		Article.find({status:'actif'}).populate('translations').populate('images').sort('createdAt DESC').limit(3).exec(function (err,articles) {
			// body...
			console.log(err);
			console.log(articles);
			console.log(req.locale);
			// if(req.locale!= 'fr')
			// {
				return Promise.map(articles,function  (article) {
					console.log('---------------------------');
					return new Promise(function(resolve,rej){
						if(article.translations.length && req.locale!= 'fr'){
							console.log('we got Trad');
							_.map(article.translations,function  (trad) {
								console.log('---------------------------');
								if(trad.lang == req.locale){
									article.title = (trad.title) ? trad.title : article.title;
									article.content = (trad.content) ? trad.content : article.content;
									article.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : article.rewriteurl;
									article.keyword = (trad.keyword) ? trad.keyword : article.keyword;
									article.description = (trad.description) ? trad.description : article.description;
								}
							})
						}
						article.content = truncate(marked(article.content), 450)
						if(article.images.length)
						{
							var img0 = _.find(article.images, function(chr) {
							  return chr.rank == 0;
							})
							Image.findOne(img0.image).exec(function (err,datas) {
								console.log('datas',datas);
								article.img = datas

								resolve(article)
							})
						}else
						{
							resolve(article)
						}
					})
					
				}).then(function (articless) {
					console.log(articless);
					res.status(200).view('index',{
						articles:articles,
						marked:marked,
						title: req.__('SEO_HOME_title'),
						keyword: req.__('SEO_HOME_keyword'),
						description:req.__('SEO_HOME_description'),
						scripturl:'script.js',
						menu:'home',
						baseurl:'',

					})
				})
			// }
			
		})




	},	
	portfolio:function(req,res,next) {
		req.locale = req.locale || 'en'
		moment.locale(req.locale);
		baseurl='/'
		console.log('portfolio');
		async.parallel({
			projs:function  (cb) {
				Project.find({status:'actif'}).populateAll().sort('createdAt DESC').exec(function (err,projects) {
			
						return Promise.map(projects,function  (project) {
							console.log('---------------------------');
							return new Promise(function(resolve,rej){
								if(project.translations.length && req.locale!= 'fr'){
									// console.log('we got Trad');
									_.map(project.translations,function  (trad) {
										// console.log('---------------------------');
										if(trad.lang == req.locale){
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
									})
								}
								project.content = truncate(marked(project.content), 450)
								if(project.images.length)
								{
									console.log("IMG.LENGTH");
									var img0 = _.find(project.images, function(chr) {
									  return chr.rank == 0;
									})
									Image.findOne(img0.image).exec(function (err,datas) {
										// console.log('datas',datas);
										project.img = datas
										console.log(project);
										resolve(project)
									})
								}else
								{
									console.log("IMG.NOT NOT");
									console.log(project);
									resolve(project)
								}
							})
							
						}).then(function (projectss) {
							// console.log(projectss);
							cb(null,projects)
						})
					
				})
			},
			cats:function  (cb) {
				CategoryProject.find().populateAll().sort('name DESC').exec(function (err,cats) {
			 _.remove(cats,function (n) {
				return n.nbProjects <=0;
			})
						return Promise.map(cats,function  (cat) {
							return new Promise(function(resolve,rej){
								if(cat.translations.length && req.locale!= 'fr'){
									_.map(cat.translations,function  (trad) {
										if(trad.lang == req.locale){
											cat.name = (trad.name) ? trad.name : cat.name;
											// project.content = (trad.content) ? trad.content : project.content;
											// project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											// project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											// project.description = (trad.description) ? trad.description : project.description;
										}
									})

									resolve(cat)
								}else
								{
									resolve(cat)
								}
							})
							
						}).then(function (projectss) {
							cb(null,cats)
						})
					
				})
			}
		},function  (err,results) {
			// res.send(JSON.stringify(results,null, 10));
			res.status(200).view('portfolio',{
				'projects':results.projs,
				'categories':results.cats,
				title: req.__('SEO_PORTFO_title'),
				keyword: req.__('SEO_PORTFO_keyword'),
				description:req.__('SEO_PORTFO_description'),
				scripturl:'portfo.js',
				menu:'portfo',
				marked:marked,
				domain : sails.config.COMPANY_DOMAIN,
				baseurl:baseurl
			})
			// res.status(200).view('blog',{
			// 	articles:results.projs,
			// 	title: req.__('SEO_BLOG_title'),
			// 	keyword: req.__('SEO_BLOG_keyword'),
			// 	description:req.__('SEO_BLOG_description'),
			// 	scripturl:'portfo.js',
			// 	menu:'blog',
			// 	marked:marked,
			// 	nbPage:nbPage,
			// 	thiscategory:null,
			// 	currentPage:page,
			// 	mostseen:results.mostseen,
			// 	category:results.cats,
			// 	moment: moment,
			// 	baseurl:baseurl
			// })
		})
		




	},	
	avendre:function(req,res,next) {
		req.locale = req.locale || 'en'
		moment.locale(req.locale);
		baseurl='/'
		console.log('avendre');
		async.parallel({
			projs:function  (cb) {
				Project.find({status:'actif'}).populateAll().sort('createdAt DESC').exec(function (err,projects) {
			
						return Promise.map(projects,function  (project) {
							console.log('---------------------------');
							return new Promise(function(resolve,rej){
								if(project.translations.length && req.locale!= 'fr'){
									// console.log('we got Trad');
									_.map(project.translations,function  (trad) {
										// console.log('---------------------------');
										if(trad.lang == req.locale){
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
									})
								}
								project.content = truncate(marked(project.content), 450)
								if(project.images.length)
								{
									console.log("IMG.LENGTH");
									var img0 = _.find(project.images, function(chr) {
									  return chr.rank == 0;
									})
									Image.findOne(img0.image).exec(function (err,datas) {
										// console.log('datas',datas);
										project.img = datas
										// console.log(project);
										resolve(project)
									})
								}else
								{
									console.log("IMG.NOT NOT");
									// console.log(project);
									resolve(project)
								}
							})
							
						}).then(function (projectss) {
							var projects =[];
							 // _.filter(projectss, function(n) {
							// 	if(n.tags.length)
							// 	{
							// 		// if(_.includes(n.tags,'A-vendre'))
							// 		return true;
							// 	}
							//   	return false;
							// });

							console.log(projects);
							for(var i in projectss)
							{
								if(projectss[i].tags.length){
										console.log('Tags.length');
									for(var j in projectss[i].tags){

										console.log(projectss[i].tags[j].text);
										if(projectss[i].tags[j].text == 'A-vendre'){
											projects.push(projectss[i])
										}
									}
								}
							}
							console.log(projects);
							cb(null,projects)
						})
					
				})
			},
			cats:function  (cb) {
				CategoryProject.find().populateAll().sort('name DESC').exec(function (err,cats) {
			 _.remove(cats,function (n) {
				return n.nbProjects <=0;
			})
						return Promise.map(cats,function  (cat) {
							return new Promise(function(resolve,rej){
								if(cat.translations.length && req.locale!= 'fr'){
									_.map(cat.translations,function  (trad) {
										if(trad.lang == req.locale){
											cat.name = (trad.name) ? trad.name : cat.name;
											// project.content = (trad.content) ? trad.content : project.content;
											// project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											// project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											// project.description = (trad.description) ? trad.description : project.description;
										}
									})

									resolve(cat)
								}else
								{
									resolve(cat)
								}
							})
							
						}).then(function (projectss) {
							cb(null,cats)
						})
					
				})
			}
		},function  (err,results) {
			// res.send(JSON.stringify(results,null, 10));
			res.status(200).view('avendre',{
				'projects':results.projs,
				'categories':results.cats,
				title: req.__('SEO_AVENDRE_title'),
				keyword: req.__('SEO_AVENDRE_keyword'),
				description:req.__('SEO_AVENDRE_description'),
				scripturl:'portfo.js',
				menu:'portfo',
				marked:marked,
				domain : sails.config.COMPANY_DOMAIN,
				baseurl:baseurl
			})
			// res.status(200).view('blog',{
			// 	articles:results.projs,
			// 	title: req.__('SEO_BLOG_title'),
			// 	keyword: req.__('SEO_BLOG_keyword'),
			// 	description:req.__('SEO_BLOG_description'),
			// 	scripturl:'portfo.js',
			// 	menu:'blog',
			// 	marked:marked,
			// 	nbPage:nbPage,
			// 	thiscategory:null,
			// 	currentPage:page,
			// 	mostseen:results.mostseen,
			// 	category:results.cats,
			// 	moment: moment,
			// 	baseurl:baseurl
			// })
		})
		




	},
	projet:function(req,res,next) {

		console.log(req.locale);
		req.locale = req.locale || 'en'
		moment.locale(req.locale)
		baseurl='/../'
		if(req.params.page){
			baseurl='/../../'
			page = req.params.page;
		}
		console.log("FETCH ONE project");
		
				Project.find(req.params.id).populateAll().exec(function (err,items){
						

						
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
								console.log(items[0].nbView);
								items[0].nbView= Number(items[0].nbView) + 1;
								Project.update({id: items[0].id}, {nbView: items[0].nbView})
								.exec(function(err, updatedProject){

									console.log("-----------------------------------------------------------------------------------");
									console.log(items[0].id);

									console.log(err);
									console.log("-----------------------------------------------------------------------------------");
									console.log(updatedProject);
									console.log("-----------------------------------------------------------------------------------");
									console.log("-----------------------------------------------------------------------------------");
									console.log("-----------------------------------------------------------------------------------");
									console.log("-----------------------------------------------------------------------------------");
									console.log("-----------------------------------------------------------------------------------");
									console.log("-----------------------------------------------------------------------------------");
									console.log("-----------------------------------------------------------------------------------");
									console.log("-----------------------------------------------------------------------------------");
									console.log(items[0].nbView);
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
								translations:function(cbparalelle) {
									async.map(project.translations,
									function(trad,cb1) {
										console.log(trad);
										if(trad.lang == req.locale){
											console.log('locale');
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
										cb1(null,project)

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								comment:function(cbparalelle) {
											console.log('------------------------------');
											// console.log(project.comments);
											_.remove(project.comments,function (n) {
												return n.status != 'success'
											})
											var allcomments = [];
										// _.sortBy(project.comments,function (n) {
										// 	return new Date(n.createdAt)
										// })
											project.comments = project.comments.reverse()

									async.mapSeries(project.comments,
									function(item1,cb1) {
										// console.log('item1',item1);
										Comment.find(item1.id).populate('reponses',{ where:{status:'success'}}).exec(function(err,data) {
											// item1.comment=data
											// console.log(data);
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
										// console.log('allcomments',allcomments);
										cbparalelle(null,allcomments)
									})
								},
								// mostseen:function  (cb) {
								// 	Article.find({where:{status:'actif'},sort:'nbView DESC',limit:5}).populateAll().exec(function (err,projects) {
								
								// 			return Promise.map(projects,function  (project) {
								// 				return new Promise(function(resolve,rej){
								// 					if(project.translations.length && req.locale!= 'fr'){
								// 						_.map(project.translations,function  (trad) {
								// 							if(trad.lang == req.locale){
								// 								project.title = (trad.title) ? trad.title : project.title;
								// 								project.content = (trad.content) ? trad.content : project.content;
								// 								project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
								// 								project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
								// 								project.description = (trad.description) ? trad.description : project.description;
								// 							}
								// 						})
								// 					}
								// 					project.content = truncate(marked(project.content), 450)
								// 					if(project.images.length)
								// 					{
								// 						var img0 = _.find(project.images, function(chr) {
								// 						  return chr.rank == 0;
								// 						})
								// 						Image.findOne(img0.image).exec(function (err,datas) {
								// 							project.img = datas
								// 							resolve(project)
								// 						})
								// 					}else
								// 					{
								// 						resolve(project)
								// 					}
								// 				})
												
								// 			}).then(function (projectss) {
								// 				cb(null,projects)
								// 			})
										
								// 	})
								// },
								cats:function  (cb) {
									CategoryProject.find().populateAll().sort('name DESC').exec(function (err,cats) {
											 _.remove(cats,function (n) {
												return n.nbArticles <=0;
											})
											return Promise.map(cats,function  (cat) {
												return new Promise(function(resolve,rej){
													if(cat.translations.length && req.locale!= 'fr'){
														console.log('we got Trad');
														_.map(cat.translations,function  (trad) {
															if(trad.lang == req.locale){
																cat.name = (trad.name) ? trad.name : cat.name;
																
															}
														})

														resolve(cat)
													}else
													{
														resolve(cat)
													}
												})
												
											}).then(function (projectss) {
												cb(null,cats)
											})
										
									})
								}
							},function(err,ress) {

 										console.log('DELETE');
									if(project.category)
										project.category=project.category.id;
									

									var projecttogo = _.clone(project)

									delete projecttogo.comments
									projecttogo.comments=ress.comment
									// console.log(projecttogo.comments);
									// console.log(projecttogo);
									console.log('Final Data');

									var pathtoshare ='';
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/';
									if(projecttogo.urlrewrite)
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/'+projecttogo.urlrewrite;



									// console.log('fetch ONE Project', projecttogo);
									// res.status(200).send(projecttogo)
									res.status(200).view('project',{
										'project':projecttogo,
										pathtoshare:pathtoshare,
										'title': projecttogo.title +' - Project - AAVO',
										keyword: projecttogo.keyword,
										description:projecttogo.description,
										menu:'blog',
										marked:marked,
										// mostseen:ress.mostseen,
										category:ress.cats,
										moment: moment,
										baseurl:baseurl,
										domain : sails.config.URL_HOME
									})
								})
							})
							
						}
							
								
								// callback(null,items);

	
						
				});
		
		   
	},
	addCommentProj:function(req,res,next) {

		Project.findOne(req.params.itemid).exec(function (err,project) {
			Comment.create({
				author:req.body.author,
		  		email:req.body.email,
		  		content:req.body.content,
		  		status:'new',
		  		project:req.params.itemid
	  		}).exec(function (err,coment){
									console.log(err)
				if(err)
					res.status(400).send(err)
				else{

				Notification.create({type:'projectcomment',status:'todo',info1:project.title,info2:'par '+coment.author,item:'project',itemid:req.params.itemid}).exec(function (err,notif){
						console.log(err)
						console.log(notif)
						 Notification.publishCreate(notif);
			    	res.status(200).send(coment)
				});
				}
			});
		})
	},
	addReponseProj:function(req,res,next) {

		console.log('addCommentProj');
		console.log(req.params.itemid);
		console.log(req.params.projid);
		
		
		console.log('projid',req.params.projid);
		

		Project.findOne(req.params.projid).exec(function (err,article) {
			Comment.findOne(req.params.itemid).exec(function (err,comment) {

				console.log(comment);
				Reponse.create({author:req.body.name,
		  		email:req.body.email,
		  		content:req.body.message,
		  		status:'new',
		  		comment:req.params.itemid
		  		}).exec(function (err,coment){
										console.log(err)
					if(err)
						res.status(400).send(err)
					else{

					Notification.create({type:'projectcomment',status:'todo',info1:article.title,info2:'par '+coment.author,item:'project',itemid:req.params.projid}).exec(function (err,notif){
							console.log(err)
							console.log(notif)
							 Notification.publishCreate(notif);
				    		// res.status(200).send(created);
				    	res.status(200).send(coment)
					});
					}
				});
			})
		})
		
		

	},
	blog:function(req,res,next) {
		req.locale = req.locale || 'en'
		moment.locale(req.locale);
		page = 1;
		nbperpage = 2;
		baseurl='/'
		if(req.params.page){
			baseurl='/../'
			page = req.params.page;
		}

		console.log('blog');
		async.parallel({
			projs:function  (cb) {
				Article.find({where:{status:'actif'},sort:'date DESC',skip:(page-1)*nbperpage,limit:nbperpage}).populateAll().exec(function (err,projects) {
			
						return Promise.map(projects,function  (project) {
							// console.log('---------------------------');
							return new Promise(function(resolve,rej){
								if(project.translations.length && req.locale!= 'fr'){
									// console.log('we got Trad');
									_.map(project.translations,function  (trad) {
										// console.log('---------------------------');
										if(trad.lang == req.locale){
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
									})
								}
								project.content = truncate(marked(project.content), 450)
								if(project.images.length)
								{
									var img0 = _.find(project.images, function(chr) {
									  return chr.rank == 0;
									})
									Image.findOne(img0.image).exec(function (err,datas) {
										// console.log('datas',datas);
										project.img = datas

										resolve(project)
									})
								}else
								{
									resolve(project)
								}
							})
							
						}).then(function (projectss) {
							// console.log(projectss);
							cb(null,projects)
						})
					
				})
			},
			mostseen:function  (cb) {
				Article.find({where:{status:'actif'},sort:'nbView DESC',limit:5}).populateAll().exec(function (err,projects) {
			
						return Promise.map(projects,function  (project) {
							return new Promise(function(resolve,rej){
								if(project.translations.length && req.locale!= 'fr'){
									_.map(project.translations,function  (trad) {
										if(trad.lang == req.locale){
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
									})
								}
								project.content = truncate(marked(project.content), 450)
								if(project.images.length)
								{
									var img0 = _.find(project.images, function(chr) {
									  return chr.rank == 0;
									})
									Image.findOne(img0.image).exec(function (err,datas) {
										project.img = datas
										resolve(project)
									})
								}else
								{
									resolve(project)
								}
							})
							
						}).then(function (projectss) {
							cb(null,projects)
						})
					
				})
			},
			count:function(cb) {

				Article.count({where:{status:'actif'}}).exec(function(err,data) {
					console.log(data);
					// console.log(datastogo);
					return cb(null,data)
			

				})
				
			},
			cats:function  (cb) {
				CategoryBlog.find().populateAll().sort('name DESC').exec(function (err,cats) {
			console.log(err);
			console.log(cats);
			 _.remove(cats,function (n) {
				return n.nbArticles <=0;
			})
						return Promise.map(cats,function  (cat) {
							console.log('---------------------------');
							return new Promise(function(resolve,rej){
								console.log(cat.translations.length);
								if(cat.translations.length && req.locale!= 'fr'){
									console.log('we got Trad');
									_.map(cat.translations,function  (trad) {
										console.log('---------------------------');
										if(trad.lang == req.locale){
											console.log('local cool');
											cat.name = (trad.name) ? trad.name : cat.name;
											
										}
									})

									resolve(cat)
								}else
								{
									resolve(cat)
								}
							})
							
						}).then(function (projectss) {
							cb(null,cats)
						})
					
				})
			}
		},function  (err,results) {
			console.log(err);
			console.log('results');
			console.log(results.cats);
			var nbPage = Math.ceil(results.count / nbperpage)
			// console.log(results);
			res.status(200).view('blog',{
				articles:results.projs,
				title: req.__('SEO_BLOG_title'),
				keyword: req.__('SEO_BLOG_keyword'),
				description:req.__('SEO_BLOG_description'),
				scripturl:'portfo.js',
				menu:'blog',
				marked:marked,
				nbPage:nbPage,
				thiscategory:null,
				currentPage:page,
				mostseen:results.mostseen,
				category:results.cats,
				moment: moment,
				baseurl:baseurl
			})
		})




	},
	category:function(req,res,next) {

		console.log('CATEGORY====>',req.params.thiscat);
		req.locale = req.locale || 'en'
		moment.locale(req.locale);
		page = 1;
		nbperpage = 2;
		baseurl='/../'
		if(req.params.page){
			baseurl='/../../'
			page = req.params.page;
		}

		async.parallel({
			projs:function  (cb) {
				Article.find({where:{status:'actif',category:req.params.thiscat},sort:'date DESC',skip:(page-1)*nbperpage,limit:nbperpage}).populateAll().exec(function (err,projects) {
					console.log(projects);
						return Promise.map(projects,function  (project) {
							// console.log('---------------------------');
							return new Promise(function(resolve,rej){
								if(project.translations.length && req.locale!= 'fr'){
									// console.log('we got Trad');
									_.map(project.translations,function  (trad) {
										// console.log('---------------------------');
										if(trad.lang == req.locale){
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
									})
								}
								project.content = truncate(marked(project.content), 450)
								if(project.images.length)
								{
									var img0 = _.find(project.images, function(chr) {
									  return chr.rank == 0;
									})
									Image.findOne(img0.image).exec(function (err,datas) {
										// console.log('datas',datas);
										project.img = datas

										resolve(project)
									})
								}else
								{
									resolve(project)
								}
							})
							
						}).then(function (projectss) {
							// console.log(projectss);
							cb(null,projects)
						})
					
				})
			},
			catThis:function(cb) {
				CategoryBlog.findOne(req.params.thiscat).populateAll().exec(function(err,data) {
				if(err)
					cb(err)

					console.log(data);
					console.log("datadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadata");
					return new Promise(function(resolve,rej){
								if(data.translations.length && req.locale!= 'fr'){
									console.log('we got Trad');
									_.map(data.translations,function  (trad) {
										if(trad.lang == req.locale){
											data.name = (trad.name) ? trad.name : data.name;
											
										}
									})

									resolve(data)
								}else
								{
									resolve(data)
								}
							}).then(function(category) {cb(null,category);})
				})
					
			},
			mostseen:function  (cb) {
				Article.find({where:{status:'actif'},sort:'nbView DESC',limit:5}).populateAll().exec(function (err,projects) {
			
						return Promise.map(projects,function  (project) {
							return new Promise(function(resolve,rej){
								if(project.translations.length && req.locale!= 'fr'){
									_.map(project.translations,function  (trad) {
										if(trad.lang == req.locale){
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
									})
								}
								project.content = truncate(marked(project.content), 450)
								if(project.images.length)
								{
									var img0 = _.find(project.images, function(chr) {
									  return chr.rank == 0;
									})
									Image.findOne(img0.image).exec(function (err,datas) {
										project.img = datas
										resolve(project)
									})
								}else
								{
									resolve(project)
								}
							})
							
						}).then(function (projectss) {
							cb(null,projects)
						})
					
				})
			},
			count:function(cb) {

				Article.count({where:{status:'actif',category:req.params.thiscat}}).exec(function(err,data) {
					console.log(data);
					// console.log(datastogo);
					return cb(null,data)
			

				})
				
			},
			cats:function  (cb) {
				CategoryBlog.find().populateAll().sort('name DESC').exec(function (err,cats) {
			 _.remove(cats,function (n) {
				return n.nbArticles <=0;
			})
						return Promise.map(cats,function  (cat) {
							return new Promise(function(resolve,rej){
								if(cat.translations.length && req.locale!= 'fr'){
									console.log('we got Trad');
									_.map(cat.translations,function  (trad) {
										if(trad.lang == req.locale){
											cat.name = (trad.name) ? trad.name : cat.name;
											
										}
									})

									resolve(cat)
								}else
								{
									resolve(cat)
								}
							})
							
						}).then(function (projectss) {
							cb(null,cats)
						})
					
				})
			}
		},function  (err,results) {
			console.log('results');
			var nbPage = Math.ceil(results.count / nbperpage)
			console.log(results);
			// res.status(200).view('blog',{
			// 	articles:results.projs,
			// 	title: results.catThis.name + req.__('SEO_BLOG_title'),
			// 	keyword: results.catThis.name + req.__('SEO_BLOG_keyword'),
			// 	description: req.__('SEO_BLOG_description'),
			// 	scripturl:'portfo.js',
			// 	menu:'blog',
			// 	marked:marked,
			// 	nbPage:nbPage,
			// 	thiscategory:results.catThis,
			// 	currentPage:page,
			// 	mostseen:results.mostseen,
			// 	category:results.cats,
			// 	moment: moment,
			// 	baseurl:baseurl
			// })
			res.status(200).view('blog',{
				articles:results.projs,
				title: req.__('SEO_BLOG_title'),
				keyword: req.__('SEO_BLOG_keyword'),
				description:req.__('SEO_BLOG_description'),
				scripturl:'portfo.js',
				menu:'blog',
				marked:marked,
				nbPage:nbPage,
				thiscategory:results.catThis,
				currentPage:page,
				mostseen:results.mostseen,
				category:results.cats,
				moment: moment,
				baseurl:baseurl
			})
		})




	},
	article:function(req,res,next) {
		console.log(req.locale);
		req.locale = req.locale || 'en'
		moment.locale(req.locale)

		baseurl='/../'
		if(req.params.page){
			baseurl='/../../'
			page = req.params.page;
		}

		
				Article.find(req.params.id).populateAll().exec(function (err,items){
						

						
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
								// items[0].nbView= Number(items[0].nbView) + 1;
								items[0].nbView= Number(items[0].nbView) + 1

								Article.update({id: items[0].id}, {nbView: items[0].nbView})
								.exec(function(err, updatedProject){
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
								translations:function(cbparalelle) {
									async.map(project.translations,
									function(trad,cb1) {
										console.log(trad);
										if(trad.lang == req.locale){
											console.log('locale');
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
										cb1(null,project)

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								comment:function(cbparalelle) {
											console.log('------------------------------');
											// console.log(project.comments);
											_.remove(project.comments,function (n) {
												return n.status != 'success'
											})
											var allcomments = [];
										// _.sortBy(project.comments,function (n) {
										// 	return new Date(n.createdAt)
										// })
											project.comments = project.comments.reverse()

									async.mapSeries(project.comments,
									function(item1,cb1) {
										// console.log('item1',item1);
										Comment.find(item1.id).populate('reponses',{ where:{status:'success'}}).exec(function(err,data) {
											// item1.comment=data
											// console.log(data);
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
										// console.log('allcomments',allcomments);
										cbparalelle(null,allcomments)
									})
								},
								mostseen:function  (cb) {
									Article.find({where:{status:'actif'},sort:'nbView DESC',limit:5}).populateAll().exec(function (err,projects) {
								
											return Promise.map(projects,function  (project) {
												return new Promise(function(resolve,rej){
													if(project.translations.length && req.locale!= 'fr'){
														_.map(project.translations,function  (trad) {
															if(trad.lang == req.locale){
																project.title = (trad.title) ? trad.title : project.title;
																project.content = (trad.content) ? trad.content : project.content;
																project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
																project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
																project.description = (trad.description) ? trad.description : project.description;
															}
														})
													}
													project.content = truncate(marked(project.content), 450)
													if(project.images.length)
													{
														var img0 = _.find(project.images, function(chr) {
														  return chr.rank == 0;
														})
														Image.findOne(img0.image).exec(function (err,datas) {
															project.img = datas
															resolve(project)
														})
													}else
													{
														resolve(project)
													}
												})
												
											}).then(function (projectss) {
												cb(null,projects)
											})
										
									})
								},cats:function  (cb) {
									CategoryBlog.find().populateAll().sort('name DESC').exec(function (err,cats) {
											 _.remove(cats,function (n) {
												return n.nbArticles <=0;
											})
											return Promise.map(cats,function  (cat) {
												return new Promise(function(resolve,rej){
													if(cat.translations.length && req.locale!= 'fr'){
														console.log('we got Trad');
														_.map(cat.translations,function  (trad) {
															if(trad.lang == req.locale){
																cat.name = (trad.name) ? trad.name : cat.name;
																
															}
														})

														resolve(cat)
													}else
													{
														resolve(cat)
													}
												})
												
											}).then(function (projectss) {
												cb(null,cats)
											})
										
									})
								}
							},function(err,ress) {

 										console.log('DELETE');
									if(project.category)
										project.category=project.category.id;
									

									var projecttogo = _.clone(project)

									delete projecttogo.comments
									projecttogo.comments=ress.comment
									// console.log(projecttogo.comments);
									// console.log(projecttogo);
									console.log('Final Data');

									var pathtoshare ='';
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/';
									if(projecttogo.urlrewrite)
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/'+projecttogo.urlrewrite;



									// console.log('fetch ONE Project', projecttogo);
									// res.status(200).send(projecttogo)
									res.status(200).view('article',{
										'article':projecttogo,
										pathtoshare:pathtoshare,
										'title': projecttogo.title +' - BLOG - AAVO',
										keyword: projecttogo.keyword,
										description:projecttogo.description,
										scripturl:'article.js',
										menu:'blog',
										marked:marked,
										mostseen:ress.mostseen,
										category:ress.cats,
										coments:ress.comment,
										moment: moment,
										baseurl:baseurl,
										domain : sails.config.URL_HOME
									})
								})
							});		
						}
							
								
								// callback(null,items);

	
						
				});
		
		   
	},
	addCommentArticle:function(req,res,next) {

		console.log('addCommentARTICLE');
		console.log(req.params.itemid);
		

		Article.findOne(req.params.itemid).exec(function (err,article) {
			console.log(article);
			Comment.create({author:req.body.author,
	  		email:req.body.email,
	  		content:req.body.content,
	  		status:'new',
	  		article:req.params.itemid
	  		}).exec(function (err,coment){
									console.log(err)
				if(err)
					res.status(400).send(err)
				else{

				Notification.create({type:'articlecomment',status:'todo',info1:article.title,info2:'par '+coment.author,item:'article',itemid:req.params.itemid}).exec(function (err,notif){
						console.log(err)
						console.log(notif)
						 Notification.publishCreate(notif);
			    		// res.status(200).send(created);
			    	res.status(200).send(coment)
				});
				}
			});
		})
		
		

	},
	addReponseArticle:function(req,res,next) {

		console.log('addCommentProj');
		console.log(req.params.itemid);
		console.log('projid',req.params.projid);
		

		Article.findOne(req.params.projid).exec(function (err,article) {
			Comment.findOne(req.params.itemid).exec(function (err,comment) {
				console.log(comment);
				Reponse.create({author:req.body.name,
		  		email:req.body.email,
		  		content:req.body.message,
		  		status:'new',
		  		comment:req.params.itemid
		  		}).exec(function (err,coment){
										console.log(err)
					if(err)
						res.status(400).send(err)
					else{

					Notification.create({type:'articlecomment',status:'todo',info1:article.title,info2:'par '+coment.author,item:'article',itemid:req.params.projid}).exec(function (err,notif){
							console.log(err)
							console.log(notif)
							 Notification.publishCreate(notif);
				    		// res.status(200).send(created);
				    	res.status(200).send(coment)
					});
					}
				});
			})
		})
		
		

	},
	contactEmail:function(req,res,next) {

		console.log('contactEmailcontactEmailcontactEmailcontactEmailcontactEmailcontactEmail');
		console.log(req.body.message);
		console.log(req.body.name);
		console.log(req.body.email);
		if(req.body.message && req.body.name && req.body.email)
		{
			console.log('contactEmail ----> true');
			var transporter = nodemailer.createTransport({
				    service: 'Gmail',
				    auth: {
				        user: sails.config.MAIN_EMAIL_GOOGLE,
						pass: sails.config.MAIN_EMAIL_GOOGLE_PWD
				    }
				})
			
			var mailOptions = {
			    from: req.body.name+' <'+req.body.email+'>', // sender address
			    to: sails.config.MAIN_EMAIL, // list of receivers
			    subject: 'Site - '+ sails.config.COMPANY_NAME +' - contact : '+ req.body.name +' - '+req.body.subject, // Subject line
			    text: req.body.message // html body
			};
			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){

				console.log('here');
				console.log(error);
				console.log(info);
			    if(error){
			        res.status(400).send('mail error');
			    }else{

					res.status(200).send('mail sended');

			    }
			});
		}else{
			res.status(400).send('field error');
		}
	},
	contact:function(req,res) {
			return res.status(200).view('contact',{
				title: req.__('SEO_CONTACT_title'),
				keyword: req.__('SEO_CONTACT_keyword'),
				description:req.__('SEO_CONTACT_description'),
				scripturl:'portfo.js',
				menu:'contact',
				baseurl:''
			})
	},	
	presta:function(req,res) {
			return res.view('presta',{baseurl:'',title:'Contact - Street Colors',keyword:'Street Colors, street, colors, couleurs, grafitis,grafiti,tag,graff,graf,blog, Associationstreetcolor, Associations Chateau Thierry',description:'Contact Street colors'});
	},	
}
